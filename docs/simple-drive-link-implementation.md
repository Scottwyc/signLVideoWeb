# 最简 Drive 链接上传方案实现说明

更新时间：2026-06-27

本文记录当前“视频上传平台”的最简可运行方案，包括网页前端、Google Apps Script、Google Sheet、Google Drive、GitHub Pages 自动部署等已经成功配置的信息和操作流程。

## 一、当前已跑通的整体架构

当前方案不是网页直接接收视频文件，而是：

```text
GitHub Pages 静态前端
-> Google Apps Script Web App
-> Google Sheet 保存提交信息
-> Google Drive 为每次提交创建专属上传文件夹
-> PC 用户通过 Google Drive 文件夹链接上传视频
-> Mobile 用户使用 Google Drive App，在“与我共享”中找到共享文件夹上传视频
-> Apps Script 每 1 分钟自动扫描近期上传文件夹
-> Apps Script 自动更新 Sheet 状态、文件数量和 Drive 文件标注信息
```

这个方案的优点是部署简单、成本低、不需要维护 Node 服务器，也不需要把 Google 私钥放到前端。

## 二、当前成功配置的信息

### 1. GitHub 仓库

```text
https://github.com/Scottwyc/signLVideoWeb
```

当前分支：

```text
main      源码、文档、Apps Script、前端文件
gh-pages  GitHub Actions 自动生成的网页发布分支
```

注意：`gh-pages` 是发布分支，不需要合并回 `main`。后续只需要修改 `main`，push 后 GitHub Actions 会自动更新 `gh-pages`。

### 2. GitHub Pages 网页地址

```text
https://scottwyc.github.io/signLVideoWeb/
```

GitHub Pages 设置方式：

```text
Settings -> Pages
Source: Deploy from a branch
Branch: gh-pages
Folder: / root
```

### 3. Google Sheet

用于保存用户提交信息的 Google Sheet ID：

```text
1UcsBA46ws9DZX7_Q7TtgC99zEkwowQR9O2iOaBShPvo
```

对应链接：

```text
https://docs.google.com/spreadsheets/d/1UcsBA46ws9DZX7_Q7TtgC99zEkwowQR9O2iOaBShPvo/edit
```

实际数据写入到工作表标签：

```text
Submissions
```

### 4. Google Drive 总文件夹

用于创建每个用户专属上传文件夹的根目录 ID：

```text
1VGHiAHHnHO9MjaDRPdKTFr2LSbFh_I43
```

对应链接：

```text
https://drive.google.com/drive/folders/1VGHiAHHnHO9MjaDRPdKTFr2LSbFh_I43
```

### 5. Google Apps Script Web App

当前前端正在使用的 Apps Script Web App URL：

```text
https://script.google.com/macros/s/AKfycbye8zXvdBa7quky_hRriRkSStHp2pMUVmys1B2Vw5OGMjuexL3nUKsUs56SE5X8R49x/exec
```

这个地址已经写入：

```text
public/config.js
```

## 三、当前项目文件结构

```text
public/
  index.html       前端页面
  styles.css       页面样式
  app.js           前端交互逻辑
  config.js        Apps Script Web App URL 配置
  assets/          背景图片等静态资源

apps-script/
  Code.gs          Google Apps Script 后端脚本

docs/
  *.md             中文 Markdown 文档
  *.docx           对应 Word 文档

.github/workflows/
  deploy-pages.yml GitHub Pages 自动部署 workflow
```

## 四、当前网页用户流程

用户访问：

```text
https://scottwyc.github.io/signLVideoWeb/
```

页面会自动区分 PC 端和 Mobile 端。区分依据包括浏览器 `userAgent`、触屏指针特征、屏幕宽度以及 iPad 类设备特征。

### 1. PC 端流程

