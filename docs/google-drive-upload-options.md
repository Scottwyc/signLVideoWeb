# Google Drive 视频上传方案说明

本文说明“全球用户通过网页上传视频到指定 Google Drive”的几种实现方式、适用条件、风险和推荐方案。

## 目标场景

网页长期开放，来自全球的访问者填写基本信息并上传一个或多个视频。视频最终进入指定的 Google Drive 账户或文件夹中。

核心需求包括：

- 用户不一定有 Google 账号。
- 用户不应看到或接触 Google Drive API 私钥。
- 上传信息和视频需要统一收集。
- 上传过程需要可控、可记录、可排错。
- 面向全球访问，需要稳定的公网服务器和 HTTPS。

## 方案一：用户网页上传到服务器，再由服务器上传到 Google Drive

流程：

```text
用户浏览器 -> 你的服务器 -> Google Drive API -> 指定 Google Drive 文件夹
```

这是当前项目采用的方案。

### 需要什么

- 一台可公网访问的服务器。
- 一个域名和 HTTPS 证书。
- Google Cloud 项目。
- 已启用的 Google Drive API。
- Service Account 凭据。
- 目标 Google Drive 文件夹向 Service Account 邮箱授予编辑权限。

服务器环境变量示例：

```env
GOOGLE_DRIVE_FOLDER_ID=你的Drive文件夹ID
GOOGLE_SERVICE_ACCOUNT_EMAIL=xxxx@xxxx.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

### 优点

- 用户不需要登录 Google。
- Service Account 私钥只保存在服务器端，不暴露给用户。
- 可以统一校验必填信息、视频类型、文件大小和提交频率。
- 可以保存 metadata，例如姓名、机构、邮箱、国家、备注、上传时间、文件名等。
- 可以统一命名文件，便于后期整理。
- 适合公开收集资料、全球访问、长期运行。

### 缺点

- 需要维护服务器。
- 大视频上传时服务器带宽和磁盘临时空间会承压。
- 如果用户网络中断，普通上传通常需要重新上传。
- 后续如果视频很大或访问量很高，建议增加分片上传或断点续传。

### 适用情况

适合当前项目。尤其适合“不要求用户登录 Google，但要统一上传到指定 Google Drive”的场景。

## 方案二：用户登录自己的 Google 账号，前端直接上传到指定 Google Drive 文件夹

流程：

```text
用户浏览器 -> Google OAuth 登录 -> Google Drive API -> 指定 Google Drive 文件夹
```

### 理论上是否可行

可行，但必须满足一个前提：

用户登录后的 Google 账号必须对你的目标文件夹有写入权限。

Google Drive API 是按当前授权用户的身份操作的。也就是说，即使网页知道目标文件夹 ID，如果当前登录用户没有写入权限，也不能向该文件夹上传文件。

### 需要什么

- 配置 Google OAuth Client。
- 配置 OAuth consent screen。
- 前端接入 Google Identity Services 或 Google API Client。
- 用户登录自己的 Google 账号并授权。
- 目标文件夹必须对该用户有可写权限，或目标位置是 Shared Drive 并允许该用户写入。

### 优点

- 文件可以从用户浏览器直接传到 Google Drive，服务器压力小。
- 如果做得完整，可以绕过你服务器中转大文件。

### 缺点

- 用户必须有 Google 账号并完成登录授权。
- 用户体验更复杂，可能出现 OAuth 授权提示或未验证应用提示。
- 每个用户都必须有目标文件夹写入权限。
- 如果目标文件夹向所有人开放编辑，安全风险很高。
- 用户上传到你个人 Drive 共享文件夹时，文件所有权可能属于上传者，不一定属于你。
- 前端不能放 Service Account 私钥，也不能放任何可滥用的长期凭据。

### 适用情况

适合封闭协作场景，例如参与者都是已知 Google 用户，并且已经被授予目标文件夹或 Shared Drive 的写入权限。

不适合完全公开的全球上传入口。

## 方案三：把 Google Drive 文件夹设为“知道链接的人可编辑”

流程：

```text
用户获得 Google Drive 文件夹链接 -> 直接在 Google Drive 页面上传
```

或者网页中引导用户访问这个共享文件夹。

### 优点

- 实现最简单。
- 不需要开发上传后端。
- 不需要处理 Google Drive API。

### 缺点

- 风险最高。
- 用户可能看到文件夹中的其他内容。
- 用户可能上传无关文件。
- 用户可能修改、移动、删除内容，取决于权限设置。
- 很难统一收集姓名、机构、邮箱、国家等表单信息。
- 很难做上传前校验和上传后记录。
- 不适合公开网页长期开放。

### 适用情况

只适合小范围、可信参与者、临时收集文件的场景。

不建议用于全球公开访问。

## 方案四：使用 Google Workspace Shared Drive

Shared Drive 是 Google Workspace 的共享云端硬盘，通常由组织拥有内容，而不是由单个个人账号拥有。

可以和方案一或方案二结合：

```text
方案一：用户 -> 服务器 -> Shared Drive
方案二：用户登录 Google -> 前端直接上传 -> Shared Drive
```

### 优点

- 文件归组织管理，适合机构项目。
- 成员权限更清晰。
- 比个人 My Drive 共享文件夹更适合长期项目。
- 避免个人账号离职、权限变化或容量管理造成混乱。

### 缺点

- 通常需要 Google Workspace。
- 外部用户写入权限需要单独配置。
- 如果走前端 OAuth，用户仍然需要登录并具备写入权限。

### 适用情况

适合机构级、长期运行、需要多人管理视频资料的项目。
如果项目属于学校、学院或组织，优先考虑 Shared Drive。

## 方案五：先上传到 Google Cloud Storage，再同步到 Google Drive

流程：

```text
用户浏览器 -> Google Cloud Storage -> 后台任务 -> Google Drive
```

### 优点

- 更适合大文件、分片上传、断点续传。
- 全球上传稳定性更好。
- 可以用签名 URL 控制上传权限和有效期。
- 后台任务可以慢慢同步到 Google Drive，不要求网页请求一直保持。

### 缺点

- 架构更复杂。
- 需要额外的 Google Cloud Storage 成本。
- 需要写后台同步逻辑。
- 最终仍要处理 Google Drive API 配额和权限。

### 适用情况

适合视频很大、访问量较高、跨国网络不稳定、需要更强上传可靠性的正式生产系统。

## 为什么不能把 Service Account 私钥放在网页前端

网页前端代码会被用户浏览器下载。任何人都可以查看 HTML、JS 和网络请求。

如果把 Service Account 私钥放在前端，别人可以复制这份凭据，绕过你的网页直接调用 Google Drive API。后果包括：

- 向你的 Drive 大量上传垃圾文件。
- 消耗 API 配额。
- 占用 Drive 存储空间。
- 如果权限过大，可能修改或删除文件。
- 私钥泄露后必须立即撤销并重新生成。

因此，Service Account 私钥只能放在服务器端或受控的密钥管理服务中。

## 凭据类型区别

### Service Account

适合服务器端自动上传。

特点：

- 不需要用户登录 Google。
- 凭据保存在服务器。
- 需要把目标 Drive 文件夹共享给 Service Account 邮箱。
- 适合当前项目。

### OAuth Client

适合用户登录自己的 Google 账号后操作自己的权限范围。

特点：

- 用户需要登录 Google。
- API 操作以用户身份执行。
- 用户必须对目标文件夹有写入权限。
- 可能需要配置 OAuth consent screen 和应用验证。

### API Key

不适合上传 Google Drive 文件。

特点：

- 一般用于访问公开数据或识别项目。
- 不能替代用户授权或 Service Account 授权。
- 不能安全地完成写入用户 Drive 的操作。

## 当前项目推荐路线

建议采用：

```text
用户浏览器 -> Node/Express 服务器 -> Google Drive API -> 指定 Drive 文件夹
```

部署建议：

- 用云服务器或 VPS 长期运行 Node 服务。
- 用 Nginx 反向代理到 `127.0.0.1:3000`。
- 用 HTTPS 域名给全球用户访问。
- 用 Service Account 调用 Google Drive API。
- 目标文件夹只共享给 Service Account 和管理人员，不对公众开放编辑。

后续增强：

- 增加上传文件大小限制。
- 增加验证码或频率限制，防止恶意上传。
- 增加后台日志和失败重试。
- 对大视频增加分片上传或断点续传。
- 如果访问量变大，考虑 Google Cloud Storage 中转。

## 简要结论

如果目标是“全球用户无需 Google 登录，统一上传到指定 Google Drive”，推荐使用服务器端 Service Account 方案。

如果目标是“用户用自己的 Google 身份上传”，前端直传可以做，但用户必须拥有目标文件夹写入权限，且用户体验和权限管理更复杂。

如果只是临时、小范围收集文件，可以共享 Google Drive 文件夹让别人直接上传，但不建议用于长期公开网页。
