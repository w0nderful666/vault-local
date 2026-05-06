# Agent Handoff - vault-local

Local Clipboard Vault 项目的交接文档。

---

## 项目信息

| 字段 | 值 |
|------|-----|
| 项目名称 | vault-local / Local Clipboard Vault |
| 项目类型 | 轻量化 Local First 剪切板/文本片段管理工具 |
| 技术栈 | Vite + React + TypeScript |
| 当前版本 | v0.6.0 |
| 部署方式 | GitHub Pages |

---

## 当前阶段

OS Navigation 完成 → OS Window System Fix 完成

---

## 已完成事项

- ✅ npm install 成功
- ✅ npm run build PASS
- ✅ npm run self-test PASS
- ✅ npm run preflight PASS
- ✅ 修复 preflight 误报
- ✅ 创建/更新 AGENT_HANDOFF.md
- ✅ 首页布局重构（删除 Hero，进入工作台模式）
- ✅ OS Workbench 布局重构（v0.2.0）
- ✅ OS Floating Workbench 重构（v0.3.0）
- ✅ OS Card Proportions 重构（v0.3.1）
- ✅ OS Workspace 重构（v0.4.0）
- ✅ OS Navigation 重构（v0.5.0）
- ✅ OS Window System Fix（v0.6.0）

---

## OS Window System Fix (v0.6.0)

### 目标

修复 Window Layer bug，建立统一的 OS Window System

### 修改内容

**版本升级**：v0.5.0 → v0.6.0

**App.tsx**：
- 点击卡片改为直接复制（copyClip），不再打开编辑
- 新增 copied toast 通知
- Edit 按钮变为 secondary action

**global.css**：
- Modal z-index 设为 100（正确层级）
- Modal 使用 position: fixed 全屏覆盖
- 新增 modal-fade-in 和 modal-scale-in 动画
- Dock 图标：32px → 40px
- Dock hover 效果增强

### 验证命令

```bash
npm run build    # PASS
npm run self-test # PASS
npm run preflight # PASS
```

### OS Window Layer 规则

1. **z-index 层级**：
   - Dock: 30
   - Modal: 100
   - Toast: 110

2. **点击复制逻辑**：点击卡片区域直接复制，而非打开编辑
3. **Edit 按钮**：明确为 secondary action

---

---

## OS Navigation 重构 (v0.5.0)

### 目标

新增底部 Dock 系统，作为整个 OS Workspace 的核心导航层

### 修改内容

**版本升级**：v0.4.0 → v0.5.0

**App.tsx**：
- 新增 dockFilter 状态（ClipType | "All"）
- 新增 settingsOpen 状态
- 新增 Dock UI（底部固定漂浮窗口）
- Dock 包含：All, 各类型图标（限制6个）
- Dock 最右侧：Settings 按钮
- 新增 Settings Modal（Appearance, Language）

**global.css**：
- .dock: 固定底部居中，半透明玻璃效果 blur(20px)
- .dock__item: 32px 圆形图标按钮
- .dock__settings: 设置按钮
- .settings-panel: 设置面板布局
- .settings__section: 设置分组

### 验证命令

```bash
npm run build    # PASS
npm run self-test # PASS
npm run preflight # PASS
```

### OS Dock 规则

1. **漂浮 Dock**：position fixed, bottom 16px, blur 玻璃效果
2. **分类切换**：Dock 点击切换 workspace 内容类型
3. **Settings**：最右侧入口，打开 OS Preferences 面板
4. **语言**：Settings 中可直接切换中/英文
5. **Theme**：Settings 中可直接切换 Light/Dark

---

---

## OS Workspace 重构 (v0.4.0)

### 目标

彻底移除网页 section/dashboard/blog layout 感，统一成 OS Workspace Window System

### 修改内容

**版本升级**：v0.3.1 → v0.4.0

**App.tsx**：
- 移除 `<section className="workspace">` 改为 `<div>`
- 移除 clips-header 区块（"Recent clips", "8 / 8" 标题）
- 移除 Quick Capture 的 eyebrow 标签

**global.css**：
- main: 移除 max-width/ margin auto，100% 全宽
- workspace: sidebar 280 → 260px
- main-content: padding 16 → 12px
- 移除所有 .eyebrow 样式（显示 none）
- clips-header 设为 display none

### 验证命令

```bash
npm run build    # PASS
npm run self-test # PASS
npm run preflight # PASS
```

### OS Workspace 规则

1. **无 container 感**：workspace 直接 100% 宽度，无居中限制
2. **无标题区**：移除 "Recent clips", "Quick Capture" 等网页标题
3. **所有区域统一窗口化**：Clips / Quick Capture / Search / Filter 统一 OS Window 风格
4. **无 dashboard 感**：像多个漂浮窗口组成 workspace，而非网页栏目

---

---

## OS Card Proportions 重构 (v0.3.1)