```text
1. 用户填写 Name、Organization、Contact Information、Country、Sign language used，并可选填写 Personal Bio。
2. 点击“提交信息并获取上传链接”。
3. 页面显示加载动画。
4. Apps Script 写入 Google Sheet，并在 Google Drive 中创建专属上传文件夹。
5. Apps Script 将子文件夹设置为“知道链接的任何人可编辑”，并尝试从 Contact Information 中提取邮箱进行共享。
6. 前端显示“打开上传链接”按钮。
7. 用户点击“打开上传链接”后进入 Google Drive 文件夹上传一个或多个视频。
8. 前端提示系统会自动检测上传状态，可能有 1-2 分钟延迟。
9. Apps Script 定时触发器每 1 分钟扫描近期提交记录对应的 Drive 文件夹。
10. 如果检测到文件，Apps Script 自动更新 Google Sheet 状态、文件数量和文件名列表，并标注 Drive 文件。
11. 用户如需继续上传，可以再次打开同一个 Drive 文件夹，不会新建提交记录。
```

### 2. Mobile 端流程

经过测试，手机端直接打开 Google Drive 文件夹网页链接时，尤其是在微信内置浏览器中，容易只显示“没有内容”，并且看不到稳定的上传入口。因此当前 Mobile 端不再主推网页链接上传，而是引导用户使用 Google Drive App。

```text
1. 页面提示：NOTE: 建议使用 PC 端，操作更方便。
2. 用户填写 Name、Organization、Contact Information、Country、Sign language used，并可选填写 Personal Bio。
3. Mobile 端强制要求 Contact Information 中包含 Gmail 地址，例如 yourname@gmail.com。
4. 该 Gmail 应为手机 Google Drive App 当前登录账号。
5. 用户点击“提交信息并共享文件夹”。
6. Apps Script 创建 Drive 子文件夹。
7. Apps Script 将该子文件夹设置为“知道链接的任何人可编辑”。
8. Apps Script 额外执行 folder.addEditor(email)，把子文件夹直接共享给用户填写的 Gmail。
9. Apps Script 尝试向该 Gmail 发送包含上传文件夹链接的邮件。
10. 前端显示 Google Drive App 操作步骤。
11. Mobile 端不显示“打开上传链接”“复制链接”等按钮，避免误导用户去手机网页上传。
12. 用户打开 Google Drive App，并确认登录的是刚才填写的 Gmail。
13. 用户进入“与我共享”，找到最新共享的上传文件夹。
14. 用户进入该文件夹后点击 + / 上传，选择一个或多个视频。
15. 前端提示系统会自动检测上传状态，可能有 1-2 分钟延迟。
16. Apps Script 定时触发器自动扫描该文件夹，并更新 Google Sheet。
```

Mobile 端提交成功后，如果 Apps Script 返回的 `sharingNote` 中包含：

```text
direct_email_share_added
```

页面会提示：

```text
信息已提交，上传文件夹已共享到你的 Gmail。请打开 Google Drive App，在“与我共享”中找到最新共享文件夹并上传。
```

如果没有检测到上述共享成功标记，页面会提示用户稍后刷新 Google Drive App 或检查 Gmail 是否正确。

### 3. 旧版统一流程说明

早期版本中，PC 和 Mobile 使用相同流程：

```text
1. 提交信息。
2. 页面显示上传链接。
3. 用户打开 Drive 链接上传。
4. 回到页面确认完成。
```

该流程已被当前自动扫描逻辑替代，不再要求用户点击“我已完成上传”。

## 五、前端交互细节

### 1. 必填项和联系方式校验

以下字段必填，页面会用红色 `*` 标识，并在缺失时阻止提交：

```text
Name
Organization (School, University, Institution...)
Contact Information (Email/WeChat)
Country
Sign language used
```

以下字段为选填，但限制在 100 words 以内：

```text
Personal Bio
```

PC 端 `Contact Information` 可填写邮箱或微信号。若其中包含邮箱，Apps Script 会尝试把 Drive 上传文件夹直接共享给该邮箱，并发送通知邮件；如果只填写微信号，PC 端仍可通过页面生成的 Drive 上传链接上传。

Mobile 端 `Contact Information` 必须包含 Gmail 地址，因为手机端推荐流程依赖 Google Drive App 的“与我共享”：

```text
Contact Information 中必须包含 @gmail.com 地址
示例：yourname@gmail.com
```

如果 Mobile 端用户没有填写 Gmail，页面会阻止提交并提示：

