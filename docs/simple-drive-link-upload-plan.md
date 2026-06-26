# 最简 Drive 链接上传方案说明

更新时间：2026-06-26

本文说明一种更简单的视频收集方案：用户先在网页填写必要信息，网页记录信息后，再提供 Google Drive 上传链接，让用户自行进入 Drive 完成视频上传。同时，系统仍然保留用户信息，并尽量让用户信息与上传视频对应起来。

## 一、当前目标

当前希望尝试一个低成本、低开发复杂度的方案：

```text
用户访问网页
-> 填写必要信息
-> 提交信息
-> 网页提供 Google Drive 上传链接
-> 用户自行通过 Drive 链接上传视频
-> 系统保存用户信息，形成表单 / 数据库记录
```

这个方案的核心目标不是让网页直接接收视频，而是：

- 先把用户信息可靠记录下来。
- 再把用户引导到 Google Drive 上传。
- 尽量让每条用户信息和对应视频可以匹配。
- 降低服务器部署和 Google Drive API 后端上传的复杂度。

## 二、与完整后端上传方案的区别

完整后端上传方案是：

```text
用户浏览器
-> 你的服务器
-> Google Drive API
-> 指定 Drive 文件夹
```

最简 Drive 链接上传方案是：

```text
用户浏览器
-> 提交表单信息到 Google Sheet
-> 获取 Drive 上传链接
-> 用户自行进入 Google Drive 上传视频
```

主要变化：

- 视频不经过我们自己的服务器。
- 不需要部署 Node/Express 视频上传后端。
- 不需要在服务器保存 Service Account 私钥。
- 用户上传动作发生在 Google Drive 页面。
- 我们需要额外设计“用户信息”和“视频文件”的对应关系。

## 三、推荐架构

推荐使用：

```text
自定义前端网页
+ Google Apps Script Web App
+ Google Sheet
+ Google Drive 文件夹
```

具体流程：

```text
1. 用户打开网页。
2. 用户填写 name、organization、email、countries、others。
3. 用户点击“提交信息并获取上传链接”。
4. 前端把用户信息提交到 Google Apps Script Web App。
5. Apps Script 生成一个 Submission ID。
6. Apps Script 在 Google Drive 指定总文件夹下创建一个子文件夹。
7. Apps Script 把用户信息、Submission ID、子文件夹链接写入 Google Sheet。
8. Apps Script 把 Submission ID 和上传文件夹链接返回给网页。
9. 网页展示上传链接。
10. 用户点击链接进入 Google Drive 上传视频。
11. 用户上传完成后，可以回到网页点击“我已完成上传”。
12. Apps Script 更新 Google Sheet 中该记录的状态。
```

整体架构：

```text
用户网页
-> Google Apps Script
-> Google Sheet 保存表单记录
-> Google Drive 创建用户专属上传文件夹
-> 用户打开该文件夹上传视频
```

## 四、为什么建议每个用户创建单独子文件夹

不建议所有用户共用同一个上传文件夹。

如果所有人共用一个 Drive 文件夹：

- 很难判断哪个视频属于哪个用户。
- 用户可能看到其他用户上传的文件。
- 文件命名混乱后很难整理。
- 如果权限设置过宽，存在误删、移动、上传无关文件等风险。

更推荐：

```text
总文件夹
├── VID-20260626-0001_张三
├── VID-20260626-0002_Li-Ming
├── VID-20260626-0003_University-A
```

每个子文件夹对应 Google Sheet 中的一行记录：

```text
Submission ID
Name
Organization
Email
Countries
Others
Folder URL
Status
Submitted At
Completed At
```

这样即使用户上传多个视频，也能通过文件夹和表单记录对应起来。

## 五、Google Sheet 表结构建议

建议建立一个 Google Sheet，字段如下：

| 字段 | 含义 |
|---|---|
| submission_id | 系统生成的唯一提交编号 |
| submitted_at | 用户提交信息时间 |
| name | 姓名 |
| organization | 机构 / 组织 |
| email | 邮箱 |
| countries | 国家 / 地区 |
| others | 其他说明 |
| folder_id | 为该用户创建的 Drive 子文件夹 ID |
| folder_url | 用户上传视频的 Drive 子文件夹链接 |
| status | 状态，例如 pending_upload / user_confirmed / checked |
| completed_at | 用户点击“已完成上传”的时间 |
| file_count | 后续可选，扫描子文件夹得到文件数量 |
| notes | 管理员备注 |

状态建议：

```text
pending_upload      已提交信息，等待用户上传
user_confirmed      用户点击“我已完成上传”
checked             管理员已检查文件
invalid             无效记录或测试记录
```

## 六、网页交互建议

原网页可以从“直接上传视频”改成以下流程。

### 第一步：填写信息

保留必填项：

- 姓名
- 机构 / 组织
- 邮箱
- 国家 / 地区

可选项：

- 其他说明

按钮：

```text
提交信息并获取上传链接
```

### 第二步：显示上传链接

信息提交成功后，页面显示：

