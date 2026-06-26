const SPREADSHEET_ID = '1UcsBA46ws9DZX7_Q7TtgC99zEkwowQR9O2iOaBShPvo';
const ROOT_FOLDER_ID = '1VGHiAHHnHO9MjaDRPdKTFr2LSbFh_I43';
const SHEET_NAME = 'Submissions';
const BRIDGE_SOURCE = 'video-upload-portal-apps-script';
const RENAME_UPLOADED_FILES = true;

const HEADERS = [
  'submission_id',
  'submitted_at',
  'name',
  'organization',
  'email',
  'countries',
  'others',
  'folder_id',
  'folder_url',
  'status',
  'completed_at',
  'file_count',
  'upload_file_names',
  'annotated_at',
  'notes',
  'user_agent'
];

function doPost(e) {
  let request = {};
  let response;

  try {
    request = parseRequest_(e);
    if (request.action === 'createSubmission') {
      response = createSubmission_(request);
    } else if (request.action === 'confirmUpload') {
      response = confirmUpload_(request);
    } else {
      throw new Error('Unsupported action.');
    }
  } catch (error) {
    response = {
      ok: false,
      requestId: request.requestId || '',
      error: error.message || 'Request failed.'
    };
  }

  return renderBridgeResponse_(response);
}

function parseRequest_(e) {
  const payload = e && e.parameter && e.parameter.payload;
  if (payload) {
    return parsePayload_(payload);
  }

  const params = e && e.parameter;
  if (params && params.action) {
    return Object.assign({}, params);
  }

  throw new Error('Missing payload.');
}

function parsePayload_(payload) {
  if (typeof payload === 'object') {
    return payload;
  }

  const raw = String(payload || '').trim();
  try {
    return JSON.parse(raw);
  } catch (firstError) {
    const normalized = raw
      .replace(/^\[object Object\]$/, '')
      .replace(/([{,]\s*)([A-Za-z_][A-Za-z0-9_]*)(\s*:)/g, '$1"$2"$3')
      .replace(/'/g, '"');

    if (!normalized) {
      throw firstError;
    }
    return JSON.parse(normalized);
  }
}

function createSubmission_(request) {
  validateRequired_(request);

  const lock = LockService.getScriptLock();
  lock.waitLock(30000);

  try {
    const sheet = getSheet_();
    const now = new Date();
    const submissionId = buildSubmissionId_(now);
    const folder = createUploadFolder_(submissionId, request);
    const folderUrl = folder.getUrl();

    setDescriptionIfAvailable_(folder, buildDescription_({
      submissionId,
      submittedAt: now,
      name: request.name,
      organization: request.organization,
      email: request.email,
      countries: request.countries,
      others: request.others || '',
      folderUrl
    }));

    sheet.appendRow([
      submissionId,
      now,
      request.name,
      request.organization,
      request.email,
      request.countries,
      request.others || '',
      folder.getId(),
      folderUrl,
      'pending_upload',
      '',
      0,
      '',
      '',
      '',
      request.userAgent || ''
    ]);

    return {
      ok: true,
      requestId: request.requestId || '',
      submissionId,
      folderId: folder.getId(),
      folderUrl
    };
  } finally {
    lock.releaseLock();
  }
}

function confirmUpload_(request) {
  if (!request.submissionId) {
    throw new Error('Missing submission ID.');
  }

  const lock = LockService.getScriptLock();
  lock.waitLock(30000);

  try {
    const sheet = getSheet_();
    const map = getHeaderMap_(sheet);
    const row = findRowBySubmissionId_(sheet, map, request.submissionId);
    if (!row) {
      throw new Error('Submission ID was not found.');
    }

    const record = getRecordFromRow_(sheet, map, row);
    const annotation = annotateDriveItems_(record);
    const now = new Date();

    sheet.getRange(row, map.status).setValue('user_confirmed');
    sheet.getRange(row, map.completed_at).setValue(now);
    sheet.getRange(row, map.file_count).setValue(annotation.fileCount);
    sheet.getRange(row, map.upload_file_names).setValue(annotation.fileNames.join('\n'));
    sheet.getRange(row, map.annotated_at).setValue(now);

    return {
      ok: true,
      requestId: request.requestId || '',
      submissionId: request.submissionId,
      fileCount: annotation.fileCount,
      fileNames: annotation.fileNames
    };
  } finally {
    lock.releaseLock();
  }
}

function validateRequired_(request) {
  const missing = [];
  if (!String(request.name || '').trim()) missing.push('name');
  if (!String(request.organization || '').trim()) missing.push('organization');
  if (!String(request.email || '').trim()) missing.push('email');
  if (!String(request.countries || '').trim()) missing.push('countries');
  if (missing.length) {
    throw new Error('Missing required fields: ' + missing.join(', '));
  }
}

function getSheet_() {
  const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
  let sheet = spreadsheet.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = spreadsheet.insertSheet(SHEET_NAME);
  }

  const headerWidth = Math.max(sheet.getLastColumn(), HEADERS.length);
  const currentHeaders = sheet.getRange(1, 1, 1, headerWidth).getValues()[0];
  const needsHeaders = currentHeaders.every((value) => !value);
  if (needsHeaders) {
    sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);
    sheet.setFrozenRows(1);
  } else {
    const existing = currentHeaders.filter(Boolean);
    const missing = HEADERS.filter((header) => existing.indexOf(header) === -1);
    if (missing.length) {
      sheet.getRange(1, existing.length + 1, 1, missing.length).setValues([missing]);
    }
  }

  return sheet;
}