```text
手机端联系方式中必须包含有效的 Gmail 地址，例如 yourname@gmail.com
```

### 2. PC / Mobile 显示差异

PC 端：

```text
1. 显示“打开上传链接”按钮。
2. 不显示“复制链接”按钮。
3. 不显示“我已完成上传”按钮。
4. 提交成功后提示系统会自动检测上传状态，可能有 1-2 分钟延迟。
5. Country 输入框与其他必填输入框保持相同宽度，仍支持搜索匹配国家。
6. 页面右侧显示 Copyright Notice 卡片，移动端会在页面后部显示。
```

Mobile 端：

```text
1. 显示 NOTE: 建议使用 PC 端，操作更方便。
2. 显示 Gmail 要求。
3. 提交后显示 Google Drive App 操作步骤。
4. 不显示“打开上传链接”按钮。
5. 不显示“复制链接”按钮。
6. 不显示“我已完成上传”按钮。
7. 提交成功后提示系统会自动检测上传状态，可能有 1-2 分钟延迟。
```

Mobile 端隐藏链接按钮使用多层兜底：

```text
1. HTML 给链接按钮添加 pc-upload-action 类。
2. JavaScript 在 mobile 模式下设置 display: none。
3. CSS 通过 body.is-mobile-flow 强制隐藏。
4. CSS 通过小屏和触屏媒体查询再次兜底隐藏。
```

### 3. 提交按钮

初始状态：

```text
PC: Submit details and get upload link
Mobile: Submit details and share folder
```

提交中：

```text
按钮显示转圈动画
按钮文字显示正在提交
```

提交成功后：

```text
按钮变为 Exit / 退出
```

### 4. 上传链接按钮

PC 端第一次提交成功后显示：

```text
Open upload link
```

如果用户需要继续上传，仍然使用同一个按钮打开原 Drive 子文件夹。按钮不会新建提交记录，也不会生成新的 Drive 文件夹。

中文界面中对应显示为：

```text
打开上传链接
```

Mobile 端不显示上传链接按钮。

### 5. 自动上传状态检测

当前前端已经取消“我已完成上传 / I have finished uploading”按钮。用户提交表单并进入 Drive 文件夹上传后，不需要再回到网页确认。

页面会提示：

```text
The system will automatically detect the upload status, with a possible 1-2 minute delay.
```

中文界面中对应提示为：

```text
系统会自动检测上传状态，可能有 1-2 分钟延迟。
```

### 6. Message 提示

PC 端成功提示：

```text
Information submitted. Upload now. The system will automatically detect the upload status, with a possible 1-2 minute delay.
```

中文为：

```text
信息已提交，请现在上传。系统会自动检测上传状态，可能有 1-2 分钟延迟。
```

Mobile 端共享成功提示：

```text
信息已提交，上传文件夹已共享到你的 Gmail。请打开 Google Drive App，在“与我共享”中找到最新共享文件夹并上传。
```

Mobile 端未检测到共享成功标记时：

```text
信息已提交。请打开 Google Drive App，在“与我共享”中查找最新共享文件夹；如果暂时看不到，请稍后刷新或检查 Gmail 是否正确。
```

提示区不再额外显示 `Open upload folder` 链接，避免和主上传按钮重复。前端也不再显示提交编号，提交编号只保留在 Google Sheet 和 Drive 文件/文件夹标注中。

错误提示会用红色显示，例如网络异常、配置缺失、必填项缺失等。

## 六、Google Sheet 表结构

`Submissions` 工作表当前字段：

```text
submission_id
submitted_at
name
organization
contact_info
country
sign_language_used
personal_bio
folder_id
folder_url
status
firstDetected_at
file_count
upload_file_names
annotated_at
notes
user_agent
```

重要字段说明：

