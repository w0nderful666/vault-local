# Agent Handoff - vault-local

Local Clipboard Vault 项目的交接文档。

---

## 项目信息

| 字段 | 值 |
|------|-----|
| 项目名称 | vault-local / Local Clipboard Vault |
| 项目类型 | 轻量化 Local First 剪切板/文本片段管理工具 |
| 技术栈 | Vite + React + TypeScript |
| 当前版本 | v0.8.0 |
| 部署方式 | GitHub Pages |

---

## 当前阶段

OS Window System Polish 完成 → Cinematic Background & Theme System 完成

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
- ✅ OS Window System Polish（v0.7.0）
- ✅ OS Motion System（v0.8.0）
- ✅ OS Focus & Depth System（v0.9.0）
- ✅ Cinematic Background & Theme System（v0.10.0）

---

## Cinematic Background & Theme System (v0.10.0)

### 目标

建立 Cinematic Background Layer System，让 workspace 具有"空间层"感，而非平面背景。

### 修改内容

**版本升级**：v0.9.0 → v0.10.0

**global.css**：
- 新增 Background Layer System：--glow-center, --vignette-opacity, --ambient-intensity
- 新增 body::before：center ambient glow (radial-gradient)
- 新增 body::after：edge vignette (radial-gradient)
- 新增 .app-shell：背景层容器
- Theme 切换：400ms smooth transition
- Light theme：subtle center glow
- Dark theme：stronger vignette (0.4 opacity)

**docs/STYLE_FINGERPRINT.md**：
- 新增 Background Layer System 文档
- 新增 Light Composition 文档

### 版本同步规则

**必须同步的文件**（每次 version bump）：
1. package.json version
2. src/config/siteMeta.ts version
3. RELEASE_NOTES.md
4. scripts/run-self-test.mjs（版本检测）
5. scripts/preflight.mjs（版本检测）
6. AGENT_HANDOFF.md（当前版本 + 完成事项）

### 验证命令

### 目标

建立 OS Focus Flow System 和 Depth Hierarchy System，让 workspace 具有焦点流动和深度层级感。

### 修改内容

**版本升级**：v0.8.0 → v0.9.0

**global.css**：
- 新增 Depth Layer System tokens：--depth-bg, --depth-card, --depth-focus, --depth-floating, --depth-overlay, --depth-modal
- 新增 Shadow Depth tokens：--shadow-depth-0/1/2/3, --shadow-focus
- 新增 Motion Density tokens：--stagger-base, --stagger-max, --motion-density
- 新增 Focus Energy token：--focus-energy
- Card hover: focus ring + depth shadow（能量聚焦，非花哨 glow）
- Card lift: -3px → -2px（更克制）
- Card shadow: 使用 --shadow-depth-1/2
- Dock item hover: shadow depth 空气感
- Dock item active: focus ring 能量聚焦
- 移除 backdrop-filter blur（避免过重）
- clip-card--entering stagger: 使用 --stagger-delay CSS custom property

**docs/STYLE_FINGERPRINT.md**：
- 新增 Depth Layer System 文档
- 新增 Shadow Tokens 文档

### 验证命令

### 目标

建立统一的 OS Motion Language，消除 interaction state 导致的 layout shift

### 修改内容

**版本升级**：v0.7.0 → v0.8.0

**global.css**：
- 新增 Motion Tokens (CSS variables)
  - --duration-instant, --duration-fastest, --duration-fast, --duration-normal, --duration-slow, --duration-slowest
  - --easing-standard, --easing-standard-rev, --easing-window, --easing-overlay, --easing-emphasized
- 新增 Button CSS 样式（之前缺失）
- 新增 Toast CSS 动画样式
- 更新所有组件 transition 使用 motion tokens

**修改的组件**：
- Card hover: 只用 transform，不改变布局
- Dock interaction: 使用统一的 motion tokens
- Modal open: 更精细的 scale 动画
- Chip, Settings, Edit form: 统一 transition

### 验证命令

