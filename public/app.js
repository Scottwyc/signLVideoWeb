const translations = {
  zh: {
    brandTitle: '视频上传平台',
    headline: '上传视频',
    pillGlobal: '全球访问',
    pillVideo: '多个视频',
    pillDrive: '获取上传链接',
    pillDriveMobile: '共享到 Gmail',
    formTitle: '信息登记',
    formSubtitle: '提交信息后，页面将生成对应的 Google Drive 上传链接。',
    formSubtitleMobile: '提交信息后，系统会把上传文件夹共享到填写的 Gmail。',
    chipLabel: 'Drive 链接上传',
    chipLabelMobile: 'Drive App 上传',
    mobileDeviceNote: 'NOTE: 建议使用 PC 端，操作更方便。手机端请填写 Google Drive App 当前登录的 Gmail 邮箱；提交后到 Google Drive App 的“与我共享”中找到最新共享文件夹并上传。',
    nameLabel: '姓名',
    orgLabel: '机构 / 组织',
    emailLabel: '邮箱',
    emailHint: 'PC 端可填写常用邮箱；如果使用手机上传，请填写 Google Drive App 登录的 Gmail 邮箱。',
    emailHintMobile: '手机上传必须填写 Google Drive App 当前登录的 Gmail 邮箱，系统会把上传文件夹共享给此 Gmail。',
    countryLabel: '国家 / 地区',
    othersLabel: '其他说明',
    progressIdle: '等待提交',
    submitBtn: '提交信息并获取上传链接',
    submitBtnMobile: '提交信息并共享文件夹',
    infoTitle: '提交步骤',
    step1: '填写必要信息并提交。',
    step2: '打开系统生成的 Google Drive 上传链接。',
    step3: '上传视频后返回页面确认完成。',
    step1Mobile: '填写必要信息，邮箱必须是手机 Google Drive App 登录的 Gmail。',
    step2Mobile: '提交后打开 Google Drive App，在“与我共享”中找到最新共享文件夹。',
    step3Mobile: '进入文件夹上传视频后，返回页面确认完成。',
    resultTitle: '提示',
    namePlaceholder: '请输入姓名',
    orgPlaceholder: '学校、大学、机构或组织',
    emailPlaceholder: 'yourname@gmail.com',
    countryPlaceholder: '输入国家或地区，支持搜索',
    othersPlaceholder: '可填写补充说明、链接或其他信息',
    validationPrefix: '请补全以下项：',
    missingName: '姓名',
    missingOrg: '机构 / 组织',
    missingEmail: '邮箱',
    invalidEmail: '有效邮箱地址',
    invalidGmail: '手机端请填写有效的 Gmail 地址，例如 yourname@gmail.com',
    missingCountries: '国家 / 地区',
    configMissing: '尚未配置 Apps Script Web App 地址，请先在 public/config.js 中填写 appsScriptUrl。',
    submitHint: '正在提交信息...',
    success: '信息已提交，请现在上传。',
    mobileSuccess: '信息已提交，上传文件夹已共享到你的 Gmail。请打开 Google Drive App，在“与我共享”中找到最新共享文件夹并上传。',
    mobileSuccessNoShare: '信息已提交。请打开 Google Drive App，在“与我共享”中查找最新共享文件夹；如果暂时看不到，请稍后刷新或检查 Gmail 是否正确。',
    networkError: '提交失败或网络不通畅，请检查网络后重试。',
    serverError: '服务暂时没有响应，请稍后再试。',
    timeoutError: '提交超时，请检查网络后重试。',
    linkReadyTitle: '上传链接已生成',
    linkReadyHint: '请打开 Google Drive 文件夹上传一个或多个视频。',
    linkReadyTitleMobile: '请到 Google Drive App 上传',
    linkReadyHintMobile: '上传文件夹已共享到填写的 Gmail。手机端请在 Google Drive App 的“与我共享”中找到最新文件夹。',
    submissionIdLabel: '提交编号',
    openDriveBtn: '打开上传链接',
    copyUploadLinkBtn: '复制链接',
    confirmCompleteBtn: '我已完成上传',
    continueUploadBtn: '继续上传',
    exitBtn: '退出',
    confirming: '正在确认上传状态...',
    confirmed: '已记录上传完成状态。',
    confirmFailed: '确认失败，请稍后重试。',
    viewUploadFolder: '打开上传文件夹',
    openFirstHint: '请先打开上传链接并完成视频上传，然后再确认完成。',
    closeHint: '可以关闭此页面。',
    mobileUploadHint: '手机端不建议通过网页链接上传。请打开 Google Drive App，用填写的 Gmail 登录后，在“与我共享”中找到最新共享文件夹并上传。',
    inAppBrowserHint: '微信等内置浏览器不适合上传 Google Drive 文件。请打开 Google Drive App，在“与我共享”中找到最新共享文件夹并上传。',
    mobileUploadStep1: '打开 Google Drive App，并确认登录的是刚才填写的 Gmail。',
    mobileUploadStep2: '进入“与我共享”，找到最新共享的上传文件夹。',
    mobileUploadStep3: '进入该文件夹后点击 + / 上传，选择一个或多个视频。',
    mobileUploadStep4: '上传完成后回到本页面，点击“我已完成上传”。',
    copiedUploadLink: '上传链接已复制。请到 Safari、Chrome 或 Google Drive App 中打开并上传视频。',
    copyFailed: '复制失败，请长按上传链接复制。',
    manualCopyPrompt: '请复制这个上传链接，然后到 Safari、Chrome 或 Google Drive App 中打开：'
  },
  en: {
    brandTitle: 'Video Upload Portal',
    headline: 'Upload videos',
    pillGlobal: 'Global access',
    pillVideo: 'Multiple videos',
    pillDrive: 'Get upload link',
    pillDriveMobile: 'Share to Gmail',
    formTitle: 'Information registration',
    formSubtitle: 'After submitting the form, this page will generate a Google Drive upload link.',
    formSubtitleMobile: 'After submission, the upload folder will be shared with the Gmail entered below.',
    chipLabel: 'Drive link upload',
    chipLabelMobile: 'Drive app upload',
    mobileDeviceNote: 'NOTE: PC upload is recommended because it is easier. On mobile, enter the Gmail account currently signed in on the Google Drive app; after submitting, open Google Drive app, go to "Shared with me", find the newest shared folder, and upload there.',
    nameLabel: 'Name',
    orgLabel: 'Organization',
    emailLabel: 'Email',
    emailHint: 'For PC upload, enter your regular email. For mobile upload, enter the Gmail account signed in on the Google Drive app.',
    emailHintMobile: 'Mobile upload requires the Gmail account currently signed in on the Google Drive app. The upload folder will be shared with this Gmail.',
    countryLabel: 'Countries',
    othersLabel: 'Other notes',
    progressIdle: 'Waiting for submission',
    submitBtn: 'Submit details and get upload link',
    submitBtnMobile: 'Submit details and share folder',
    infoTitle: 'Submission steps',
    step1: 'Fill in the required information and submit.',
    step2: 'Open the generated Google Drive upload link.',
    step3: 'Return to this page and confirm after uploading videos.',
    step1Mobile: 'Fill in the required information. Email must be the Gmail account signed in on the mobile Google Drive app.',
    step2Mobile: 'After submission, open the Google Drive app and find the newest shared folder in "Shared with me".',
    step3Mobile: 'Upload videos in that folder, then return to this page and confirm completion.',
    resultTitle: 'Message',
    namePlaceholder: 'Your name',
    orgPlaceholder: 'School, university, institute, or organization',
    emailPlaceholder: 'yourname@gmail.com',
    countryPlaceholder: 'Start typing a country or region',
    othersPlaceholder: 'Additional context, links, or instructions',
    validationPrefix: 'Please complete: ',
    missingName: 'name',
    missingOrg: 'organization',
    missingEmail: 'email',
    invalidEmail: 'a valid email address',
    invalidGmail: 'on mobile, enter a valid Gmail address, such as yourname@gmail.com',
    missingCountries: 'countries',
    configMissing: 'Apps Script Web App URL is not configured. Please set appsScriptUrl in public/config.js first.',
    submitHint: 'Submitting information...',
    success: 'Information submitted. Upload now.',
    mobileSuccess: 'Information submitted. The upload folder has been shared with your Gmail. Open the Google Drive app, go to "Shared with me", find the newest shared folder, and upload videos there.',
    mobileSuccessNoShare: 'Information submitted. Open the Google Drive app and check "Shared with me" for the newest shared folder. If it does not appear yet, refresh later or check that the Gmail is correct.',
    networkError: 'Submission failed or the network is unstable. Please check your connection and try again.',
    serverError: 'The service did not respond in time. Please try again later.',
    timeoutError: 'The submission timed out. Check your network and try again.',
    linkReadyTitle: 'Upload link generated',
    linkReadyHint: 'Open the Google Drive folder and upload one or more videos.',
    linkReadyTitleMobile: 'Upload in the Google Drive app',
    linkReadyHintMobile: 'The upload folder has been shared with the Gmail entered above. On mobile, find the newest folder in "Shared with me" in the Google Drive app.',
    submissionIdLabel: 'Submission ID',
    openDriveBtn: 'Open upload link',
    copyUploadLinkBtn: 'Copy link',
    confirmCompleteBtn: 'I have finished uploading',
    continueUploadBtn: 'Continue uploading',
    exitBtn: 'Exit',
    confirming: 'Confirming upload status...',
    confirmed: 'Upload completion status has been recorded.',
    confirmFailed: 'Confirmation failed. Please try again later.',
    viewUploadFolder: 'Open upload folder',
    openFirstHint: 'Open the upload link and upload videos before confirming completion.',
    closeHint: 'You may close this page.',
    mobileUploadHint: 'On mobile, do not use the web Drive link for upload. Open the Google Drive app with the Gmail entered above, then find the newest shared folder in "Shared with me".',
    inAppBrowserHint: 'In-app browsers such as WeChat are not suitable for Google Drive upload. Open the Google Drive app and upload in the newest shared folder under "Shared with me".',
    mobileUploadStep1: 'Open the Google Drive app and confirm it is signed in with the Gmail entered above.',
    mobileUploadStep2: 'Go to "Shared with me" and find the newest shared upload folder.',
    mobileUploadStep3: 'Open that folder, tap + / Upload, and choose one or more videos.',
    mobileUploadStep4: 'After upload finishes, return to this page and tap "I have finished uploading".',
    copiedUploadLink: 'Upload link copied. Open it in Safari, Chrome, or the Google Drive app, then upload videos.',
    copyFailed: 'Copy failed. Long-press the upload link to copy it.',
    manualCopyPrompt: 'Copy this upload link, then open it in Safari, Chrome, or the Google Drive app:'
  }
};