```text
submission_id       每次提交的唯一编号
submitted_at        用户提交信息的时间
name                用户姓名
organization        学校、大学、机构或组织
contact_info        联系方式，可填写 Email 或 WeChat；如果包含邮箱，脚本会尝试共享 Drive 文件夹和发送邮件
country             国家
sign_language_used  使用的手语，例如 Chinese Sign Language、American Sign Language
personal_bio        个人简介，选填，100 words 以内
folder_id           本次提交对应的 Drive 子文件夹 ID
folder_url          用户上传视频的 Drive 文件夹链接
status              当前状态
firstDetected_at    第一次自动检测到该文件夹已有上传文件的时间
file_count          该文件夹下扫描到的文件数量
upload_file_names   上传文件名列表
annotated_at        最近一次自动扫描和标注时间
notes               共享到邮箱、邮件通知等辅助执行结果
```

时间字段显示格式统一为分钟级：

```text
yyyy-mm-dd hh:mm
```

其中 `annotated_at` 适合用来判断 Apps Script 定时扫描是否正在运行；`firstDetected_at` 只在第一次发现视频文件时写入，后续扫描不会覆盖。

`notes` 字段当前会记录 Apps Script 尝试共享和发信的结果，例如：

```text
direct_email_share_added: user@gmail.com
email_notification_sent: user@gmail.com
direct_email_share_failed: user@gmail.com: ...
email_notification_failed: user@gmail.com: ...
```

Mobile 端前端会根据 Apps Script 返回的 `sharingNote` 判断是否显示“已共享到你的 Gmail”的成功提示。

为了兼容旧表，Apps Script 在运行 `setupSheet()` 或其他会调用 `getSheet_()` 的函数时，会自动重命名旧字段：

```text
email       -> contact_info
countries   -> country
others      -> personal_bio
completed_at -> firstDetected_at
```

当前状态值：

```text
pending_upload      已提交信息，等待用户上传
uploaded_detected   自动扫描已检测到上传文件
```

## 七、Google Drive 文件夹和文件标注逻辑

Apps Script 会自动给每次提交创建一个 Drive 子文件夹，名称类似：

```text
VID-20260626-213000-ABCDEF12_张三_北京师范大学
```

### 1. 创建提交记录时

脚本会给 Drive 子文件夹写入描述信息，包括：

```text
Submission ID
Name
Organization
Contact Information
Country
Sign language used
Submitted at
Folder URL
Personal Bio
```

同时脚本会执行以下权限设置：

```text
1. folder.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.EDIT)
2. 如果 Contact Information 中包含邮箱，folder.addEditor(email)
```

第一步用于保留 PC 端通过链接上传的能力。第二步用于把子文件夹直接共享给 Contact Information 中提取到的邮箱，尤其方便 Mobile 用户在 Google Drive App 的“与我共享”中找到该文件夹。

如果 Contact Information 中包含邮箱，脚本还会尝试向该邮箱发送一封通知邮件，邮件中包含：

```text
Submission ID
Upload folder URL
Mobile upload guidance
```

注意：如果 Contact Information 中没有邮箱、邮箱不是有效 Google/Gmail 账号、Workspace 管理员限制共享、或 MailApp 权限未授权，共享或邮件可能失败或跳过。失败不会阻止提交记录创建，但会写入 `notes`。

### 2. 自动扫描上传文件时

脚本会：

```text
1. 每 1 分钟由 Apps Script 时间触发器运行 scanRecentUploadFolders。
2. 只扫描最近 7 天内提交、且 status 为 pending_upload 或 uploaded_detected 的记录。
3. 根据 submission_id 找到 Sheet 中对应行。
4. 找到该行对应的 Drive 子文件夹。
5. 扫描该文件夹中的文件。
6. 给文件夹和每个文件写入描述信息。
7. 统计文件数量并写回 file_count。
8. 把文件名列表写回 upload_file_names。
9. 把最近扫描时间写回 annotated_at。
10. 如果第一次发现 file_count > 0，则写入 firstDetected_at。
11. 如果检测到文件，则把 status 更新为 uploaded_detected；否则保持 pending_upload。
```

默认会自动重命名上传文件，给文件名前缀加上提交编号和序号：

```text
VID-20260626-213000-ABCDEF12_01_original-video.mp4
```

如果不希望自动重命名，可以在 `apps-script/Code.gs` 顶部修改：

```javascript
const RENAME_UPLOADED_FILES = false;
```

## 八、Apps Script 关键配置

当前 `apps-script/Code.gs` 顶部配置：

