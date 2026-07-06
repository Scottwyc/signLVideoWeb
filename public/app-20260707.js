const translations = {
  zh: {
    brandTitle: '视频上传平台',
    headline: '上传你的手语记录',
    pillGlobal: '全球访问',
    pillVideo: '多个视频',
    pillDrive: '获取上传链接',
    pillDriveMobile: '共享到 Gmail',
    formTitle: '信息登记',
    formSubtitle: '提交信息后，页面将生成对应的 Google Drive 上传链接。',
    formSubtitleMobile: '提交信息后，系统会把上传文件夹共享到填写的 Gmail。',
    chipLabel: 'Drive 链接上传',
    chipLabelMobile: 'Drive App 上传',
    mobileDeviceNote: 'NOTE: 建议使用 PC 端，操作更方便。手机端请在联系方式中填写 Google Drive App 当前登录的 Gmail 邮箱；提交后到 Google Drive App 的“与我共享”中找到最新共享文件夹并上传。',
    nameLabel: '姓名',
    orgLabel: '机构（学校、大学、机构等）',
    contactLabel: '联系方式（邮箱 / 微信）',
    contactHint: 'PC 端可填写邮箱或微信；如果使用手机上传，请在联系方式中填写 Google Drive App 登录的 Gmail 邮箱。',
    contactHintMobile: '手机上传必须在联系方式中填写 Google Drive App 当前登录的 Gmail 邮箱，系统会把上传文件夹共享给此 Gmail。',
    countryLabel: '国家',
    signLanguageLabel: '使用的手语',
    personalBioLabel: '个人简介（选填，100词以内）',
    progressIdle: '等待提交',
    submitBtn: '提交信息并获取上传链接',
    submitBtnMobile: '提交信息并共享文件夹',
    infoTitle: '提交步骤',
    step1: '填写必要信息并提交。',
    step2: '打开系统生成的 Google Drive 上传链接。',
    step3: '上传视频后，系统会自动检测文件数量。',
    step1Mobile: '填写必要信息，联系方式中必须包含手机 Google Drive App 登录的 Gmail。',
    step2Mobile: '提交后打开 Google Drive App，在“与我共享”中找到最新共享文件夹。',
    step3Mobile: '进入文件夹上传视频后，系统会自动检测文件数量。',
    resultTitle: '提示',
    contactNote: '如果有任何问题，请联系 smartlearning@bnu.edu.cn',
    namePlaceholder: '请输入姓名',
    orgPlaceholder: '学校、大学、机构等',
    contactPlaceholder: '邮箱或微信号',
    countryPlaceholder: '输入国家，支持搜索',
    signLanguagePlaceholder: '例如：中国手语、美国手语等',
    personalBioPlaceholder: '请填写 100 词以内的个人简介',
    validationPrefix: '请补全以下项：',
    missingName: '姓名',
    missingOrg: '机构 / 组织',
    missingContact: '联系方式',
    invalidGmail: '手机端联系方式中必须包含有效的 Gmail 地址，例如 yourname@gmail.com',
    missingCountry: '国家',
    missingSignLanguage: '使用的手语',
    personalBioTooLong: '个人简介需控制在 100 词以内',
    configMissing: '尚未配置 Apps Script Web App 地址，请先在 public/config.js 中填写 appsScriptUrl。',
    submitHint: '正在提交信息...',
    success: '信息已提交，请现在上传。系统会自动检测上传状态，可能有 1-2 分钟延迟。',
    mobileSuccess: '信息已提交，上传文件夹已共享到你的 Gmail。请打开 Google Drive App，在“与我共享”中找到最新共享文件夹并上传。系统会自动检测上传状态，可能有 1-2 分钟延迟。',
    mobileSuccessNoShare: '信息已提交。请打开 Google Drive App，在“与我共享”中查找最新共享文件夹；如果暂时看不到，请稍后刷新或检查 Gmail 是否正确。系统会自动检测上传状态，可能有 1-2 分钟延迟。',
    networkError: '提交失败或网络不通畅，请检查网络后重试。',
    serverError: '服务暂时没有响应，请稍后再试。',
    timeoutError: '提交超时，请检查网络后重试。',
    linkReadyTitle: '上传链接已生成',
    linkReadyHint: '请打开 Google Drive 文件夹上传一个或多个视频。系统会自动检测上传状态，可能有 1-2 分钟延迟。',
    linkReadyTitleMobile: '请到 Google Drive App 上传',
    linkReadyHintMobile: '上传文件夹已共享到填写的 Gmail。手机端请在 Google Drive App 的“与我共享”中找到最新文件夹。系统会自动检测上传状态，可能有 1-2 分钟延迟。',
    submissionIdLabel: '提交编号',
    openDriveBtn: '打开上传链接',
    continueUploadBtn: '继续上传',
    exitBtn: '退出',
    viewUploadFolder: '打开上传文件夹',
    openFirstHint: '请在打开的 Google Drive 文件夹中上传视频。系统会自动检测上传状态，可能有 1-2 分钟延迟。',
    closeHint: '可以关闭此页面。',
    mobileUploadHint: '手机端不建议通过网页链接上传。请打开 Google Drive App，用填写的 Gmail 登录后，在“与我共享”中找到最新共享文件夹并上传。',
    inAppBrowserHint: '微信等内置浏览器不适合上传 Google Drive 文件。请打开 Google Drive App，在“与我共享”中找到最新共享文件夹并上传。',
    mobileUploadStep1: '打开 Google Drive App，并确认登录的是刚才填写的 Gmail。',
    mobileUploadStep2: '进入“与我共享”，找到最新共享的上传文件夹。',
    mobileUploadStep3: '进入该文件夹后点击 + / 上传，选择一个或多个视频。',
    mobileUploadStep4: '上传后系统会自动检测文件数量，可能有 1-2 分钟延迟。',
    copyFailed: '复制失败，请长按上传链接复制。'
  },
  en: {
    brandTitle: 'Video Upload Portal',
    headline: 'Upload Your Sign Language Recording',
    pillGlobal: 'Global access',
    pillVideo: 'Multiple videos',
    pillDrive: 'Get upload link',
    pillDriveMobile: 'Share to Gmail',
    formTitle: 'Information registration',
    formSubtitle: 'After submitting the form, this page will generate a Google Drive upload link.',
    formSubtitleMobile: 'After submission, the upload folder will be shared with the Gmail entered below.',
    chipLabel: 'Drive link upload',
    chipLabelMobile: 'Drive app upload',
    mobileDeviceNote: 'NOTE: PC upload is recommended because it is easier. On mobile, include the Gmail account currently signed in on the Google Drive app in Contact Information; after submitting, open Google Drive app, go to "Shared with me", find the newest shared folder, and upload there.',
    nameLabel: 'Name',
    orgLabel: 'Organization (School, University, Institution...)',
    contactLabel: 'Contact Information (Email/WeChat)',
    contactHint: 'For PC upload, enter an email or WeChat ID. For mobile upload, include the Gmail account signed in on the Google Drive app.',
    contactHintMobile: 'Mobile upload requires the Gmail account currently signed in on the Google Drive app. The upload folder will be shared with this Gmail.',
    countryLabel: 'Country',
    signLanguageLabel: 'Sign language used',
    personalBioLabel: 'Personal Bio (optional, within 100 words)',
    progressIdle: 'Waiting for submission',
    submitBtn: 'Submit details and get upload link',
    submitBtnMobile: 'Submit details and share folder',
    infoTitle: 'Submission steps',
    step1: 'Fill in the required information and submit.',
    step2: 'Open the generated Google Drive upload link.',
    step3: 'After uploading videos, the system will automatically detect the file count.',
    step1Mobile: 'Fill in the required information. Contact Information must include the Gmail account signed in on the mobile Google Drive app.',
    step2Mobile: 'After submission, open the Google Drive app and find the newest shared folder in "Shared with me".',
    step3Mobile: 'Upload videos in that folder. The system will automatically detect the file count.',
    resultTitle: 'Message',
    contactNote: 'If you have any question, please email smartlearning@bnu.edu.cn',
    namePlaceholder: 'Your name',
    orgPlaceholder: 'School, university, institution...',
    contactPlaceholder: 'Email or WeChat ID',
    countryPlaceholder: 'Start typing a country',
    signLanguagePlaceholder: 'e.g., Chinese Sign Language, American Sign Language...',
    personalBioPlaceholder: 'Within 100 words',
    validationPrefix: 'Please complete: ',
    missingName: 'name',
    missingOrg: 'organization',
    missingContact: 'contact information',
    invalidGmail: 'on mobile, Contact Information must include a valid Gmail address, such as yourname@gmail.com',
    missingCountry: 'country',
    missingSignLanguage: 'sign language used',
    personalBioTooLong: 'personal bio within 100 words',
    configMissing: 'Apps Script Web App URL is not configured. Please set appsScriptUrl in public/config.js first.',
    submitHint: 'Submitting information...',
    success: 'Information submitted. Upload now. The system will automatically detect the upload status, with a possible 1-2 minute delay.',
    mobileSuccess: 'Information submitted. The upload folder has been shared with your Gmail. Open the Google Drive app, go to "Shared with me", find the newest shared folder, and upload videos there. The system will automatically detect the upload status, with a possible 1-2 minute delay.',
    mobileSuccessNoShare: 'Information submitted. Open the Google Drive app and check "Shared with me" for the newest shared folder. If it does not appear yet, refresh later or check that the Gmail is correct. The system will automatically detect the upload status, with a possible 1-2 minute delay.',
    networkError: 'Submission failed or the network is unstable. Please check your connection and try again.',
    serverError: 'The service did not respond in time. Please try again later.',
    timeoutError: 'The submission timed out. Check your network and try again.',
    linkReadyTitle: 'Upload link generated',
    linkReadyHint: 'Open the Google Drive folder and upload one or more videos. The system will automatically detect the upload status, with a possible 1-2 minute delay.',
    linkReadyTitleMobile: 'Upload in the Google Drive app',
    linkReadyHintMobile: 'The upload folder has been shared with the Gmail entered above. On mobile, find the newest folder in "Shared with me" in the Google Drive app. The system will automatically detect the upload status, with a possible 1-2 minute delay.',
    submissionIdLabel: 'Submission ID',
    openDriveBtn: 'Open upload link',
    continueUploadBtn: 'Continue uploading',
    exitBtn: 'Exit',
    viewUploadFolder: 'Open upload folder',
    openFirstHint: 'Upload videos in the opened Google Drive folder. The system will automatically detect the upload status, with a possible 1-2 minute delay.',
    closeHint: 'You may close this page.',
    mobileUploadHint: 'On mobile, do not use the web Drive link for upload. Open the Google Drive app with the Gmail entered above, then find the newest shared folder in "Shared with me".',
    inAppBrowserHint: 'In-app browsers such as WeChat are not suitable for Google Drive upload. Open the Google Drive app and upload in the newest shared folder under "Shared with me".',
    mobileUploadStep1: 'Open the Google Drive app and confirm it is signed in with the Gmail entered above.',
    mobileUploadStep2: 'Go to "Shared with me" and find the newest shared upload folder.',
    mobileUploadStep3: 'Open that folder, tap + / Upload, and choose one or more videos.',
    mobileUploadStep4: 'After uploading, the system will automatically detect the file count, with a possible 1-2 minute delay.',
    copyFailed: 'Copy failed. Long-press the upload link to copy it.'
  }
};

