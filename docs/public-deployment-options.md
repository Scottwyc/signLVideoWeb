# 视频上传平台公网部署方案与成本比较

更新时间：2026-06-26

本文针对当前“视频上传平台”的实际需求，比较几种可行的公网部署方案，包括 Google Cloud VM、海外 VPS、Cloud Run、Google Cloud Storage 中转、魔搭创空间、GitHub Pages 等。重点不是泛泛讨论网页托管，而是判断这些方案是否适合“全球用户上传视频到指定 Google Drive”。

## 一、当前项目需求要点

当前网站不是普通静态网页，而是一个带后端的视频收集系统。

已有项目结构：

```text
public/       前端页面、样式、脚本
server.js     Node/Express 后端
/api/upload   视频上传接口
Google Drive API Service Account 凭据
```

完整业务流程：

```text
全球用户浏览器
-> 访问网页
-> 填写姓名、机构、邮箱、国家/地区、其他说明
-> 上传一个或多个视频
-> Node/Express 后端接收文件
-> 后端调用 Google Drive API
-> 视频进入指定 Google Drive 文件夹
```

这个项目的关键要求包括：

1. **全球可访问**
   用户来自不同国家和地区，网页需要有公网地址，最好支持 HTTPS。

2. **需要后端服务**
   Google Drive 的 Service Account 私钥不能放在前端网页里，必须保存在服务器端。因此不能只部署静态网页。

3. **需要支持大文件上传**
   视频文件可能比较大，上传时间可能较长，服务器需要能处理较大的 multipart 请求和较长连接。

4. **后端必须能稳定访问 Google API**
   后端需要访问 `googleapis.com`、`drive.google.com`、`oauth2.googleapis.com` 等服务。

5. **需要保护密钥**
   `.env`、Service Account `private_key`、Google Drive 文件夹权限等必须只保存在服务器或受控密钥系统中。

6. **需要成本可控**
   成本主要来自服务器、磁盘、公网 IP、网络流量和 Google Drive/Workspace 存储空间。

7. **最好便于后续升级**
   后续可能增加验证码、限流、日志、断点续传、Cloud Storage 中转等能力。

## 二、成本主要来自哪里

这个项目的成本不是网页本身，而是视频上传链路。

主要成本项：

```text
服务器 / 容器运行费用
磁盘费用
公网 IP 费用
网络流量费用
Google Drive / Google Workspace 存储容量
后续可能的 Cloud Storage 费用
```

需要特别注意：

- 用户上传到服务器通常是入站流量，很多云平台入站流量收费较低或免费。
- 服务器再把视频传到 Google Drive，可能产生出站网络费用，具体取决于云平台和区域。
- 如果视频量很大，Google Drive 存储容量本身也会成为成本。
- 访问网页的流量很小，不是主要成本。

官方价格参考：

- Google Compute Engine 价格：https://cloud.google.com/products/compute/pricing
- Google Cloud 网络价格：https://cloud.google.com/vpc/network-pricing
- Google Cloud Run 价格：https://cloud.google.com/run/pricing
- Google Cloud Storage 价格：https://cloud.google.com/storage/pricing
- Google Cloud 价格计算器：https://cloud.google.com/products/calculator

## 三、方案一：Google Cloud VM

推荐程度：高

架构：

```text
全球用户
-> Google Cloud VM 公网地址 / 域名
-> Nginx
-> Node/Express server.js
-> Google Drive API
-> 指定 Google Drive 文件夹
```

### 适合当前项目的原因

Google Cloud VM 是当前项目最匹配的方案之一：

- 可以长期运行 Node/Express 后端。
- 前端和后端可以放在同一个服务里，少处理跨域问题。
- Service Account 私钥可以安全放在服务器 `.env`。
- VM 位于 Google Cloud，访问 Google Drive API 通常更稳定。
- 对大视频上传、超时、磁盘、日志、Nginx 配置都比较可控。
- 后续可以平滑增加域名、HTTPS、限流、监控和自动部署。

