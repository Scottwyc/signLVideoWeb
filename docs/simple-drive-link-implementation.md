# 最简 Drive 链接上传方案实现说明

更新时间：2026-06-26

本文说明当前项目中“提交信息后生成 Google Drive 上传链接”的实现方式、配置步骤，以及如何自动把 Google Sheet 中的用户信息写入对应 Drive 文件夹和视频文件，方便后续查看与管理。

## 一、已实现的页面流程

当前网页流程已经从“网页直接上传视频”调整为：

```text
用户填写姓名、机构、邮箱、国家/地区、其他说明
-> 点击“提交信息并获取上传链接”
-> 网页提交信息到 Google Apps Script
-> Apps Script 写入 Google Sheet
-> Apps Script 创建一个用户专属 Google Drive 子文件夹
-> 网页显示提交编号和 Drive 上传链接
-> 用户打开链接上传一个或多个视频
-> 用户回到网页点击“我已完成上传”
-> Apps Script 更新 Google Sheet 状态
-> Apps Script 给 Drive 文件夹和文件写入提交信息
```

## 二、相关文件

前端文件：

```text
public/index.html
public/app.js
public/config.js
public/styles.css
```

Apps Script 后端脚本：

```text
apps-script/Code.gs
```

## 三、为什么使用隐藏 iframe 提交

前端没有直接使用 `fetch` 请求 Apps Script，因为 Google Apps Script Web App 在跨域 POST 时容易遇到 CORS 或重定向问题。

当前采用：

```text
前端创建隐藏 form
-> target 到隐藏 iframe
-> POST 到 Apps Script Web App
-> Apps Script 返回一段 HTML
-> HTML 用 window.parent.postMessage 和 window.top.postMessage 把结果传回页面
```

Apps Script 的 HtmlService 会再包一层 Google sandbox iframe，因此脚本需要向 `window.top` 发送消息，前端页面才能稳定收到 `submissionId` 和 `folderUrl`。

前端现在把 `action`、`requestId`、`name`、`organization`、`email` 等字段作为普通表单字段提交，Apps Script 同时兼容普通字段和 `payload` JSON 字段，避免不同环境下 JSON 字符串解码不一致导致无法写入 Sheet。

## 四、Google Sheet 准备

创建一个 Google Sheet，用来保存表单记录。Apps Script 会自动使用或创建名为 `Submissions` 的工作表，并写入表头。

当前表头包括：

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

如果 Sheet 里已经有旧表头，脚本会自动补充缺失的新列。

需要复制 Google Sheet 链接中的 ID。

示例：

```text
https://docs.google.com/spreadsheets/d/1AbCdEfGhIjKlMnOpQrStUvWxYz/edit
```

其中 `1AbCdEfGhIjKlMnOpQrStUvWxYz` 就是 `SPREADSHEET_ID`。

## 五、Google Drive 总文件夹准备

创建一个用于接收所有视频的 Google Drive 总文件夹。

示例结构：

```text
Video Upload Root
├── VID-20260626-213000-ABCDEF12_张三_北京师范大学
├── VID-20260626-213120-39F2A001_Li-Ming_University-A
```

需要复制总文件夹链接中的 ID。

示例：

```text
https://drive.google.com/drive/folders/1AbCdEfGhIjKlMnOpQrStUvWxYz
```

其中 `1AbCdEfGhIjKlMnOpQrStUvWxYz` 就是 `ROOT_FOLDER_ID`。

## 六、Apps Script 配置步骤

1. 打开 Google Apps Script：

```text
https://script.google.com/
```

2. 新建项目。
3. 把项目中的 `apps-script/Code.gs` 内容复制到 Apps Script 编辑器。
4. 修改文件顶部：

```javascript
const SPREADSHEET_ID = 'PASTE_GOOGLE_SHEET_ID_HERE';
const ROOT_FOLDER_ID = 'PASTE_DRIVE_ROOT_FOLDER_ID_HERE';
```

改成真实 Google Sheet ID 和 Drive 总文件夹 ID。

5. 按需设置是否自动重命名文件：

```javascript
const RENAME_UPLOADED_FILES = true;
```

`true` 表示用户点击“我已完成上传”后，脚本会给文件名前缀加上 Submission ID，例如：

```text
VID-20260626-213000-ABCDEF12_01_original-video.mp4
```

如果不想改用户上传的原始文件名，可以改为：

```javascript
const RENAME_UPLOADED_FILES = false;
```