const CONFIG = window.UPLOAD_PORTAL_CONFIG || {};
const BRIDGE_SOURCE = 'video-upload-portal-apps-script';
const REQUEST_TIMEOUT_MS = 45000;
const SUBMISSION_STORAGE_KEY = 'videoUploadPortal.latestSubmission';

const state = {
  lang: localStorage.getItem('lang') || 'zh',
  isMobile: false,
  pendingRequestId: null,
  pendingTimer: null,
  latestSubmission: null
};

const els = {
  langSwitch: document.getElementById('langSwitch'),
  langSwitchLabel: document.getElementById('langSwitchLabel'),
  form: document.getElementById('submissionForm'),
  frame: document.getElementById('appsScriptFrame'),
  progressBar: document.getElementById('progressBar'),
  progressLabel: document.getElementById('progressLabel'),
  progressPercent: document.getElementById('progressPercent'),
  submitBtn: document.getElementById('submitBtn'),
  submitSpinner: document.getElementById('submitSpinner'),
  submitBtnLabel: document.getElementById('submitBtnLabel'),
  resultBox: document.getElementById('resultBox'),
  resultMessage: document.getElementById('resultMessage'),
  resultLink: document.getElementById('resultLink'),
  linkPreview: document.getElementById('linkPreview'),
  submissionId: document.getElementById('submissionId'),
  mobileUploadNote: document.getElementById('mobileUploadNote'),
  driveLink: document.getElementById('driveLink'),
  driveLinkLabel: document.getElementById('driveLinkLabel'),
  copyLinkBtn: document.getElementById('copyLinkBtn'),
  confirmCompleteBtn: document.getElementById('confirmCompleteBtn')
};