```bash
npm run build    # PASS
npm run self-test # PASS
npm run preflight # PASS
```

### OS Motion System 规则

1. **No Layout Shift**：任何 interaction state (hover, active, focus, copied) 都不能改变 typography, card sizing, grid alignment

2. **统一 Motion Tokens**：
   - Duration: instant(0ms), fastest(80ms), fast(120ms), normal(180ms), slow(240ms), slowest(320ms)
   - Easing: standard, standard-rev, window, overlay, emphasized

3. **动画原则**：
   - 轻 (lightweight)
   - 稳 (smooth, no bounce/elastic)
   - 短 (fast durations)
   - 统一 (same tokens across all components)

4. **性能优先**：
   - 使用 transform 和 opacity
   - 避免 layout thrashing

---

## OS Window System Polish (v0.7.0)

### 目标

统一 OS Window Design System，将 Edit/Settings/Advanced 升级为真正的 OS 浮动窗口风格

### 修改内容

**版本升级**：v0.6.0 → v0.7.0

**App.tsx**：
- Edit Window：新增 OS Window 结构（window chrome, header, content, footer）
- Settings Window：改为 sidebar + content 布局（macOS Preferences 风格）
- Advanced Tools：移除页面底部 section，合并进入 Settings 的 Advanced tab
- 新增 settingsTab state（appearance | workspace | advanced）

**global.css**：
- 新增全局 overflow 保护：`* { max-width: 100% }`, `overflow-wrap: break-word`
- 新增 OS Window Design System：`.window`, `.window__header`, `.window__chrome`, `.window__toolbar`, `.window__content`, `.window__footer`
- 新增 `.window--preferences`：sidebar + main 两栏布局
- 新增 `.edit-form` 样式：group, label, input, textarea, select, flags, note
- 新增 `.settings__option`：button 样式的选项（替代 radio/checkbox）
- 更新 `.modal__panel--window` 和 `.modal__body--window`

**Modal.tsx**：
- 新增检测逻辑：如果 children 包含 `.window` class，则隐藏默认 header

### 验证命令

```bash
npm run build    # PASS
npm run self-test # PASS
npm run preflight # PASS
```

### OS Window Design System 规则

1. **统一 Window 结构**：
   - `.window`: 根容器，flex column
   - `.window__header`: 顶部，包含 chrome + title
   - `.window__chrome`: 交通灯按钮 (红/黄/绿)
   - `.window__content`: 内容区域，可滚动
   - `.window__footer`: 底部操作栏

2. **Preferences 布局**：
   - `.window--preferences`: grid 两栏 (160px sidebar + 1fr content)
   - sidebar 包含分类按钮，带 icon
   - content 包含该分类的设置项

3. **Overflow 安全**：
   - 全局 `* { max-width: 100% }`
   - `input/textarea { min-width: 0; max-width: 100% }`
   - `p/h1-h6 { overflow-wrap: break-word; word-break: break-word }`

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

---

## 长期规则：版本升级同步

### 问题根因

每次版本升级（如 v0.1.0 → v0.2.0），测试脚本中的版本检测未同步。

### 为什么会出现这个问题

1. 测试脚本使用硬编码版本号（如 `"0.1.0"`）
2. 每次发版需要手动同步更新多个文件

### 应形成的长期规则

**版本升级必须同步更新**：
- `package.json` version
- `src/config/siteMeta.ts` version
- `scripts/run-self-test.mjs` 版本检测
- `scripts/preflight.mjs` 版本检测
- `RELEASE_NOTES.md`
- `AGENT_HANDOFF.md` 当前版本

### 版本号命名规范（遵循 semver）

- **patch**（修复）：v0.x.0 → v0.x.1
- **minor**（功能）：v0.x.0 → v0.x+1.0
- **major**（重构）：v0.x.0 → v0.x+1.0（重大 UI 变化）

---

## 长期规则：OS Window System

### 项目演进方向

项目目标是建立一个"Local First OS Workspace"，核心原则：