const CONFIG = window.UPLOAD_PORTAL_CONFIG || {};
const BRIDGE_SOURCE = 'video-upload-portal-apps-script';
const REQUEST_TIMEOUT_MS = 45000;
const SUBMISSION_STORAGE_KEY = 'videoUploadPortal.latestSubmission';
const CONTACT_EMAIL = 'smartlearning@bnu.edu.cn';

const state = {
  lang: localStorage.getItem('lang') || 'en',
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
  contactNote: document.getElementById('contactNote'),
  resultBox: document.getElementById('resultBox'),
  resultMessage: document.getElementById('resultMessage'),
  resultLink: document.getElementById('resultLink'),
  linkPreview: document.getElementById('linkPreview'),
  submissionId: document.getElementById('submissionId'),
  mobileUploadNote: document.getElementById('mobileUploadNote'),
  driveLink: document.getElementById('driveLink'),
  driveLinkLabel: document.getElementById('driveLinkLabel')
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
    const translated = t(node.dataset.i18n);
    if (translated) {
      node.textContent = translated;
    }
  });

  document.querySelectorAll('[data-i18n-placeholder]').forEach((node) => {
    const translated = t(node.dataset.i18nPlaceholder);
    if (translated) {
      node.placeholder = translated;
    }
  });

  renderContactNote();

  if (state.latestSubmission) {
    renderSubmissionControls();
  }

  updatePrimaryAction();
}