function t(key, params = {}) {
  const activeKey = state.isMobile && translations[state.lang][`${key}Mobile`] ? `${key}Mobile` : key;
  const text = translations[state.lang][activeKey] || translations.en[activeKey] || translations[state.lang][key] || translations.en[key] || '';
  return text.replace(/\{(\w+)\}/g, (_, token) => params[token] ?? '');
}

function detectMobileDevice() {
  const ua = navigator.userAgent || '';
  const uaLooksMobile = /Android|iPhone|iPad|iPod|Mobile|Windows Phone/i.test(ua);
  const iPadLike = /Macintosh/i.test(ua) && navigator.maxTouchPoints > 1;
  const coarsePointer = window.matchMedia && window.matchMedia('(pointer: coarse)').matches;
  const narrowScreen = window.matchMedia && window.matchMedia('(max-width: 760px)').matches;
  return uaLooksMobile || iPadLike || (coarsePointer && narrowScreen);
}

function syncDeviceMode() {
  const next = detectMobileDevice();
  const changed = state.isMobile !== next;
  state.isMobile = next;
  document.body.classList.toggle('is-mobile-flow', state.isMobile);
  document.body.classList.toggle('is-pc-flow', !state.isMobile);
  return changed;
}

function renderLanguage() {
  syncDeviceMode();
  document.documentElement.lang = state.lang === 'zh' ? 'zh-CN' : 'en';
  els.langSwitchLabel.textContent = state.lang === 'zh' ? 'EN' : '中文';

  document.querySelectorAll('[data-i18n]').forEach((node) => {
    node.textContent = t(node.dataset.i18n);
  });

  document.querySelectorAll('[data-i18n-placeholder]').forEach((node) => {
    node.placeholder = t(node.dataset.i18nPlaceholder);
  });

  if (state.latestSubmission) {
    renderSubmissionControls();
  }

  updatePrimaryAction();
}