```text
提交编号：VID-20260626-0001
上传链接：打开 Google Drive 上传视频
```

同时可以提示用户：

```text
请在打开的 Google Drive 文件夹中上传一个或多个视频文件。
上传完成后，请返回本页面点击“我已完成上传”。
```

### 第三步：用户确认上传完成

提供按钮：

```text
我已完成上传
```

点击后，网页调用 Apps Script 更新 Google Sheet：

```text
status = user_confirmed
completed_at = 当前时间
```

## 七、权限设置

需要注意 Google Drive 文件夹权限。

### 方案 A：每个子文件夹设置为“知道链接的人可编辑”

优点：

- 用户不一定需要提前被添加为协作者。
- 操作简单。
- 适合试点。

缺点：

- 拿到链接的人可能上传无关文件。
- 如果权限允许，可能产生误操作风险。
- 用户是否需要登录 Google 取决于 Google Drive 当前共享和上传策略。

### 方案 B：要求用户登录 Google 并上传

优点：

- 上传者身份更清晰。
- Google Drive 会记录上传者账号。

缺点：

- 用户必须有 Google 账号。
- 用户体验更复杂。
- 全球用户可能因为账号、地区或网络问题上传失败。

### 方案 C：手动发送权限邀请

优点：

- 权限最可控。

缺点：

- 不适合公开网页和自动化流程。
- 管理成本高。

## 八、优点

这个最简方案的优点：

- 不需要购买或配置服务器。
- 不需要部署 Node/Express 后端。
- 不需要处理大视频上传到服务器的问题。
- 不需要后端保存 Service Account 私钥。
- Google Sheet 可以直接作为表单数据库。
- 实现速度快，适合先试点。
- 可以保留当前自定义网页的美观界面。

## 九、限制和风险

需要提前接受以下限制：

1. **网页无法强制确认用户真的上传了视频**

   因为上传发生在 Google Drive 页面，不在我们的网页里。  
   可以通过“我已完成上传”按钮或后台定时扫描文件夹来辅助确认。

2. **用户信息和视频的对应关系依赖文件夹设计**

   如果所有用户共用一个文件夹，对应关系会混乱。  
   所以建议每次提交自动创建独立子文件夹。

3. **Drive 文件夹权限需要谨慎设置**

   如果使用“知道链接的人可编辑”，链接泄露后可能被滥用。

4. **用户可能需要登录 Google**

   具体体验取决于 Google Drive 分享权限和用户环境。

5. **不能完全替代正式上传系统**

   如果后续要求强校验、自动验收、断点续传、大规模并发，仍然需要服务器或 Cloud Storage 架构。

## 十、成本情况

这个方案的直接成本很低。

可能成本包括：

```text
Google Drive / Google Workspace 存储空间
Google Apps Script 配额限制
自定义域名费用，可选
网页托管费用，可选
```

如果网页仍然放在 GitHub Pages 或其他静态托管平台，前端托管成本可以接近 0。

主要成本会变成：

```text
Google Drive 存储容量
```

## 十一、和 Google Form 的区别

Google Form 也可以收集信息，并把结果保存到 Google Sheet。它还支持文件上传题。

但 Google Form 的限制包括：

- 文件上传通常要求用户登录 Google。
- 文件上传题有文件数量、大小等设置限制。
- 页面样式较难完全自定义。
- 不如当前自定义网页美观。
- 对“视频数量不限”的支持不如 Drive 文件夹灵活。

因此：

```text
如果只要最快收集：Google Form 可以考虑。
如果要保持自定义网页体验：自定义网页 + Apps Script 更合适。
```

## 十二、推荐实施步骤

第一步：准备 Google Sheet

```text
创建一个 Google Sheet
设置表头字段
记录 spreadsheet_id
```

第二步：准备 Google Drive 总文件夹

```text
创建一个总文件夹
记录 root_folder_id
```

第三步：编写 Apps Script

功能包括：

- 接收用户表单信息。
- 校验必填字段。
- 生成 Submission ID。
- 在总文件夹下创建子文件夹。
- 设置子文件夹共享权限。
- 写入 Google Sheet。
- 返回子文件夹上传链接。
- 接收“我已完成上传”请求并更新状态。

第四步：修改网页

把当前“直接选择视频上传”的流程改成：

```text
提交信息
-> 获取上传链接
-> 打开 Drive 上传
-> 点击确认完成
```

第五步：小范围测试

测试内容：

- 用户信息是否成功写入 Google Sheet。
- 是否自动创建子文件夹。
- 用户是否能通过链接上传视频。
- 上传完成后状态是否更新。
- 管理员是否能根据 Sheet 快速找到对应视频。

## 十三、推荐结论

对于当前试点阶段，推荐使用：

```text
自定义网页
+ Google Apps Script
+ Google Sheet
+ Google Drive 每人一个子文件夹
```

这是最简单、成本最低、实现速度最快的方案。  
它适合先验证流程、收集少量或中等数量视频。  
如果后续需要更严格的上传控制、大文件断点续传、自动文件校验，再升级到服务器后端或 Cloud Storage 中转方案。