function renderContactNote() {
  if (!els.contactNote) return;

  els.contactNote.textContent = '';
  const contactText = t('contactNote');
  const [beforeText, afterText = ''] = contactText.split(CONTACT_EMAIL);
  const before = document.createTextNode(beforeText);
  const link = document.createElement('a');
  link.href = `mailto:${CONTACT_EMAIL}`;
  link.textContent = CONTACT_EMAIL;
  const after = document.createTextNode(afterText);
  els.contactNote.append(before, link, after);
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
  saveSubmission();
  renderSubmissionControls();
}

function countWords(value) {
  const normalized = String(value || '').trim();
  if (!normalized) return 0;
  return normalized.split(/\s+/).filter(Boolean).length;
}

function includesGmail(value) {
  return /[A-Z0-9._%+-]+@gmail\.com\b/i.test(String(value || ''));
}

function collectMissingFields() {
  const missing = [];
  const form = els.form;

  const name = form.elements.name.value.trim();
  const organization = form.elements.organization.value.trim();
  const contactInfo = form.elements.contactInfo.value.trim();
  const country = form.elements.country.value.trim();
  const signLanguageUsed = form.elements.signLanguageUsed.value.trim();
  const personalBio = form.elements.personalBio.value.trim();

  if (!name) missing.push(t('missingName'));
  if (!organization) missing.push(t('missingOrg'));
  if (!contactInfo) {
    missing.push(t('missingContact'));
  } else if (state.isMobile && !includesGmail(contactInfo)) {
    missing.push(t('invalidGmail'));
  }
  if (!country) missing.push(t('missingCountry'));
  if (!signLanguageUsed) missing.push(t('missingSignLanguage'));
  if (countWords(personalBio) > 100) missing.push(t('personalBioTooLong'));

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
    contactInfo: form.elements.contactInfo.value.trim(),
    country: form.elements.country.value.trim(),
    signLanguageUsed: form.elements.signLanguageUsed.value.trim(),
    personalBio: form.elements.personalBio.value.trim(),
    isMobile: state.isMobile ? 'true' : 'false',
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
  const showPcUploadActions = !state.isMobile;

  els.linkPreview.hidden = false;
  if (els.submissionId) {
    els.submissionId.textContent = submission.submissionId || '-';
  }
  els.driveLink.href = submission.folderUrl || '#';
  els.driveLinkLabel.textContent = t('openDriveBtn');
  updateMobileUploadNote();
  els.driveLink.hidden = !showPcUploadActions;
  els.driveLink.style.display = showPcUploadActions ? '' : 'none';
  els.driveLink.setAttribute('aria-hidden', String(!showPcUploadActions));

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

function handleDriveLinkClick() {
  if (!state.latestSubmission) return;

  markUploadLinkOpened();
  showResult(t(isLikelyInAppBrowser() ? 'inAppBrowserHint' : 'openFirstHint'), '', '', 'success');
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
els.driveLink.addEventListener('click', handleDriveLinkClick);
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