function toggleLanguage() {
  state.lang = state.lang === 'zh' ? 'en' : 'zh';
  localStorage.setItem('lang', state.lang);
  renderLanguage();
}

function loadStoredSubmission() {
  try {
    const raw = window.localStorage.getItem(SUBMISSION_STORAGE_KEY);
    if (!raw) return null;

    const submission = JSON.parse(raw);
    if (!submission || !submission.submissionId || !submission.folderUrl) {
      return null;
    }
    return {
      submissionId: submission.submissionId,
      folderUrl: submission.folderUrl,
      driveOpened: Boolean(submission.driveOpened),
      uploadConfirmed: Boolean(submission.uploadConfirmed),
      sharingNote: submission.sharingNote || ''
    };
  } catch (error) {
    return null;
  }
}

function saveSubmission() {
  if (!state.latestSubmission) return;
  window.localStorage.setItem(SUBMISSION_STORAGE_KEY, JSON.stringify(state.latestSubmission));
}

function clearStoredSubmission() {
  window.localStorage.removeItem(SUBMISSION_STORAGE_KEY);
}

function setBusy(isBusy) {
  els.form.classList.toggle('is-busy', isBusy);
  els.submitBtn.classList.toggle('is-loading', isBusy);
  els.submitBtn.disabled = isBusy;
  renderSubmissionControls();
}

function setProgress(percent, label) {
  const next = Math.max(0, Math.min(100, percent));
  els.progressBar.style.width = `${next}%`;
  els.progressPercent.textContent = `${Math.round(next)}%`;
  if (label) els.progressLabel.textContent = label;
}

function showResult(message, linkText = '', linkHref = '', type = 'error') {
  els.resultBox.hidden = false;
  els.resultBox.classList.toggle('is-success', type === 'success');
  els.resultBox.classList.toggle('is-error', type !== 'success');
  els.resultMessage.textContent = message;

  if (linkText && linkHref) {
    els.resultLink.hidden = false;
    els.resultLink.textContent = linkText;
    els.resultLink.href = linkHref;
  } else {
    els.resultLink.hidden = true;
    els.resultLink.removeAttribute('href');
    els.resultLink.textContent = '';
  }
}

function updatePrimaryAction() {
  if (els.submitBtn.classList.contains('is-loading')) {
    els.submitBtnLabel.textContent = t('submitHint');
    return;
  }
  els.submitBtnLabel.textContent = state.latestSubmission ? t('exitBtn') : t('submitBtn');
}

function clearPendingRequest() {
  if (state.pendingTimer) {
    window.clearTimeout(state.pendingTimer);
  }
  state.pendingTimer = null;
  state.pendingRequestId = null;
}

function getAppsScriptUrl() {
  return (CONFIG.appsScriptUrl || '').trim();
}

function isLikelyInAppBrowser() {
  return /MicroMessenger|WeChat|FBAN|FBAV|Instagram|Line\/|QQ\//i.test(navigator.userAgent);
}

function updateMobileUploadNote() {
  if (!els.mobileUploadNote) return;

  const useInAppHint = isLikelyInAppBrowser();
  els.mobileUploadNote.textContent = t(useInAppHint ? 'inAppBrowserHint' : 'mobileUploadHint');
  els.mobileUploadNote.closest('.mobile-upload-note')?.classList.toggle('is-warning', useInAppHint);
}