### 推荐起步配置

测试或小规模试用：

```text
机器：e2-small
磁盘：30GB 标准磁盘
系统：Ubuntu LTS
服务：Node.js + PM2 + Nginx
```

更稳妥的正式试用：

```text
机器：e2-medium
磁盘：30GB-50GB
系统：Ubuntu LTS
服务：Node.js + PM2 + Nginx + HTTPS
```

### 费用估算

粗略月成本：

| 配置 | 适用阶段 | 估算月成本 |
|---|---|---:|
| e2-micro | 仅功能测试 | 约 `$0-$10+`，取决于免费层和区域 |
| e2-small | 小规模试用 | 约 `$15-$30+` |
| e2-medium | 推荐正式试用 | 约 `$30-$50+` |
| 更高配置 | 多人并发、大视频 | `$50+` 起 |

额外成本：

```text
磁盘：几十 GB 通常每月几美元以内
公网 IPv4：可能每月约几美元，具体看 Google Cloud 当前价格
网络出站：按实际视频传输量计算
Google Drive 存储：按你的 Drive / Workspace 套餐计算
```

Google Cloud 新用户通常有试用额度，可先用小配置测试完整流程。

### 优点

- 当前项目最稳妥。
- 部署架构简单清晰。
- 适合大视频上传。
- 密钥安全性好。
- Google API 可达性较好。
- 后续扩展空间大。

### 缺点

- 需要维护服务器。
- 需要配置 Nginx、HTTPS、防火墙、PM2。
- 需要关注账单、出站流量和磁盘空间。

### 结论

如果你希望先正式跑通这个网站，Google Cloud VM 是优先推荐方案。

## 四、方案二：海外 VPS

推荐程度：高

可选平台包括 DigitalOcean、AWS Lightsail、Vultr、Linode、Hetzner 等。

架构：

```text
全球用户
-> 海外 VPS 公网 IP / 域名
-> Nginx
-> Node/Express
-> Google Drive API
```

### 适合当前项目的原因

海外 VPS 和 Google Cloud VM 类似，都是完整服务器，可以运行当前 Node/Express 项目。

### 费用估算

粗略月成本：

| 配置 | 适用阶段 | 估算月成本 |
|---|---|---:|
| 1 vCPU / 1GB | 功能测试 | `$5-$10` |
| 1-2 vCPU / 2GB | 小规模试用 | `$10-$20` |
| 2 vCPU / 4GB | 更稳妥 | `$20-$40` |

不少 VPS 套餐会包含一定出站流量，费用比 Google Cloud VM 更容易预估。

### 优点

- 固定月费直观。
- 部署 Node/Express 简单。
- 适合长期运行。
- 可用 Nginx、PM2、HTTPS。

### 缺点

- 需要测试该 VPS 区域访问 Google API 的稳定性。
- 便宜 VPS 性能和网络质量波动可能更大。
- 服务器维护仍由自己负责。

### 结论

如果你更关注固定月费，海外 VPS 是很好的选择。  
如果你更关注 Google API 可达性和 Google 生态一致性，Google Cloud VM 更自然。

## 五、方案三：Google Cloud Run

推荐程度：中

架构：

```text
全球用户
-> Cloud Run HTTPS URL
-> 容器化 Node/Express 服务
-> Google Drive API
```

### 适合的地方

- 自动 HTTPS。
- 自动扩缩容。
- 不用维护 VM 系统。
- 可以配合 Secret Manager 保存密钥。
- 低流量时可能成本较低。

### 当前项目的主要问题

Cloud Run 更适合短请求 API，不是最适合“用户直接长时间上传大视频到 Express”的初版架构。

需要注意：

- Cloud Run 请求默认超时 5 分钟，官方文档说明最多可配置到 60 分钟。
- 大视频和慢网络用户可能超过请求时间。
- 上传请求占用实例处理时间，费用和稳定性都需要测试。
- 如果文件很大，最好把架构改成 Cloud Storage 直传，而不是直接传到 Cloud Run。