### 目标

统一空间比例、卡片比例、工具栏逻辑，建立真正的 OS Card 基础层

### 修改内容

**版本升级**：v0.3.0 → v0.3.1

**App.tsx**：
- Copy 按钮突出为 primary variant
- 按钮 icon size: 12 → 11

**global.css**：
- 工作区：sidebar 320 → 280px，更紧凑
- padding：20 → 16px，减少空白
- 卡片：200px min → 180px min，更紧凑
- 卡片 min-height：120px → 90px
- 卡片 padding：10-12px → 8-10px
- 卡片标题：0.85rem → 0.8rem
- 卡片 actions gap：8px → 4px，工具栏更紧凑
- 卡片 summary：min-height 68px → 32px，限制为 2 行
- 窗口按钮 bar：7px → 6px

### 验证命令

```bash
npm run build    # PASS
npm run self-test # PASS
npm run preflight # PASS
```

---

## OS Floating Workbench 重构 (v0.3.0)

### 目标

更像真正的 OS 内容工作台，而非网页 dashboard

### 修改内容

**版本升级**：v0.2.0 → v0.3.0

**package.json**：
- version: "0.3.0"

**App.tsx**：
- 卡片按钮改为 icon-only + title tooltip
- 按钮 size 13 → 12

**global.css**：
- 移除内部滚动条，改为页面级滚动
- topbar 高度 56 → 48px，更紧凑
- sidebar 宽度 320 → 300px
- 卡片更小（200px min），悬浮感更强
- Modal 添加 OS 风格 scale/fade 动画
- sidebar 改为左侧 border，右侧 sidebar 布局

### 验证命令

```bash
npm run build    # PASS
npm run self-test # PASS
npm run preflight # PASS
```

---

## OS Workbench 布局重构 (v0.2.0)

### 目标

用户打开网页 → 立刻看到内容 → 立刻能操作
更像真正的 OS 内容工作台而非 landing page

### 修改内容

**版本升级**：v0.1.0 → v0.2.0

**package.json**：
- version: "0.2.0"

**src/config/siteMeta.ts**：
- version: "0.2.0"

**App.tsx**：
- 精简 main-content 为紧凑内容区
- Sidebar 分为多个 sidebar__section 区块
- 卡片按钮 icon size: 15 → 13
- Quick Capture 更紧凑

**global.css**：
- workspace: 固定 1fr 320px 布局
- main-content: 紧凑 padding 16px，100vh 布局
- sidebar: 固定宽度 320px，分区布局
- sidebar__section: 独立 padding/border 区
- 卡片: 220px min，更小尺寸，gradient hover bar
- chip/button: 更小尺寸更紧凑

### 验证命令

```bash
npm run build    # PASS
npm run self-test # PASS
npm run preflight # PASS
```

### 布局变化

**v0.2.0 布局**：
```
┌────────────────────────────────────────────┐
│ topbar: v0.2.0 • Local First            │
├──────────────────┬───────────────────────┤
│ Content Area    │ Sidebar (320px)       │
│ - Clips Header │ - Quick Capture     │
│ - Cards Grid   │ - Search           │
│               │ - Type Filters     │
│               │ - Tag Filter       │
│               │ - Actions         │
├──────────────────┴───────────────────────┤
│ Advanced (collapsible)                │
└────────────────────────────────────────────┘
```

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

## 长期规则：版本升级时必须同步测试脚本

### 问题根因

本次 v0.1.0 → v0.2.0 版本升级时，`scripts/run-self-test.mjs` 和 `scripts/preflight.mjs` 中硬编码了版本号检测。

导致：
- self-test FAIL: `package.json version is 0.1.0` 检测失败
- preflight FAIL: `RELEASE_NOTES v0.1.0 exists` 检测失败

### 为什么会出现这个问题

1. 测试脚本使用了硬编码版本号（如 `"0.1.0"`）
2. 每次发版需要手动同步更新测试脚本
3. 没有自动检测当前 package.json version 的机制

### 后续应该如何避免

**方案 A**：测试脚本改为动态读取 package.json version
```javascript
import { readFile } from "node:fs/promises";
const pkg = JSON.parse(await readFile("package.json", "utf8"));
const currentVersion = pkg.version;
```

**方案 B**：版本检测改为向后兼容检测
- 检测 RELEASE_NOTES.md 包含任何 v0.x.0 版本
- 而不是精确匹配某个版本

### 应形成的长期规则

1. 任何版本升级（如 v0.1.0 → v0.2.0）必须：
   - 同步更新 `scripts/run-self-test.mjs` 版本检测
   - 同步更新 `scripts/preflight.mjs` 版本检测
   - 同步更新 `RELEASE_NOTES.md`
   - 同步更新 `AGENT_HANDOFF.md` 当前版本

2. 或者：重构测试脚本为动态版本检测（推荐后续优化）

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