function markUploadLinkOpened() {
  if (!state.latestSubmission) return;

  state.latestSubmission.driveOpened = true;
  state.latestSubmission.uploadConfirmed = false;
  saveSubmission();
  renderSubmissionControls();
}

async function copyText(text) {
  if (navigator.clipboard && window.isSecureContext) {
    await navigator.clipboard.writeText(text);
    return true;
  }

  const input = document.createElement('textarea');
  input.value = text;
  input.setAttribute('readonly', '');
  input.style.position = 'fixed';
  input.style.top = '-1000px';
  document.body.appendChild(input);
  input.select();
  input.setSelectionRange(0, input.value.length);

  try {
    return document.execCommand('copy');
  } finally {
    input.remove();
  }
}

function collectMissingFields() {
  const missing = [];
  const form = els.form;

  const name = form.elements.name.value.trim();
  const organization = form.elements.organization.value.trim();
  const email = form.elements.email.value.trim();
  const countries = form.elements.countries.value.trim();

  if (!name) missing.push(t('missingName'));
  if (!organization) missing.push(t('missingOrg'));
  if (!email) {
    missing.push(t('missingEmail'));
  } else if (!form.elements.email.validity.valid) {
    missing.push(t('invalidEmail'));
  } else if (state.isMobile && !/^[^@\s]+@gmail\.com$/i.test(email)) {
    missing.push(t('invalidGmail'));
  }
  if (!countries) missing.push(t('missingCountries'));

  return missing;
}

function buildPayload(action) {
  const form = els.form;
  const current = state.latestSubmission || {};
  const requestId = window.crypto && window.crypto.randomUUID
    ? window.crypto.randomUUID()
    : `${Date.now()}-${Math.random()}`;

  return {
    action,
    requestId,
    submissionId: current.submissionId || '',
    name: form.elements.name.value.trim(),
    organization: form.elements.organization.value.trim(),
    email: form.elements.email.value.trim(),
    countries: form.elements.countries.value.trim(),
    others: form.elements.others.value.trim(),
    pageLang: state.lang,
    userAgent: navigator.userAgent
  };
}

function postToAppsScript(payload) {
  return new Promise((resolve, reject) => {
    const url = getAppsScriptUrl();
    if (!url) {
      reject(new Error(t('configMissing')));
      return;
    }

    const bridgeForm = document.createElement('form');
    bridgeForm.method = 'POST';
    bridgeForm.action = url;
    bridgeForm.target = 'appsScriptFrame';
    bridgeForm.hidden = true;

    Object.entries(payload).forEach(([name, value]) => {
      const input = document.createElement('input');
      input.type = 'hidden';
      input.name = name;
      input.value = value == null ? '' : String(value);
      bridgeForm.appendChild(input);
    });

    const cleanup = () => bridgeForm.remove();

    const handleMessage = (event) => {
      const data = event.data || {};
      if (data.source !== BRIDGE_SOURCE) return;
      if (data.requestId !== payload.requestId) return;

      window.removeEventListener('message', handleMessage);
      clearPendingRequest();
      cleanup();

      if (data.ok) {
        resolve(data);
      } else {
        reject(new Error(data.error || t('serverError')));
      }
    };

    window.addEventListener('message', handleMessage);
    state.pendingRequestId = payload.requestId;
    state.pendingTimer = window.setTimeout(() => {
      window.removeEventListener('message', handleMessage);
      clearPendingRequest();
      cleanup();
      reject(new Error(t('timeoutError')));
    }, REQUEST_TIMEOUT_MS);

    document.body.appendChild(bridgeForm);
    bridgeForm.submit();
  });
}

function showSubmission(response, shouldShowMessage = true) {
  const previous = state.latestSubmission || {};
  const isSameSubmission = previous.submissionId === response.submissionId;
  const submission = {
    submissionId: response.submissionId,
    folderUrl: response.folderUrl,
    driveOpened: isSameSubmission ? Boolean(previous.driveOpened) : false,
    uploadConfirmed: isSameSubmission ? Boolean(previous.uploadConfirmed) : false,
    sharingNote: response.sharingNote || previous.sharingNote || ''
  };

  state.latestSubmission = submission;
  saveSubmission();
  renderSubmissionControls();

  if (shouldShowMessage) {
    showResult(getSubmissionSuccessMessage(response), '', '', 'success');
  }

  updatePrimaryAction();
  if (window.lucide) window.lucide.createIcons();
}

