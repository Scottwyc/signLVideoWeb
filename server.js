const express = require('express');
const multer = require('multer');
const uploadToDrive = require('google-drive-uploader');
const {JWT} = require('google-auth-library');
const dotenv = require('dotenv');
const fs = require('fs/promises');
const path = require('path');
const os = require('os');
const crypto = require('crypto');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = path.join(__dirname, 'public');
const TMP_DIR = path.join(os.tmpdir(), 'global-video-upload-portal');
const DRIVE_SCOPE = 'https://www.googleapis.com/auth/drive';

app.disable('x-powered-by');
app.use(express.static(PUBLIC_DIR));

const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    try {
      await fs.mkdir(TMP_DIR, {recursive: true});
      cb(null, TMP_DIR);
    } catch (error) {
      cb(error);
    }
  },
  filename: (req, file, cb) => {
    const stamp = Date.now();
    const suffix = crypto.randomBytes(4).toString('hex');
    cb(null, `${stamp}-${suffix}-${sanitizeFileName(file.originalname)}`);
  }
});

const upload = multer({
  storage
});

let authClientPromise = null;

function sanitizeFileName(name) {
  return path.basename(name).replace(/[\\/:*?"<>|]/g, '_').trim() || 'file';
}

function normalizeText(value) {
  return String(value || '').trim();
}

function isRealDriveConfigured() {
  return Boolean(
    process.env.GOOGLE_DRIVE_FOLDER_ID &&
    process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL &&
    process.env.GOOGLE_PRIVATE_KEY
  );
}

async function getAuthClient() {
  if (!authClientPromise) {
    authClientPromise = (async () => {
      const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
      const privateKey = (process.env.GOOGLE_PRIVATE_KEY || '').replace(/\\n/g, '\n');

      if (!clientEmail || !privateKey) {
        throw new Error('Missing Google Drive service account credentials.');
      }

      const auth = new JWT(clientEmail, null, privateKey, [DRIVE_SCOPE]);
      await auth.authorize();
      return auth;
    })();
  }

  return authClientPromise;
}

async function uploadFileToDrive(filePath, remoteName, mimeType, folderId, auth) {
  const result = await uploadToDrive({
    path: filePath,
    filename: remoteName,
    folderId,
    mimeType: mimeType || 'application/octet-stream',
    auth
  });

  return result;
}

async function cleanupFiles(fileList) {
  await Promise.allSettled(
    fileList.map(async (file) => {
      if (file && file.path) {
        await fs.unlink(file.path).catch(() => {});
      }
    })
  );
}

function buildSubmissionId() {
  return `${new Date().toISOString().replace(/[:.]/g, '-')}-${crypto.randomBytes(3).toString('hex')}`;
}

function validatePayload(fields, files) {
  const required = ['name', 'organization', 'email', 'countries'];
  for (const key of required) {
    if (!normalizeText(fields[key])) {
      return `${key} is required.`;
    }
  }

  if (!files || files.length === 0) {
    return 'At least one video file is required.';
  }

  return null;
}

app.get('/api/health', (req, res) => {
  res.json({
    ok: true,
    mode: isRealDriveConfigured() ? 'drive' : 'mock'
  });
});

app.post('/api/upload', upload.array('videos'), async (req, res) => {
  const files = req.files || [];
  const body = req.body || {};
  const fields = {
    name: normalizeText(body.name),
    organization: normalizeText(body.organization),
    email: normalizeText(body.email),
    countries: normalizeText(body.countries),
    others: normalizeText(body.others)
  };
  const validationError = validatePayload(fields, files);

  if (validationError) {
    await cleanupFiles(files);
    return res.status(400).json({ok: false, error: validationError});
  }

  const submissionId = buildSubmissionId();
  const safeBase = sanitizeFileName(`${fields.name || 'anonymous'}-${submissionId}`);
  const folderId = process.env.GOOGLE_DRIVE_FOLDER_ID || null;
  const useDrive = isRealDriveConfigured();
  const uploadedFiles = [];

  try {
    if (useDrive) {
      const auth = await getAuthClient();
      for (let index = 0; index < files.length; index += 1) {
        const file = files[index];
        const originalName = sanitizeFileName(file.originalname);
        const remoteName = `${safeBase}-${String(index + 1).padStart(2, '0')}-${originalName}`;
        const uploaded = await uploadFileToDrive(file.path, remoteName, file.mimetype, folderId, auth);
        uploadedFiles.push({
          id: uploaded.id,
          name: remoteName,
          size: uploaded.size,
          mimeType: uploaded.mimeType
        });
      }
    } else {
      const mockDir = path.join(__dirname, 'mock-drive', safeBase);
      await fs.mkdir(mockDir, {recursive: true});
      for (let index = 0; index < files.length; index += 1) {
        const file = files[index];
        const remoteName = `${safeBase}-${String(index + 1).padStart(2, '0')}-${sanitizeFileName(file.originalname)}`;
        const targetPath = path.join(mockDir, remoteName);
        await fs.copyFile(file.path, targetPath);
        uploadedFiles.push({
          id: `${submissionId}-${index + 1}`,
          name: remoteName,
          size: file.size,
          mimeType: file.mimetype || 'application/octet-stream'
        });
      }
    }

    const metadata = {
      submissionId,
      submittedAt: new Date().toISOString(),
      ...fields,
      files: uploadedFiles.map((file) => ({
        id: file.id,
        name: file.name,
        size: file.size,
        mimeType: file.mimeType
      }))
    };

    const metadataPath = path.join(TMP_DIR, `${submissionId}-metadata.json`);
    await fs.writeFile(metadataPath, JSON.stringify(metadata, null, 2), 'utf8');

    if (useDrive) {
      const auth = await getAuthClient();
      const metadataResult = await uploadFileToDrive(
        metadataPath,
        `${safeBase}-submission.json`,
        'application/json',
        folderId,
        auth
      );
      uploadedFiles.push({
        id: metadataResult.id,
        name: `${safeBase}-submission.json`,
        size: metadataResult.size,
        mimeType: metadataResult.mimeType
      });
    } else {
      const mockDir = path.join(__dirname, 'mock-drive', safeBase);
      await fs.mkdir(mockDir, {recursive: true});
      await fs.copyFile(metadataPath, path.join(mockDir, `${safeBase}-submission.json`));
    }

    await fs.unlink(metadataPath).catch(() => {});
    await cleanupFiles(files);

    res.json({
      ok: true,
      mode: useDrive ? 'drive' : 'mock',
      submissionId,
      fileCount: files.length,
      uploadedFiles,
      folderUrl: useDrive ? `https://drive.google.com/drive/folders/${folderId}` : null
    });
  } catch (error) {
    await cleanupFiles(files);
    await fs.unlink(path.join(TMP_DIR, `${submissionId}-metadata.json`)).catch(() => {});
    console.error('Upload failed:', error);
    res.status(500).json({
      ok: false,
      error: 'Upload failed. Check Google Drive credentials, folder sharing, and server logs.'
    });
  }
});

app.get('*', (req, res) => {
  res.sendFile(path.join(PUBLIC_DIR, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Drive mode: ${isRealDriveConfigured() ? 'real upload' : 'mock upload'}`);
});