1. **无网页感**：不是网页 dashboard / admin panel / blog layout
2. **全屏 workspace**：内容铺满整个页面，不是中间容器
3. **无 section 标题**：不显示 "Recent clips", "Quick Capture" 等网页标题
4. **所有区域统一窗口化**：Clips / Quick Capture / Search / Filter 统一 OS Window 风格
5. **点击内容直接复制**：最高频动作是复制，不是编辑
6. **统一 Window Design System**：所有浮动窗口（Edit/Settings/Advanced）必须使用统一的 OS Window 语言

### Window Layer 层级

| 元素 | z-index |
|-----|---------|
| Topbar | 20 |
| Dock | 30 |
| Modal | 100 |
| Toast | 110 |

### 交互规则

- **点击卡片**：直接复制内容（copyClip），不是打开编辑
- **Edit 按钮**：明确为 secondary action
- **Dock**：底部固定漂浮窗口，用于快速切换内容类型
- **Settings**：使用 macOS Preferences 风格的 sidebar + content 布局

### OS Window Design System (v0.7.0+)

**Window 结构**（所有 Modal/Window 必须使用）：
```
.window
├── .window__header (可选，如果 Modal 自带 header 则省略)
│   ├── .window__chrome (交通灯按钮)
│   ├── .window__title
│   └── 右侧占位区
├── .window__toolbar (可选)
├── .window__content (主要内容)
└── .window__footer (操作按钮)
```

**Preferences 布局**：
```
.window--preferences (grid 两栏)
├── .window__sidebar (160px，分类按钮)
└── .window__main
    ├── .window__header
    ├── .window__content
    └── .window__footer
```

**Overflow 安全规则**：
- `* { max-width: 100% }` - 防止撑破容器
- `input/textarea { min-width: 0; max-width: 100% }` - 输入框不撑破
- `p/h1-h6 { overflow-wrap: break-word; word-break: break-word }` - 长文本换行

**统一样式规则**：
- 所有窗口使用相同的 border-radius (12px)
- 所有窗口使用相同的 box-shadow
- 所有窗口使用相同的 padding system (14px)
- Edit/Settings/Advanced 不再使用原始 HTML 表单

---

## 长期规则：UI 重构检查清单

### 每次 UI 重构必须检查

1. ✅ **版本号**：是否需要升级（minor/major）
2. ✅ **测试脚本**：run-self-test.mjs 和 preflight.mjs 版本检测
3. ✅ **RELEASE_NOTES.md**：新增版本记录
4. ✅ **AGENT_HANDOFF.md**：更新当前版本和完成事项
5. ✅ **build / self-test / preflight**：验证通过

### 禁止行为

- ❌ 只改 spacing/padding 而不产生明显视觉变化
- ❌ 不升级版本号就做真实修改
- ❌ 删除已有的功能、动画或测试来绕过问题
- ❌ 引入新框架解决小问题
- ❌ 自动 push、自动 release（除非明确要求）

---

# Release Discipline & Lifecycle Notes

## 1. Version Trigger Rules

以下情况**必须** bump version：

- 用户可见 UI 变化
- Motion system 变化
- Spatial/layout behavior 变化
- 新增 settings
- 新增 interaction pattern
- 新增 motion token
- 新增 style fingerprint
- 新增 self-test/preflight 检查
- 修改已有 animation behavior

## 2. Release Consistency

**CRITICAL**：必须同步以下 6 个文件：

| 文件 | 内容 |
|------|------|
| `package.json` | version field |
| `src/config/siteMeta.ts` | version field |
| `RELEASE_NOTES.md` | 新增版本记录 |
| `scripts/run-self-test.mjs` | 版本检测断言 |
| `scripts/preflight.mjs` | 版本检测断言 |
| `AGENT_HANDOFF.md` | 当前版本 + 完成事项 |

**禁止**：只改一个文件就发布。

**版本号命名**：遵循 semver
- **patch**（修复）：v0.x.0 → v0.x.1
- **minor**（功能）：v0.x.0 → v0.x+1.0
- **major**（重大重构）：v0.x.0 → v0.x+1.0（重大 UI 变化）