function getSubmissionSuccessMessage(response) {
  if (!state.isMobile) {
    return t('success');
  }

  const note = String(response.sharingNote || '');
  return note.includes('direct_email_share_added') ? t('mobileSuccess') : t('mobileSuccessNoShare');
}

function renderSubmissionControls() {
  const submission = state.latestSubmission;
  if (!submission) return;

  els.linkPreview.hidden = false;
  els.submissionId.textContent = submission.submissionId || '-';
  els.driveLink.href = submission.folderUrl || '#';
  els.driveLinkLabel.textContent = submission.uploadConfirmed ? t('continueUploadBtn') : t('openDriveBtn');
  updateMobileUploadNote();
  els.confirmCompleteBtn.hidden = false;
  els.driveLink.hidden = state.isMobile;
  els.copyLinkBtn.hidden = state.isMobile;
  els.confirmCompleteBtn.disabled = els.form.classList.contains('is-busy') || submission.uploadConfirmed || (!state.isMobile && !submission.driveOpened);

  if (window.lucide) window.lucide.createIcons();
}

async function handleSubmit(event) {
  event.preventDefault();

  if (state.latestSubmission) {
    handleExit();
    return;
  }

  const missing = collectMissingFields();
  if (missing.length) {
    setProgress(0, t('progressIdle'));
    showResult(`${t('validationPrefix')}${missing.join(state.lang === 'zh' ? '、' : ', ')}`);
    return;
  }

  setBusy(true);
  updatePrimaryAction();
  setProgress(35, t('submitHint'));
  els.resultBox.hidden = true;

  try {
    const response = await postToAppsScript(buildPayload('createSubmission'));
    setProgress(100, t('success'));
    showSubmission(response);
  } catch (error) {
    setProgress(0, t('progressIdle'));
    showResult(error.message || t('networkError'));
  } finally {
    setBusy(false);
    updatePrimaryAction();
  }
}

async function handleConfirmComplete() {
  if (!state.latestSubmission?.submissionId) return;

  if (!state.isMobile && !state.latestSubmission.driveOpened) {
    showResult(t('openFirstHint'));
    return;
  }

  setBusy(true);
  updatePrimaryAction();
  setProgress(55, t('confirming'));

  try {
    await postToAppsScript(buildPayload('confirmUpload'));
    state.latestSubmission.uploadConfirmed = true;
    saveSubmission();
    renderSubmissionControls();
    updatePrimaryAction();
    setProgress(100, t('confirmed'));
    showResult(t('confirmed'), '', '', 'success');
  } catch (error) {
    setProgress(0, t('progressIdle'));
    showResult(error.message || t('confirmFailed'));
  } finally {
    setBusy(false);
    updatePrimaryAction();
  }
}

function handleDriveLinkClick() {
  if (!state.latestSubmission) return;

  markUploadLinkOpened();
  showResult(t(isLikelyInAppBrowser() ? 'inAppBrowserHint' : 'openFirstHint'), '', '', 'success');
}

async function handleCopyLink() {
  if (!state.latestSubmission?.folderUrl) return;

  try {
    const copied = await copyText(state.latestSubmission.folderUrl);
    if (!copied) {
      throw new Error('copy-failed');
    }
    markUploadLinkOpened();
    showResult(t('copiedUploadLink'), '', '', 'success');
  } catch (error) {
    window.prompt(t('manualCopyPrompt'), state.latestSubmission.folderUrl);
    showResult(t('copyFailed'));
  }
}

function handleExit() {
  clearStoredSubmission();
  window.open('', '_self');
  window.close();
  window.setTimeout(() => {
    document.body.innerHTML = `<main class="exit-screen"><p>${t('closeHint')}</p></main>`;
  }, 120);
}

els.langSwitch.addEventListener('click', toggleLanguage);
els.form.addEventListener('submit', handleSubmit);
els.confirmCompleteBtn.addEventListener('click', handleConfirmComplete);
els.driveLink.addEventListener('click', handleDriveLinkClick);
els.copyLinkBtn.addEventListener('click', handleCopyLink);
window.addEventListener('resize', () => {
  if (syncDeviceMode()) {
    renderLanguage();
    renderSubmissionControls();
  }
});

state.latestSubmission = loadStoredSubmission();
renderLanguage();
setProgress(0, t('progressIdle'));
if (window.lucide) window.lucide.createIcons();
