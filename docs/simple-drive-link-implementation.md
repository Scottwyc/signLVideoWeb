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
-> 用户回到网页点击“我已完成上传”
-> Apps Script 更新 Sheet 状态并标注 Drive 文件
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
https://script.google.com/macros/s/AKfycbyVAcJZKv-wesuIqbSS_YTjBOpj93EpdPWH6rBli61d71wCw0da1Myl5ahgCX6TBo9R/exec
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
1. 用户填写姓名、机构/组织、邮箱、国家/地区、其他说明。
2. 点击“提交信息并获取上传链接”。
3. 页面显示加载动画。
4. Apps Script 写入 Google Sheet，并在 Google Drive 中创建专属上传文件夹。
5. Apps Script 将子文件夹设置为“知道链接的任何人可编辑”，并尝试共享给表单邮箱。
6. 前端显示 Submission ID 和“打开上传链接”按钮。
7. “我已完成上传”按钮默认灰色且不可点击。
8. 用户点击“打开上传链接”后进入 Google Drive 文件夹上传视频。
9. 点击过上传链接后，“我已完成上传”按钮变为可点击。
10. 用户上传视频后回到网页，点击“我已完成上传”。
11. Apps Script 更新 Google Sheet 状态，并扫描/标注 Drive 文件。
12. “我已完成上传”再次变为灰色不可点击。
13. 上传链接按钮变为“继续上传”，继续打开同一个 Drive 文件夹。
```

### 2. Mobile 端流程

经过测试，手机端直接打开 Google Drive 文件夹网页链接时，尤其是在微信内置浏览器中，容易只显示“没有内容”，并且看不到稳定的上传入口。因此当前 Mobile 端不再主推网页链接上传，而是引导用户使用 Google Drive App。

```text
1. 页面提示：NOTE: 建议使用 PC 端，操作更方便。
2. 用户填写姓名、机构/组织、邮箱、国家/地区、其他说明。
3. Mobile 端强制要求邮箱为 Gmail 地址，例如 yourname@gmail.com。
4. 该 Gmail 应为手机 Google Drive App 当前登录账号。
5. 用户点击“提交信息并共享文件夹”。
6. Apps Script 创建 Drive 子文件夹。
7. Apps Script 将该子文件夹设置为“知道链接的任何人可编辑”。
8. Apps Script 额外执行 folder.addEditor(email)，把子文件夹直接共享给用户填写的 Gmail。
9. Apps Script 尝试向该 Gmail 发送包含上传文件夹链接的邮件。
10. 前端显示 Submission ID 和 Google Drive App 操作步骤。
11. Mobile 端不显示“打开上传链接”“复制链接”等按钮，避免误导用户去手机网页上传。
12. 用户打开 Google Drive App，并确认登录的是刚才填写的 Gmail。
13. 用户进入“与我共享”，找到最新共享的上传文件夹。
14. 用户进入该文件夹后点击 + / 上传，选择一个或多个视频。
15. 上传完成后回到网页，点击“我已完成上传”。
16. Apps Script 更新 Google Sheet 状态，并扫描/标注 Drive 文件。
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

该流程对 PC 端仍然适用，但不再作为 Mobile 端主流程。

## 五、前端交互细节

### 1. 必填项和邮箱校验

以下字段必填，页面会用红色 `*` 标识，并在缺失时阻止提交：

```text
姓名 / Name
机构或组织 / Organization
邮箱 / Email
国家或地区 / Countries
```

PC 端邮箱项不显示额外提示词，用户可以填写常用邮箱。

Mobile 端邮箱项显示 Gmail 要求，并强制校验：

```text
邮箱必须是 @gmail.com 地址
示例：yourname@gmail.com
```

如果 Mobile 端用户填写非 Gmail 邮箱，页面会阻止提交并提示：

```text
手机端请填写有效的 Gmail 地址，例如 yourname@gmail.com
```

### 2. PC / Mobile 显示差异

PC 端：

```text
1. 显示“打开上传链接”按钮。
2. 显示“复制链接”按钮。
3. “我已完成上传”按钮默认灰色。
4. 只有点击过“打开上传链接”或“继续上传”后，才能点击“我已完成上传”。
5. Countries 输入框与其他必填输入框保持相同宽度，仍支持搜索匹配国家/地区。
```

Mobile 端：

