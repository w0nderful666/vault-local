# Agent Handoff - vault-local

Local Clipboard Vault 项目的交接文档。

---

## 项目信息

| 字段 | 值 |
|------|-----|
| 项目名称 | vault-local / Local Clipboard Vault |
| 项目类型 | 轻量化 Local First 剪切板/文本片段管理工具 |
| 技术栈 | Vite + React + TypeScript |
| 当前版本 | v0.1.0 |
| 部署方式 | GitHub Pages |

---

## 核心功能

- Quick Capture：从剪贴板导入或手动粘贴保存
- Floating Cards：浮窗卡片式布局
- 自动标题/类型识别（Prompt、API Key、Token、Command、Note、Template、JSON、Markdown）
- Secure Vault：AES-GCM 加密（PBKDF2 key derivation）
- 导入/导出 JSON
- 深色模式、中英文切换

---

## 已读关键文件

| 文件 | 说明 |
|------|------|
| `README.md` | 项目定位、功能说明、运行方法 |
| `docs/QUALITY_BAR.md` | 质量检查标准（C 级） |
| `docs/PROJECT_LEVELS.md` | C/B/A 项目等级定义 |
| `scripts/preflight.mjs` | 发布前检查脚本 |
| `scripts/run-self-test.mjs` | 自测脚本 |

---

## 验证结果

| 命令 | 结果 | 说明 |
|------|------|------|
| `npm install` | PASS | 依赖安装成功 |
| `npm run build` | PASS | 构建成功 |
| `npm run self-test` | PASS | 自测通过 |
| `npm run preflight` | PASS | 发布前检查通过 |

---

## preflight 修复记录

### 修复前（误报）

- preflight FAIL 1 项：`dist contains possible real API Key / Token / Cookie / Password`
- 原因：正则 `/password\s*[:=]/i` 匹配了 React bundle 中的 `type:"password"` UI 代码

### 修复后

- 修改 `scripts/preflight.mjs` 的敏感信息检测规则：
  - 增强正则，支持 `github_pat_` Token
  - 过滤 `type="password"`（UI 输入框）
  - 过滤 `placeholder` 属性
  - 过滤 `master_password`（Vault 功能）
- 验证结果：所有检查项 PASS

---

## 禁止行为

- 不修改 SSH、WARP、防火墙、系统网络配置
- 不自动 push 代码到远程仓库
- 不自动 release 或发布版本
- 不引入后端、数据库、登录系统

---

## 默认行为

- 默认不自动 push
- 默认不自动 release
- 每次修改代码后需等待确认再提交

---

## 后续 Agent 接手

后续 Agent 接手时，应先读取：

1. `AGENT_HANDOFF.md` - 本文档
2. `README.md` - 项目说明

---

## 相关文档

- `README.md` - 项目定位和功能说明
- `RELEASE_NOTES.md` - 版本发布记录
- `SECURITY.md` - 安全说明
- `docs/QUALITY_BAR.md` - 质量检查标准