官方文档：

- Cloud Run 请求超时：https://docs.cloud.google.com/run/docs/configuring/request-timeout
- Cloud Run 价格：https://cloud.google.com/run/pricing

### 费用估算

低流量、小文件：

```text
可能每月几美元到十几美元
```

视频较大、上传耗时长：

```text
费用不一定比 VM 低，且稳定性需要额外验证
```

### 优点

- 运维负担小。
- 自动 HTTPS。
- 和 Google Cloud 生态集成好。

### 缺点

- 大视频上传不如 VM 直观稳定。
- 有请求超时限制。
- 需要容器化部署。
- 可能需要改造上传逻辑。

### 结论

Cloud Run 可以试，但不建议作为当前初版的首选。  
如果后续改成 Cloud Storage 直传，Cloud Run 会更适合做后台处理服务。

## 六、方案四：Google Cloud Storage 中转

推荐程度：中高，但适合第二阶段

架构：

```text
用户浏览器
-> Google Cloud Storage
-> 后台任务 / VM / Cloud Run
-> Google Drive
```

### 适合的地方

这是更专业的大文件上传架构。

优势：

- 更适合大视频。
- 可以做签名 URL。
- 可以做断点续传、分片上传、失败重试。
- 用户上传不必一直占用 Node 后端请求。
- 后台可以异步同步到 Google Drive。

### 费用估算

成本构成：

```text
Cloud Storage 存储费
Cloud Storage 请求费
后台服务费
可能的网络流量费
Google Drive / Workspace 存储费
```

粗略估算：

| 使用规模 | 估算月成本 |
|---|---:|
| 小规模测试 | `$10-$30+` |
| 正式收集较多视频 | `$30-$100+` |
| 大规模活动 | 需要按视频量计算 |

### 优点

- 技术上更适合全球大文件上传。
- 可扩展性好。
- 失败恢复能力更强。

### 缺点

- 架构复杂度明显提高。
- 需要额外开发上传签名、回调、后台同步、清理任务。
- 需要同时管理 Cloud Storage 和 Google Drive。

### 结论

不建议第一版就做。  
当视频文件很大、用户很多、上传失败率变高时，再升级到这个方案。

## 七、方案五：魔搭创空间 / ModelScope Space

推荐程度：低到中，适合测试

架构：

```text
全球用户
-> 魔搭创空间 URL
-> 创空间中的应用服务
-> Google Drive API
```

### 可能的优点

- 可以使用平台提供的 URL。
- 不一定需要买域名。
- 适合快速演示。
- 如果支持 Docker，可以尝试运行自定义 Node/Express 服务。

### 关键风险

当前项目后端必须稳定访问 Google API：

```text
googleapis.com
drive.google.com
oauth2.googleapis.com
```

如果创空间运行环境访问 Google API 不稳定，那么网页能打开也没有用，上传仍然会失败。

还需要确认：

- 是否支持 Node/Express 或 Docker。
- 是否支持较大视频上传。
- 是否支持长期运行。
- 是否支持环境变量或密钥。
- 是否有休眠、磁盘、请求大小、运行时长限制。

### 费用估算

费用取决于平台当前政策、资源规格和是否使用付费算力。  
由于它不是专门为大文件上传后端设计，成本不是唯一问题，稳定性和 Google API 可达性更重要。

### 结论

可以用于演示或小范围测试。  
不建议作为全球长期上传到 Google Drive 的正式方案。

## 八、方案六：GitHub Pages + 独立后端

推荐程度：低到中

架构：

```text
全球用户
-> GitHub Pages 前端
-> 独立后端服务器 /api/upload
-> Google Drive API
```

### 需要说明

GitHub Pages 只能托管静态页面：

```text
HTML
CSS
JavaScript
图片
```