```text
1. 显示 NOTE: 建议使用 PC 端，操作更方便。
2. 显示 Gmail 要求。
3. 提交后显示 Google Drive App 操作步骤。
4. 不显示“打开上传链接”按钮。
5. 不显示“复制链接”按钮。
6. “我已完成上传”按钮在提交成功后可用，用户需完成 Drive App 上传后再点击。
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

用户点击“我已完成上传”后，该按钮变为：

```text
Continue uploading
```

两个状态打开的都是同一个 Google Drive 子文件夹，不会新建提交记录。

Mobile 端不显示上传链接按钮。

### 5. “I have finished uploading” 按钮

PC 端默认状态：

```text
灰色，不可点击
```

点击过 `Open upload link` 或 `Continue uploading` 后：

```text
变为正常颜色，可点击
```

点击确认完成并成功更新 Sheet 后：

```text
再次变为灰色，不可点击
```

Mobile 端：

```text
提交成功后可点击。
用户应先在 Google Drive App 的“与我共享”中找到最新共享文件夹并上传视频。
上传完成后回到网页点击该按钮。
点击确认完成并成功更新 Sheet 后，再次变为灰色不可点击。
```

### 6. Message 提示

PC 端成功提示：

```text
Information submitted. Upload now.
```

中文为：

```text
信息已提交，请现在上传。
```

Mobile 端共享成功提示：

```text
信息已提交，上传文件夹已共享到你的 Gmail。请打开 Google Drive App，在“与我共享”中找到最新共享文件夹并上传。
```

Mobile 端未检测到共享成功标记时：

```text
信息已提交。请打开 Google Drive App，在“与我共享”中查找最新共享文件夹；如果暂时看不到，请稍后刷新或检查 Gmail 是否正确。
```

提示区不再额外显示 `Open upload folder` 链接，避免和主上传按钮重复。

错误提示会用红色显示，例如网络异常、配置缺失、必填项缺失等。

## 六、Google Sheet 表结构

`Submissions` 工作表当前字段：

```text
submission_id
submitted_at
name
organization
email
countries
others
folder_id
folder_url
status
completed_at
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
folder_id           本次提交对应的 Drive 子文件夹 ID
folder_url          用户上传视频的 Drive 文件夹链接
status              当前状态
completed_at        用户点击“我已完成上传”的时间
file_count          该文件夹下扫描到的文件数量
upload_file_names   上传文件名列表
annotated_at        文件夹/文件标注时间
notes               共享到邮箱、邮件通知等辅助执行结果
```

`notes` 字段当前会记录 Apps Script 尝试共享和发信的结果，例如：

```text
direct_email_share_added: user@gmail.com
email_notification_sent: user@gmail.com
direct_email_share_failed: user@gmail.com: ...
email_notification_failed: user@gmail.com: ...
```

Mobile 端前端会根据 Apps Script 返回的 `sharingNote` 判断是否显示“已共享到你的 Gmail”的成功提示。

当前状态值：

```text
pending_upload      已提交信息，等待用户上传
user_confirmed      用户已点击“我已完成上传”
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
Email
Countries
Submitted at
Folder URL
Other notes
```

同时脚本会执行以下权限设置：

```text
1. folder.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.EDIT)
2. folder.addEditor(request.email)
```

第一步用于保留 PC 端通过链接上传的能力。第二步用于把子文件夹直接共享给用户填写的邮箱，尤其方便 Mobile 用户在 Google Drive App 的“与我共享”中找到该文件夹。

脚本还会尝试向用户填写的邮箱发送一封通知邮件，邮件中包含：

```text
Submission ID
Upload folder URL
Mobile upload guidance
```

注意：如果邮箱不是有效 Google/Gmail 账号、Workspace 管理员限制共享、或 MailApp 权限未授权，共享或邮件可能失败。失败不会阻止提交记录创建，但会写入 `notes`。

### 2. 用户点击“我已完成上传”时

脚本会：

```text
1. 根据 submission_id 找到 Sheet 中对应行。
2. 找到该行对应的 Drive 子文件夹。
3. 扫描该文件夹中的文件。
4. 给每个文件写入描述信息。
5. 统计文件数量并写回 file_count。
6. 把文件名列表写回 upload_file_names。
7. 把标注时间写回 annotated_at。
8. 把状态更新为 user_confirmed。
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
```

### Gmail 共享和邮件通知

当前 `createSubmission_` 创建文件夹后，会调用：

```javascript
const sharingNote = shareUploadFolderWithEmail_(folder, request.email, folderUrl, submissionId);
```

`shareUploadFolderWithEmail_` 会：

```text
1. 读取表单 email。
2. 调用 folder.addEditor(email)，把上传子文件夹直接共享给该邮箱。
3. 调用 MailApp.sendEmail(email, ...)，发送上传文件夹链接。
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
```

## 十二、当前限制

当前最简方案仍然有以下限制：

```text
1. 网页本身不直接上传视频文件。
2. 用户需要在 Google Drive 页面中上传视频。
3. 网页无法强制验证用户是否真的上传了文件。
4. 文件扫描和标注发生在用户点击“我已完成上传”之后。
5. Drive 子文件夹采用“知道链接的人可编辑”，适合试点，但不是高安全方案。
6. 如果用户不点击确认，Sheet 状态可能一直停留在 pending_upload。
7. Mobile 端依赖用户填写正确 Gmail，并且该 Gmail 与手机 Google Drive App 登录账号一致。
8. Mobile 端“与我共享”中出现文件夹可能存在短暂延迟，用户可能需要刷新 Google Drive App。
9. 如果 Google Workspace 管理员限制外部共享，folder.addEditor 或 anyone-with-link 权限可能无法达到预期。
10. 邮件通知依赖 Apps Script 的 MailApp 授权和 Google 发送限制。
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