```javascript
const SPREADSHEET_ID = '1UcsBA46ws9DZX7_Q7TtgC99zEkwowQR9O2iOaBShPvo';
const ROOT_FOLDER_ID = '1VGHiAHHnHO9MjaDRPdKTFr2LSbFh_I43';
const SHEET_NAME = 'Submissions';
const BRIDGE_SOURCE = 'video-upload-portal-apps-script';
const RENAME_UPLOADED_FILES = true;
const UPLOAD_SCAN_WINDOW_DAYS = 7;
const AUTO_SCAN_STATUSES = ['pending_upload', 'uploaded_detected'];
const SHEET_DATETIME_FORMAT = 'yyyy-mm-dd hh:mm';
```

### 自动扫描触发器

当前自动扫描入口函数是：

```javascript
scanRecentUploadFolders()
```

该函数不会由 Web App URL 自动定时运行，需要在 Apps Script 中先运行一次：

```javascript
setupUploadScannerTrigger()
```

运行并授权后，Apps Script 会创建一个每 1 分钟执行一次的时间触发器。可以在 Apps Script 左侧的 Triggers / 触发器页面查看是否存在 `scanRecentUploadFolders` 的定时触发器。

注意：部署新的 Web App URL 不会自动创建定时触发器。每次新建或更换 Apps Script 项目时，都需要至少手动运行一次 `setupUploadScannerTrigger()`，否则 `scanRecentUploadFolders()` 不会自动每分钟执行。

如果需要手动测试扫描是否正常，可以直接在 Apps Script 编辑器中运行：

```javascript
scanRecentUploadFolders()
```

运行后查看 Google Sheet 中的 `annotated_at` 是否更新到分钟级时间。如果对应 Drive 子文件夹已有文件，还应看到 `file_count`、`upload_file_names`、`status` 和 `firstDetected_at` 更新。

如果需要删除自动扫描触发器，可以运行：

```javascript
removeUploadScannerTrigger()
```

### Gmail 共享和邮件通知

当前 `createSubmission_` 创建文件夹后，会调用：

```javascript
const sharingEmail = extractEmail_(normalized.contactInfo);
const sharingNote = shareUploadFolderWithEmail_(folder, sharingEmail, folderUrl, submissionId);
```

`shareUploadFolderWithEmail_` 会：

```text
1. 从表单 Contact Information 中提取邮箱。
2. 如果提取到邮箱，调用 folder.addEditor(email)，把上传子文件夹直接共享给该邮箱。
3. 如果提取到邮箱，调用 MailApp.sendEmail(email, ...)，发送上传文件夹链接。
4. 把共享和发信结果合并为 sharingNote。
5. 将 sharingNote 写入 Sheet 的 notes 字段。
6. 将 sharingNote 返回给前端。
```

如果修改或新增了 `MailApp.sendEmail` 相关逻辑，Apps Script 可能要求重新授权邮件发送权限。

### 重新部署 Apps Script 的注意事项

如果修改了 `Code.gs`，只保存代码还不够，需要部署新版本：

```text
Deploy -> Manage deployments -> Edit
Version: New version
Deploy
```

否则网页的 `/exec` 地址可能仍然运行旧版本代码。

## 九、为什么使用隐藏 iframe 提交

前端没有直接使用 `fetch` 请求 Apps Script，因为 Google Apps Script Web App 在跨域 POST 时容易遇到 CORS 或重定向问题。

当前采用：

```text
前端创建隐藏 form
-> target 到隐藏 iframe
-> POST 到 Apps Script Web App
-> Apps Script 返回 HTML
-> HTML 使用 window.parent.postMessage 和 window.top.postMessage 把结果传回页面
```

Apps Script 的 `HtmlService` 会包一层 Google sandbox iframe，因此脚本需要向 `window.top` 发送消息，前端页面才能稳定收到：

```text
submissionId
folderUrl
```

前端现在把字段作为普通表单字段提交，而不是只提交 JSON 字符串，避免不同环境下 JSON 解码不一致导致无法写入 Sheet。

## 十、GitHub Pages 自动部署

当前 workflow：

```text
.github/workflows/deploy-pages.yml
```

部署逻辑：