它不能运行：

```text
server.js
/api/upload
Google Drive API 私钥
视频接收服务
```

所以 GitHub Pages 只能放前端，后端仍然要部署在 VM、VPS、Cloud Run 或其他平台。

### 费用估算

```text
GitHub Pages：通常免费
后端服务器：仍按 VM / VPS / Cloud Run 计费
```

### 优点

- 前端托管免费。
- 代码版本管理方便。

### 缺点

- 仍然需要独立后端。
- 要处理 CORS。
- 前端 API 地址要单独配置。
- 架构比“同一台服务器托管前后端”更复杂。

### 结论

GitHub 更适合作为代码仓库和自动部署工具。  
当前项目没必要优先采用 GitHub Pages 前后端分离。

## 九、是否需要购买域名

不一定。

可以先用：

```text
Google Cloud VM 公网 IP
VPS 公网 IP
Cloud Run 默认 HTTPS URL
魔搭创空间 URL
```

正式开放时再买域名。

域名的价值：

- 链接更正式。
- 用户更容易记住。
- 后续迁移服务器时，可以保持访问地址不变。
- 更适合正式活动和对外发布。

建议：

```text
测试阶段：不买域名
小范围试用：可以不买域名
正式长期开放：建议买域名
```

## 十、综合比较

| 方案 | 是否适合当前项目 | 成本可控性 | 大视频稳定性 | Google API 可达性 | 运维复杂度 | 推荐阶段 |
|---|---:|---:|---:|---:|---:|---|
| Google Cloud VM | 高 | 中 | 高 | 高 | 中 | 第一阶段首选 |
| 海外 VPS | 高 | 高 | 高 | 中到高 | 中 | 第一阶段可选 |
| Cloud Run | 中 | 中 | 中到低 | 高 | 低到中 | 小文件或改造后 |
| Cloud Storage 中转 | 高 | 中 | 很高 | 高 | 高 | 第二阶段升级 |
| 魔搭创空间 | 低到中 | 不确定 | 不确定 | 不确定 | 低到中 | 演示测试 |
| GitHub Pages + 后端 | 中 | 中 | 取决于后端 | 取决于后端 | 中 | 非首选 |

## 十一、推荐实施路线

### 第一阶段：跑通正式可用版本

推荐：

```text
Google Cloud VM
-> Ubuntu LTS
-> Node.js
-> PM2
-> Nginx
-> HTTPS
-> Service Account
-> Google Drive 文件夹
```

预算建议：

```text
测试：e2-small，约 $15-$30+/月
正式试用：e2-medium，约 $30-$50+/月
```

如果担心费用：

- 先用 Google Cloud 新用户试用额度。
- 设置 Billing Budget。
- 先限制上传文件大小。
- 先小范围测试。

### 第二阶段：正式开放

增加：

```text
域名
HTTPS
上传大小限制
上传频率限制
验证码
服务器日志
错误告警
Google Drive 存储容量监控
```

### 第三阶段：提升大文件可靠性

当出现以下情况时升级：

- 视频经常超过几 GB。
- 全球用户网络不稳定。
- 上传失败率较高。
- 同时上传人数增加。

升级方向：

```text
用户浏览器 -> Google Cloud Storage -> 后台同步 -> Google Drive
```

## 十二、最终建议

当前最合理的方案是：

```text
Google Cloud VM 部署完整 Node/Express 服务
```

原因：

- 符合当前代码结构。
- 可以安全保存 Google Drive 私钥。
- 支持前端和后端同源部署。
- 对视频上传比 serverless 更可控。
- 后端访问 Google API 更稳定。
- 成本在测试阶段可控制在每月几十美元量级。

如果希望费用更固定，可以考虑海外 VPS。  
如果后续视频量变大，再升级到 Google Cloud Storage 中转。  
GitHub 可以作为代码仓库和自动部署工具，但不是当前项目的核心运行平台。
