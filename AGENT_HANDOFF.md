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

## 当前阶段

AI 接手初始化与稳定基线完成 → 首页布局重构完成

---

## 已完成事项

- ✅ npm install 成功
- ✅ npm run build PASS
- ✅ npm run self-test PASS
- ✅ npm run preflight PASS
- ✅ 修复 preflight 误报
- ✅ 创建/更新 AGENT_HANDOFF.md
- ✅ 首页布局重构（删除 Hero，进入工作台模式）

---

## 首页布局重构 (v0.1.0 迭代)

### 背景

旧版首页问题：
- Hero 区域高度 760px，巨型标题 6.4rem 抢视觉
- 低频 Vault 功能占据主工作区右侧
- Quick Capture 需要滚动才能看到
- 用户打开网页先看宣传标题，而不是内容

### 重构目标

用户打开网页 → 立刻看到 Recent Clips → 立刻能新增内容

### 修改内容

**App.tsx**：
- 删除 `<section className="hero">` 巨型标题区域
- 精简 `<header className="topbar">` 为状态栏（v0.1.0 • Local First • No Backend）
- 重组 `.workspace` 为左右布局：左侧 Clips (70%) + 右侧 Sidebar (30%)
- Quick Capture 移入 Sidebar 顶部，输入框优先
- Vault 面板移入底部 `<details className="advanced__details">` 可折叠区域
- 删除 `<footer className="app-footer">`

**global.css**：
- 删除 `.hero` / `.hero h1` / `.hero__body` 样式
- 新增 `.topbar__brand` / `.topbar__icon` / `.topbar__version` / `.topbar__badge`
- 新增 `.workspace` 左右布局（minmax(0, 1fr) / minmax(300px, 0.38fr)）
- 新增 `.main-content` / `.clips-header` / `.sidebar`
- 新增 `.advanced__details` / `.advanced__summary` / `.advanced__content` / `.privacy-note`
- 清理 `.app-footer` 相关样式

### 验证命令

```bash
npm run build    # PASS
npm run self-test # PASS
npm run preflight # PASS
```

### 布局变化

**旧布局**：
```
┌────────────────────────────────────────┐
│ Hero 巨型标题 (760px)                   │
│ 左侧：标题+副标题  右侧：Vault面板    │
├────────────────────────────────────────┤
│ workspace: capture-dock + filter-panel   │
├────────────────────────────────────────┤
│ section#cards: floating-grid          │
├────────────────────────────────────────┤
│ advanced: JSON import/export        │
└────────────────────────────────────────┘
```

**新布局**：
```
┌────────────────────────────────────────┐
│ topbar 状态栏 (v0.1.0 • Local First)  │
├─────────────────────┬──────────────────┤
│ main-content(70%)  │ sidebar (30%)    │
│ Clips Cards        │ Quick Capture    │
│                   │ Search+Filters  │
├─────────────────────┴──────────────────┤
│ advanced details (collapsible)         │
│ Vault + JSON Import/Export            │
└────────────────────────────────────────┘
```

### 后续建议

1. 移动端响应式进一步优化 sidebar 折叠
2. 考虑为 Clips 卡片添加批量选中/操作功能
3. 动画微调：Sidebar 切换可更像 OS 面板���入

---

## preflight 修复记录

### 修复前（误报）

- preflight FAIL 1 项：`dist contains possible real API Key / Token / Cookie / Password`
- 原因：正则 `/password\s*[:=]/i` 匹配了 React bundle 中的 `type:"password"` UI 代码

### 修复内容（scripts/preflight.mjs）

**过滤项**：
- `type="password"`（UI 输入框属性）
- `placeholder` 属性
- `master_password` 功能字段
- `demo` 标记

**保留检测**：
- `sk-` 真实 API Key
- `ghp_` / `github_pat_` Token
- `Bearer` token
- `cookie=` 真实值
- `password:` / `secret:` 明文值

### 修复后验证

- 所有检查项 PASS

---

## 当前开发环境

| 组件 | 版本 |
|------|------|
| OS | Debian 11 |
| Node | v20.20.2 |
| npm | v11.13.0 |
| OpenCode | 1.14.39 |

---

## 下一轮接手必读

1. `AGENT_HANDOFF.md` - 本文档
2. `README.md` - 项目说明和运行方法
3. `package.json` - 项目配置和脚本
4. `scripts/run-self-test.mjs` - 自测脚本
5. `scripts/preflight.mjs` - 发布前检查脚本

---

## 下一阶段建议

1. **先启动网页预览**：`npm run dev` 或 `npm run preview`
2. **观察 UI 和交互**：检查核心功能是否正常
3. **进入慢修模式**：如有问题，按 `docs/SLOW_QUALITY_AGENT.md` 处理
4. **体验优化**：确认基础稳定后再做 UI/交互优化

---

## 禁止行为

- 不自动 push 代码到远程仓库
- 不自动 release 或发布版本
- 不修改 SSH、WARP、防火墙、系统网络配置
- 不引入后端、数据库、登录系统

---

## 相关文档

- `README.md` - 项目定位和功能说明
- `RELEASE_NOTES.md` - 版本发布记录
- `SECURITY.md` - 安全说明
- `docs/QUALITY_BAR.md` - 质量检查标准
- `docs/PROJECT_LEVELS.md` - 项目等级定义