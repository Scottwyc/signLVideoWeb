const SPREADSHEET_ID = '1UcsBA46ws9DZX7_Q7TtgC99zEkwowQR9O2iOaBShPvo';
const ROOT_FOLDER_ID = '1VGHiAHHnHO9MjaDRPdKTFr2LSbFh_I43';
const SHEET_NAME = 'Submissions';
const BRIDGE_SOURCE = 'video-upload-portal-apps-script';
const RENAME_UPLOADED_FILES = true;
const UPLOAD_SCAN_WINDOW_DAYS = 7;
const AUTO_SCAN_STATUSES = ['pending_upload', 'uploaded_detected'];
const SHEET_DATETIME_FORMAT = 'yyyy-mm-dd hh:mm';

const HEADERS = [
  'submission_id',
  'submitted_at',
  'name',
  'organization',
  'contact_info',
  'country',
  'sign_language_used',
  'personal_bio',
  'folder_id',
  'folder_url',
  'status',
  'firstDetected_at',
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
    const map = getHeaderMap_(sheet);
    const now = new Date();
    const submissionId = buildSubmissionId_(now);
    const normalized = normalizeSubmissionRequest_(request);
    const folder = createUploadFolder_(submissionId, normalized);
    const folderUrl = folder.getUrl();
    const sharingEmail = extractEmail_(normalized.contactInfo);
    const sharingNote = shareUploadFolderWithEmail_(folder, sharingEmail, folderUrl, submissionId);

    setDescriptionIfAvailable_(folder, buildDescription_({
      submissionId,
      submittedAt: now,
      name: normalized.name,
      organization: normalized.organization,
      contactInfo: normalized.contactInfo,
      country: normalized.country,
      signLanguageUsed: normalized.signLanguageUsed,
      personalBio: normalized.personalBio,
      folderUrl
    }));

    sheet.appendRow(buildSubmissionRow_(sheet, map, {
      submissionId,
      submittedAt: now,
      name: normalized.name,
      organization: normalized.organization,
      contactInfo: normalized.contactInfo,
      country: normalized.country,
      signLanguageUsed: normalized.signLanguageUsed,
      personalBio: normalized.personalBio,
      folderId: folder.getId(),
      folderUrl,
      status: 'pending_upload',
      fileCount: 0,
      uploadFileNames: '',
      notes: sharingNote,
      userAgent: request.userAgent || ''
    }));

    return {
      ok: true,
      requestId: request.requestId || '',
      submissionId,
      folderId: folder.getId(),
      folderUrl,
      sharingNote
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
    sheet.getRange(row, map.file_count).setValue(annotation.fileCount);
    sheet.getRange(row, map.upload_file_names).setValue(annotation.fileNames.join('\n'));
    if (annotation.fileCount > 0) {
      setFirstDetectedAtIfNeeded_(sheet, row, map, now);
    }
    setDateTimeCell_(sheet, row, map.annotated_at, now);

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

function scanRecentUploadFolders() {
  const lock = LockService.getScriptLock();
  lock.waitLock(30000);

  try {
    const sheet = getSheet_();
    const map = getHeaderMap_(sheet);
    const lastRow = sheet.getLastRow();
    if (lastRow < 2) {
      return {scanned: 0, updated: 0, detected: 0};
    }

    const now = new Date();
    const cutoffTime = now.getTime() - UPLOAD_SCAN_WINDOW_DAYS * 24 * 60 * 60 * 1000;
    let scanned = 0;
    let updated = 0;
    let detected = 0;

    for (let row = 2; row <= lastRow; row += 1) {
      const status = String(sheet.getRange(row, map.status).getValue() || '').trim();
      const submittedAt = sheet.getRange(row, map.submitted_at).getValue();

      if (AUTO_SCAN_STATUSES.indexOf(status) === -1) continue;
      if (!isRecentSubmission_(submittedAt, cutoffTime)) continue;

      const record = getRecordFromRow_(sheet, map, row);
      const annotation = annotateDriveItems_(record);
      const nextStatus = annotation.fileCount > 0 ? 'uploaded_detected' : 'pending_upload';

      sheet.getRange(row, map.status).setValue(nextStatus);
      sheet.getRange(row, map.file_count).setValue(annotation.fileCount);
      sheet.getRange(row, map.upload_file_names).setValue(annotation.fileNames.join('\n'));
      if (annotation.fileCount > 0) {
        setFirstDetectedAtIfNeeded_(sheet, row, map, now);
      }
      setDateTimeCell_(sheet, row, map.annotated_at, now);

      scanned += 1;
      updated += 1;
      if (annotation.fileCount > 0) detected += 1;
    }

    return {scanned, updated, detected};
  } finally {
    lock.releaseLock();
  }
}

function setupUploadScannerTrigger() {
  ScriptApp.getProjectTriggers().forEach((trigger) => {
    if (trigger.getHandlerFunction() === 'scanRecentUploadFolders') {
      ScriptApp.deleteTrigger(trigger);
    }
  });

  ScriptApp
    .newTrigger('scanRecentUploadFolders')
    .timeBased()
    .everyMinutes(1)
    .create();
}

function removeUploadScannerTrigger() {
  ScriptApp.getProjectTriggers().forEach((trigger) => {
    if (trigger.getHandlerFunction() === 'scanRecentUploadFolders') {
      ScriptApp.deleteTrigger(trigger);
    }
  });
}

function isRecentSubmission_(submittedAt, cutoffTime) {
  const value = submittedAt instanceof Date ? submittedAt : new Date(submittedAt);
  const time = value.getTime();
  return !Number.isNaN(time) && time >= cutoffTime;
}

function validateRequired_(request) {
  const normalized = normalizeSubmissionRequest_(request);
  const missing = [];
  if (!normalized.name) missing.push('name');
  if (!normalized.organization) missing.push('organization');
  if (!normalized.contactInfo) missing.push('contact_info');
  if (!normalized.country) missing.push('country');
  if (!normalized.signLanguageUsed) missing.push('sign_language_used');
  if (missing.length) {
    throw new Error('Missing required fields: ' + missing.join(', '));
  }

  if (countWords_(normalized.personalBio) > 100) {
    throw new Error('Personal bio must be within 100 words.');
  }
}

function normalizeSubmissionRequest_(request) {
  return {
    name: String(request.name || '').trim(),
    organization: String(request.organization || '').trim(),
    contactInfo: String(request.contactInfo || request.email || '').trim(),
    country: String(request.country || request.countries || '').trim(),
    signLanguageUsed: String(request.signLanguageUsed || request.sign_language_used || '').trim(),
    personalBio: String(request.personalBio || request.personal_bio || request.others || '').trim()
  };
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
    renameHeaderIfPresent_(sheet, currentHeaders, 'completed_at', 'firstDetected_at');
    renameHeaderIfPresent_(sheet, currentHeaders, 'email', 'contact_info');
    renameHeaderIfPresent_(sheet, currentHeaders, 'countries', 'country');
    renameHeaderIfPresent_(sheet, currentHeaders, 'others', 'personal_bio');
    const existing = currentHeaders.filter(Boolean);
    const missing = HEADERS.filter((header) => existing.indexOf(header) === -1);
    if (missing.length) {
      sheet.getRange(1, existing.length + 1, 1, missing.length).setValues([missing]);
    }
  }

  applySheetFormats_(sheet);
  return sheet;
}

function applySheetFormats_(sheet) {
  const map = getHeaderMap_(sheet);
  ['submitted_at', 'firstDetected_at', 'annotated_at'].forEach((header) => {
    if (map[header]) {
      sheet.getRange(2, map[header], Math.max(sheet.getMaxRows() - 1, 1), 1)
        .setNumberFormat(SHEET_DATETIME_FORMAT);
    }
  });
}

function setDateTimeCell_(sheet, row, column, value) {
  sheet.getRange(row, column)
    .setValue(value)
    .setNumberFormat(SHEET_DATETIME_FORMAT);
}

function setFirstDetectedAtIfNeeded_(sheet, row, map, value) {
  const cell = sheet.getRange(row, map.firstDetected_at);
  if (!cell.getValue()) {
    cell
      .setValue(value)
      .setNumberFormat(SHEET_DATETIME_FORMAT);
  }
}

function renameHeaderIfPresent_(sheet, headers, oldHeader, newHeader) {
  const oldIndex = headers.indexOf(oldHeader);
  const newIndex = headers.indexOf(newHeader);
  if (oldIndex !== -1 && newIndex === -1) {
    sheet.getRange(1, oldIndex + 1).setValue(newHeader);
    headers[oldIndex] = newHeader;
  }
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

function buildSubmissionRow_(sheet, map, values) {
  const row = new Array(sheet.getLastColumn()).fill('');
  setRowValue_(row, map, 'submission_id', values.submissionId);
  setRowValue_(row, map, 'submitted_at', values.submittedAt);
  setRowValue_(row, map, 'name', values.name);
  setRowValue_(row, map, 'organization', values.organization);
  setRowValue_(row, map, 'contact_info', values.contactInfo);
  setRowValue_(row, map, 'country', values.country);
  setRowValue_(row, map, 'sign_language_used', values.signLanguageUsed);
  setRowValue_(row, map, 'personal_bio', values.personalBio);
  setRowValue_(row, map, 'folder_id', values.folderId);
  setRowValue_(row, map, 'folder_url', values.folderUrl);
  setRowValue_(row, map, 'status', values.status);
  setRowValue_(row, map, 'firstDetected_at', '');
  setRowValue_(row, map, 'file_count', values.fileCount);
  setRowValue_(row, map, 'upload_file_names', values.uploadFileNames);
  setRowValue_(row, map, 'annotated_at', '');
  setRowValue_(row, map, 'notes', values.notes);
  setRowValue_(row, map, 'user_agent', values.userAgent);
  return row;
}

function setRowValue_(row, map, header, value) {
  if (map[header]) {
    row[map[header] - 1] = value;
  }
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
    contactInfo: sheet.getRange(row, map.contact_info).getValue(),
    country: sheet.getRange(row, map.country).getValue(),
    signLanguageUsed: sheet.getRange(row, map.sign_language_used).getValue(),
    personalBio: sheet.getRange(row, map.personal_bio).getValue(),
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

function shareUploadFolderWithEmail_(folder, email, folderUrl, submissionId) {
  const targetEmail = String(email || '').trim();
  const notes = [];

  if (!targetEmail) {
    return 'direct_email_share_skipped: no email found in contact_info';
  }

  try {
    folder.addEditor(targetEmail);
    notes.push(`direct_email_share_added: ${targetEmail}`);
  } catch (error) {
    notes.push(`direct_email_share_failed: ${targetEmail}: ${error.message || error}`);
  }

  try {
    MailApp.sendEmail(
      targetEmail,
      `Video upload folder: ${submissionId}`,
      [
        'Your video upload folder has been created.',
        '',
        `Submission ID: ${submissionId}`,
        `Upload folder: ${folderUrl}`,
        '',
        'For mobile upload, open this link with Safari, Chrome, or the Google Drive app. If the folder is visible in "Shared with me", open it there and tap + / Upload.'
      ].join('\n')
    );
    notes.push(`email_notification_sent: ${targetEmail}`);
  } catch (error) {
    notes.push(`email_notification_failed: ${targetEmail}: ${error.message || error}`);
  }

  return notes.join('\n');
}

function annotateDriveItems_(record) {
  if (!record.folderId) {
    return {fileCount: 0, fileNames: []};
  }

  const folder = DriveApp.getFolderById(record.folderId);
  const folderDescription = buildDescription_(record);
  setDescriptionIfAvailable_(folder, folderDescription);

  const files = folder.getFiles();
  const fileList = [];
  const fileNames = [];
  let nextIndex = 1;

  while (files.hasNext()) {
    fileList.push(files.next());
  }

  fileList.forEach((file) => {
    const match = file.getName().match(new RegExp(`^${escapeRegExp_(record.submissionId)}_(\\d+)_`));
    if (match) {
      nextIndex = Math.max(nextIndex, Number(match[1]) + 1);
    }
  });

  fileList.forEach((file) => {
    const originalName = file.getName();

    setDescriptionIfAvailable_(file, `${folderDescription}\n\nFile original name: ${originalName}`);
    if (RENAME_UPLOADED_FILES && originalName.indexOf(`${record.submissionId}_`) !== 0) {
      const managedName = buildManagedFileName_(record.submissionId, nextIndex, originalName);
      file.setName(managedName);
      fileNames.push(managedName);
      nextIndex += 1;
    } else {
      fileNames.push(originalName);
    }
  });

  return {
    fileCount: fileNames.length,
    fileNames
  };
}

function escapeRegExp_(value) {
  return String(value || '').replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function buildManagedFileName_(submissionId, index, originalName) {
  return `${submissionId}_${String(index).padStart(2, '0')}_${sanitizeFileName_(originalName)}`;
}

function buildDescription_(record) {
  return [
    `Submission ID: ${record.submissionId || ''}`,
    `Name: ${record.name || ''}`,
    `Organization: ${record.organization || ''}`,
    `Contact Information: ${record.contactInfo || ''}`,
    `Country: ${record.country || ''}`,
    `Sign language used: ${record.signLanguageUsed || ''}`,
    `Submitted at: ${record.submittedAt || ''}`,
    `Folder URL: ${record.folderUrl || ''}`,
    `Personal Bio: ${record.personalBio || ''}`
  ].join('\n');
}

function extractEmail_(value) {
  const match = String(value || '').match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i);
  return match ? match[0] : '';
}

function countWords_(value) {
  const normalized = String(value || '').trim();
  if (!normalized) return 0;
  return normalized.split(/\s+/).filter(Boolean).length;
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