6. 运行一次 `setupSheet`。

首次运行时，Google 会要求授权访问 Google Sheet 和 Google Drive。

7. 部署为 Web App：

```text
Deploy -> New deployment -> Web app
```

建议设置：

```text
Execute as: Me
Who has access: Anyone
```

8. 部署后复制 Web App URL，格式类似：

```text
https://script.google.com/macros/s/AKfycbx.../exec
```

如果修改了 `Code.gs`，需要重新部署 Web App：

```text
Deploy -> Manage deployments -> Edit -> Version 选择 New version -> Deploy
```

只在编辑器里保存代码，不一定会更新已经发布的 `/exec` 地址对应版本。

## 七、前端配置步骤

打开：

```text
public/config.js
```

把：

```javascript
appsScriptUrl: ''
```

改为：

```javascript
appsScriptUrl: 'https://script.google.com/macros/s/AKfycbx.../exec'
```

保存后刷新网页。

## 八、自动写入 Drive 文件夹和视频文件信息

现在脚本会自动把 Google Sheet 里的信息写入 Drive 文件夹和视频文件。

### 创建提交记录时

Apps Script 会创建用户专属文件夹，并把以下信息写入文件夹描述：

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

这样管理员在 Google Drive 中查看该文件夹详情时，就能看到对应用户信息。

### 用户点击“我已完成上传”时

Apps Script 会执行以下动作：

1. 读取该提交编号对应的 Sheet 行。
2. 找到该行记录的 Drive 子文件夹。
3. 扫描子文件夹中的文件。
4. 给每个文件写入同样的描述信息。
5. 可选：给文件名前缀加上 Submission ID 和序号。
6. 把文件数量写入 Sheet 的 `file_count`。
7. 把文件名列表写入 Sheet 的 `upload_file_names`。
8. 把标注时间写入 Sheet 的 `annotated_at`。
9. 把状态更新为 `user_confirmed`。

文件描述示例：

```text
Submission ID: VID-20260626-213000-ABCDEF12
Name: 张三
Organization: 北京师范大学
Email: zhangsan@example.com
Countries: China
Submitted at: Fri Jun 26 2026 ...
Folder URL: https://drive.google.com/drive/folders/...
Other notes: ...

File original name: lecture-video.mp4
```

## 九、权限说明

Apps Script 会为每次提交创建一个 Drive 子文件夹，并执行：

```javascript
folder.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.EDIT);
```

含义是：

```text
知道该子文件夹链接的人可以编辑/上传文件。
```

需要注意：

- 链接泄露后，其他人也可能上传文件。
- 建议每个用户单独创建子文件夹，不要共用一个文件夹。
- 后续正式使用时，可以考虑更严格的权限策略。

## 十、测试清单

1. 网页能正常打开。
2. 必填项为空时不能提交。
3. 邮箱格式错误时不能提交。
4. 填完信息后能生成提交编号。
5. Google Sheet 出现一条新记录。
6. Google Drive 总文件夹下出现一个新子文件夹。
7. Drive 子文件夹描述中能看到提交信息。
8. 网页上的“打开上传链接”能进入该子文件夹。
9. 用户可以在子文件夹中上传视频。
10. 点击“我已完成上传”后，Google Sheet 的 `status` 变为 `user_confirmed`。
11. `file_count` 能记录该文件夹下文件数量。
12. `upload_file_names` 能记录文件名列表。
13. `annotated_at` 能记录标注时间。
14. Drive 文件详情中能看到用户信息描述。
15. 如果 `RENAME_UPLOADED_FILES = true`，文件名会加上 Submission ID 前缀。

## 十一、当前限制

- 网页不能直接验证 Drive 上传过程，只能通过确认按钮和文件夹扫描辅助判断。
- 如果用户打开 Drive 后没有上传，系统也会有一条 `pending_upload` 记录。
- 如果用户点击确认但没有上传文件，`file_count` 可能为 0。
- Drive 子文件夹采用链接编辑权限，适合试点，但不适合高安全场景。
- 文件标注发生在用户点击“我已完成上传”之后；如果用户不点击确认，文件不会立即被标注。

## 十二、后续可增强方向

- Apps Script 定时扫描所有 pending 文件夹。
- 自动把有文件的记录标为 `uploaded_detected`。
- 自动给新发现的文件补写描述。
- 自动发送确认邮件。
- 管理员检查状态字段。
- 增加验证码或提交频率限制。
- 给 Drive 子文件夹设置更严格权限。