```text
push 到 main
-> GitHub Actions 运行
-> 将 public/ 目录发布到 gh-pages 分支
-> GitHub Pages 从 gh-pages / root 提供网页
```

当前使用 `peaceiris/actions-gh-pages` 发布 `public/` 目录。第一次尝试使用 GitHub 官方 Pages Actions 时，失败发生在 `Setup Pages`；后来改为发布到 `gh-pages` 分支，部署成功。

## 十一、已经验证过的结果

已经确认：

```text
1. GitHub 仓库已建立并推送。
2. GitHub Actions 可以成功运行。
3. gh-pages 分支已自动生成。
4. GitHub Pages 网页可以访问。
5. 前端能提交信息到 Apps Script。
6. Apps Script 能写入 Google Sheet 的 Submissions 工作表。
7. Apps Script 能在 Google Drive 根文件夹下创建子文件夹。
8. 直接调用 Web App 曾成功返回 ok:true、submissionId 和 folderUrl。
9. 网页端提交后，Sheet 中能在 Submissions 标签看到记录。
10. Mobile 端直接打开 Drive 文件夹链接时，可能只显示“没有内容”且没有稳定上传入口。
11. 当前 Mobile 端改为通过 Gmail 直接共享文件夹，再让用户在 Google Drive App 的“与我共享”中查找最新文件夹上传。
12. GitHub Pages 部署已验证可以自动更新前端。
13. 前端已取消“我已完成上传”按钮，改为提示系统自动检测上传状态。
14. Apps Script 已加入 `scanRecentUploadFolders` 自动扫描逻辑，配合 `setupUploadScannerTrigger` 创建 1 分钟定时触发器。
15. Sheet 字段已从 `completed_at` 调整为 `firstDetected_at`，用于记录第一次检测到上传文件的时间。
```

## 十二、当前限制

当前最简方案仍然有以下限制：

```text
1. 网页本身不直接上传视频文件。
2. 用户需要在 Google Drive 页面中上传视频。
3. 网页无法实时强制验证用户是否真的上传了文件。
4. 文件扫描和标注依赖 Apps Script 定时触发器，通常存在 1-2 分钟延迟。
5. Drive 子文件夹采用“知道链接的人可编辑”，适合试点，但不是高安全方案。
6. 如果 Apps Script 触发器未正确安装或授权失败，Sheet 状态可能一直停留在 pending_upload。
7. Mobile 端依赖用户填写正确 Gmail，并且该 Gmail 与手机 Google Drive App 登录账号一致。
8. Mobile 端“与我共享”中出现文件夹可能存在短暂延迟，用户可能需要刷新 Google Drive App。
9. 如果 Google Workspace 管理员限制外部共享，folder.addEditor 或 anyone-with-link 权限可能无法达到预期。
10. 邮件通知依赖 Apps Script 的 MailApp 授权和 Google 发送限制。
11. 自动扫描默认只处理最近 7 天且 status 为 pending_upload 或 uploaded_detected 的记录，以避免长期累积导致扫描变慢。
```

如果以后要在网页里直接拖拽/选择本地文件并上传到 Drive，需要改成以下更复杂方案之一：

```text
方案 A：前端 Google OAuth 登录后调用 Drive API
方案 B：恢复服务器后端上传到 Drive
方案 C：Cloud Storage 直传，再同步到 Drive
```

## 十三、后续维护流程

### 修改网页前端

```text
修改 public/
git add .
git commit -m "描述修改"
git push origin main
```

GitHub Actions 会自动更新 `gh-pages`，无需手动合并分支。

### 修改 Apps Script

```text
1. 修改 apps-script/Code.gs
2. 复制到 Google Apps Script 编辑器
3. 保存
4. Deploy -> Manage deployments -> Edit -> New version -> Deploy
5. 如果 Web App URL 变化，更新 public/config.js
6. 提交并推送代码
```

### 修改文档

文档规则：

```text
每份重要方案文档同时保留 .md 和 .docx
```

导出 Word 示例：

```powershell
pandoc docs\simple-drive-link-implementation.md -f markdown -t docx -o docs\simple-drive-link-implementation.docx
```