function getHeaderMap_(sheet) {
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  return headers.reduce((map, header, index) => {
    if (header) {
      map[header] = index + 1;
    }
    return map;
  }, {});
}

function findRowBySubmissionId_(sheet, map, submissionId) {
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return 0;

  const values = sheet.getRange(2, map.submission_id, lastRow - 1, 1).getValues();
  for (let index = 0; index < values.length; index += 1) {
    if (values[index][0] === submissionId) {
      return index + 2;
    }
  }
  return 0;
}

function getRecordFromRow_(sheet, map, row) {
  return {
    submissionId: sheet.getRange(row, map.submission_id).getValue(),
    submittedAt: sheet.getRange(row, map.submitted_at).getValue(),
    name: sheet.getRange(row, map.name).getValue(),
    organization: sheet.getRange(row, map.organization).getValue(),
    email: sheet.getRange(row, map.email).getValue(),
    countries: sheet.getRange(row, map.countries).getValue(),
    others: sheet.getRange(row, map.others).getValue(),
    folderId: sheet.getRange(row, map.folder_id).getValue(),
    folderUrl: sheet.getRange(row, map.folder_url).getValue()
  };
}

function createUploadFolder_(submissionId, request) {
  const root = DriveApp.getFolderById(ROOT_FOLDER_ID);
  const folderName = [
    submissionId,
    sanitizeName_(request.name),
    sanitizeName_(request.organization)
  ].filter(Boolean).join('_');

  const folder = root.createFolder(folderName);
  folder.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.EDIT);
  return folder;
}

function annotateDriveItems_(record) {
  if (!record.folderId) {
    return {fileCount: 0, fileNames: []};
  }

  const folder = DriveApp.getFolderById(record.folderId);
  const folderDescription = buildDescription_(record);
  setDescriptionIfAvailable_(folder, folderDescription);

  const files = folder.getFiles();
  const fileNames = [];
  let index = 1;

  while (files.hasNext()) {
    const file = files.next();
    const originalName = file.getName();
    const managedName = buildManagedFileName_(record.submissionId, index, originalName);

    setDescriptionIfAvailable_(file, `${folderDescription}\n\nFile original name: ${originalName}`);
    if (RENAME_UPLOADED_FILES && originalName.indexOf(`${record.submissionId}_`) !== 0) {
      file.setName(managedName);
      fileNames.push(managedName);
    } else {
      fileNames.push(originalName);
    }

    index += 1;
  }

  return {
    fileCount: fileNames.length,
    fileNames
  };
}

function buildManagedFileName_(submissionId, index, originalName) {
  return `${submissionId}_${String(index).padStart(2, '0')}_${sanitizeFileName_(originalName)}`;
}

function buildDescription_(record) {
  return [
    `Submission ID: ${record.submissionId || ''}`,
    `Name: ${record.name || ''}`,
    `Organization: ${record.organization || ''}`,
    `Email: ${record.email || ''}`,
    `Countries: ${record.countries || ''}`,
    `Submitted at: ${record.submittedAt || ''}`,
    `Folder URL: ${record.folderUrl || ''}`,
    `Other notes: ${record.others || ''}`
  ].join('\n');
}

function setDescriptionIfAvailable_(driveItem, description) {
  if (driveItem && typeof driveItem.setDescription === 'function') {
    driveItem.setDescription(description);
  }
}

function buildSubmissionId_(date) {
  const stamp = Utilities.formatDate(date, Session.getScriptTimeZone(), 'yyyyMMdd-HHmmss');
  const token = Utilities.getUuid().slice(0, 8).toUpperCase();
  return `VID-${stamp}-${token}`;
}

function sanitizeName_(value) {
  return String(value || '')
    .trim()
    .replace(/[\\/:*?"<>|#%{}~&]/g, '-')
    .replace(/\s+/g, '-')
    .slice(0, 60);
}

function sanitizeFileName_(value) {
  return String(value || 'uploaded-file')
    .trim()
    .replace(/[\\/:*?"<>|#%{}~&]/g, '-')
    .replace(/\s+/g, '-')
    .slice(0, 140);
}

function renderBridgeResponse_(response) {
  const message = JSON.stringify(Object.assign({source: BRIDGE_SOURCE}, response));
  const html = `
<!doctype html>
<html>
<body>
<script>
var message = ${message};
window.parent.postMessage(message, '*');
if (window.top && window.top !== window.parent) {
  window.top.postMessage(message, '*');
}
</script>
</body>
</html>`;

  return HtmlService
    .createHtmlOutput(html)
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function setupSheet() {
  getSheet_();
}