## 3. Stable Baseline Rule

- 不要默认使用 `HEAD~1`
- 必须明确 stable commit
- 当前 release baseline：**v0.8.0** + OS Spatial Motion System

## 4. Motion System Evolution Notes

### 已形成规范

- **OS Spatial Motion**：workspace 整体是"活的工作空间"
- **Stagger System**：CSS nth-child + `--stagger-delay`（40ms base）
- **Spatial Continuity**：grid continuity via `--clip-card--shifting`
- **Floating Layer**：backdrop blur + box-shadow + translateY hover
- **Anti-Web-Feeling**：无 container 感、无 section 标题、点击即操作

### Motion Tokens（已统一）

| Token | Value |
|-------|-------|
| `--duration-instant` | 0ms |
| `--duration-fastest` | 80ms |
| `--duration-fast` | 120ms |
| `--duration-normal` | 180ms |
| `--duration-slow` | 240ms |
| `--duration-slowest` | 320ms |
| `--easing-standard` | cubic-bezier(0.2, 0, 0, 1) |
| `--easing-standard-rev` | cubic-bezier(0, 0, 0.8, 1) |
| `--stagger-base` | 40ms |
| `--stagger-max` | 400ms |

### Motion States

- `.clip-card--entering`：blur + scale + translateY 入场
- `.clip-card--leaving`：blur out + scale down + opacity fade
- `.clip-card--shifting`：transform transition 用于补位
- `.floating-grid[data-filtering]`：grid pulse 反馈

### 后续 Agent 禁止行为

- ❌ 删除 motion continuity
- ❌ 回退为普通网页 `transition: all`
- ❌ 引入第二套 animation system
- ❌ 引入 marketing-style bounce/elastic
- ❌ 使用 `--easing-standard` 以外的值除非有明确理由
- ❌ 改变 stagger base 而不同步 stagger-max

## 5. Cloud Rule Priority

**云端 skill / lifecycle docs 优先级高于本地临时规则**。

以下文件后续优先通过"拉取云端最新规则"统一更新：
- README.md
- RELEASE_NOTES.md
- docs/*
- scripts/*

**不要在本地随意分叉修改**。

如需修改：
1. 先检查云端是否有最新版本
2. 如有，合并云端规则后再修改
3. 记录本地修改内容用于后续同步

## 6. 文件修改限制

**本轮约束**：

| 文件 | 状态 |
|------|------|
| package.json | ❌ 不修改 |
| README.md | ❌ 不修改 |
| RELEASE_NOTES.md | ❌ 不修改 |
| docs/* | ❌ 不修改（除 AGENT_HANDOFF.md） |
| scripts/* | ❌ 不修改 |
| AGENT_HANDOFF.md | ✅ 可修改（记录用） |
| src/* | ✅ 正常修改 |

## 7. Style Fingerprint

项目已创建 `docs/STYLE_FINGERPRINT.md`，记录：

- Motion Philosophy
- Hover Rules
- Spatial Rules
- Layer System
- Floating Layer Rules
- Workspace Continuity Rules
- Anti-Web-Feeling Rules
- Performance Rules
- Keyframes Reference

**后续 Agent 必须遵守此文档规范**。

---

## 当前版本状态

| 字段 | 值 |
|------|------|
| Version | v0.10.0 |
| Motion System | Cinematic Background & Theme System |
| Style Fingerprint | docs/STYLE_FINGERPRINT.md |
| Stable Baseline | v0.10.0 commit + current HEAD |
| Motion Tokens | 统一（duration/easing/stagger） |

---

## 后续 Agent 注意事项

1. **先读 AGENT_HANDOFF.md** - 了解当前状态
2. **遵守 Motion System 规范** - 不要回退
3. **版本升级必须同步所有文件** - 不要遗漏
4. **云端规则优先** - 不要本地随意分叉
5. **只改必要文件** - 不要修改 README/docs/scripts 除非拉取云端更新
6. **不自动 push/release** - 除非用户明确要求