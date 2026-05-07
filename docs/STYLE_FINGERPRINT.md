# STYLE_FINGERPRINT.md

vault-local OS Motion System 规范文档。

### Depth Layer System

| Token | Layer | Shadow | Purpose |
|-------|-------|--------|---------|
| `--depth-bg` | Background | none | 最底层 |
| `--depth-card` | Card | `--shadow-depth-1` | 默认卡片 |
| `--depth-focus` | Focus | `--shadow-focus` | 焦点卡片 |
| `--depth-floating` | Floating | `--shadow-depth-2` | 浮动元素 |
| `--depth-overlay` | Overlay | `--shadow-depth-3` | 覆盖层 |
| `--depth-modal` | Modal | 自定义 | 模态框 |

### Shadow Tokens

```css
--shadow-depth-0: none;
--shadow-depth-1: 0 1px 3px + 0 2px 8px;
--shadow-depth-2: 0 2px 6px + 0 4px 16px;
--shadow-depth-3: 0 4px 12px + 0 8px 24px;
--shadow-focus: 0 0 0 2px var(--focus);
```

---

## Motion Philosophy

**核心理念**：
- 整个 workspace 是一个"活的工作空间"，而非静态网页
- 动画服务于"OS 空间连续性"，而非装饰
- 用户操作应感到"系统在工作"，而非"动画在播放"

**设计原则**：
1. **轻**：使用 transform/opacity/filter，不触发 layout thrash
2. **稳**：无 bounce/elastic，保持系统化 easing
3. **短**：duration 通常 80-240ms，快速响应
4. **统一**：所有组件复用同一套 motion tokens
5. **克制**：OS 风格，非营销网站式夸张动画

---

## Motion Tokens

### Duration Scale
| Token | Value | Usage |
|-------|-------|-------|
| `--duration-instant` | 0ms | 立即响应，无动画 |
| `--duration-fastest` | 80ms | 微交互（hover border） |
| `--duration-fast` | 120ms | 快速响应（hover lift） |
| `--duration-normal` | 180ms | 标准过渡 |
| `--duration-slow` | 240ms | 强调过渡 |
| `--duration-slowest` | 320ms | 大型入场 |

### Easing Curve
| Token | Value | Feel |
|-------|-------|------|
| `--easing-standard` | cubic-bezier(0.2, 0, 0, 1) | 标准 OS |
| `--easing-standard-rev` | cubic-bezier(0, 0, 0.8, 1) | 退出 |
| `--easing-window` | cubic-bezier(0.16, 0, 0.3, 1) | 窗口弹出 |
| `--easing-overlay` | cubic-bezier(0.3, 0, 0.7, 1) | 覆盖层 |
| `--easing-emphasized` | cubic-bezier(0.2, 0, 0, 1) | 强调 |

### Stagger System
| Token | Value | Usage |
|-------|-------|-------|
| `--stagger-base` | 40ms | 相邻卡片间隔 |
| `--stagger-max` | 400ms | 最大延迟 |

---

## Hover Rules

**Hover 代表"窗口获得 focus"**，而非传统网页的"交互反馈"。

**要求**：
- Subtle lift: `translateY(-3px)` max
- Shadow layer shift: 轻微加深
- Border energy: 微妙的 border color 变化
- 无大 scale，无 bounce，无夸张效果

**实现**：
```css
.clip-card:hover {
  border-color: color-mix(in srgb, var(--teal) 70%, var(--border));
  box-shadow: 0 2px 6px rgb(0 0 0 / 6%), 0 6px 20px rgb(31 122 112 / 12%);
  transform: translateY(-3px);
  backdrop-filter: blur(2px);
}
```

---

## Spatial Rules

### Grid Continuity
- 卡片增删时保持空间连续性
- 删除卡片有 240ms 退出动画
- 剩余卡片平滑补位（通过 CSS transition）
- filter 时整体有微妙的 opacity 脉冲

### Card Motion States
| State | Animation |
|-------|-----------|
| `--entering` | blur(3px) → blur(0), scale(0.96) → scale(1), translateY(6px) → translateY(0) |
| `--leaving` | scale(1) → scale(0.96), opacity → 0, filter blur(6px) |
| `--shifting` | transform transition 用于补位 |
| default | hover lift + shadow shift |

### Stagger Entry
卡片按 DOM 顺序 stagger 入场：
```css
.clip-card:nth-child(1)  { --stagger-delay: calc(var(--stagger-base, 40ms) * 0); }
.clip-card:nth-child(2)  { --stagger-delay: calc(var(--stagger-base, 40ms) * 1); }
/* ... */
```

---

## Layer System

### z-index Stack
| Layer | z-index | Content |
|-------|---------|---------|
| Topbar | 20 | 状态栏 |
| Dock | 30 | 底部浮动导航 |
| Modal | 100 | 窗口/对话框 |
| Toast | 110 | 通知 |

### Floating Layer
- Dock: `position: fixed`, `backdrop-filter: blur(20px)`, 底部居中
- Modal: 全屏覆盖，`backdrop-filter: blur`
- 所有浮动元素有柔和的 box-shadow

---

## Floating Layer Rules

**浮动层特征**：
- 半透明背景 + backdrop blur
- 柔和 box-shadow
- 边缘微 glow
- 悬停时轻微上浮
- 无生硬边线

**实现示例**：
```css
.dock {
  backdrop-filter: blur(20px);
  box-shadow: 0 4px 24px rgb(0 0 0 / 15%);
}

.modal {
  backdrop-filter: blur(4px);
}
```

---

## Workspace Continuity Rules

**任何布局变化必须"连续"**：
- sidebar 展开：内容平滑挤压
- detail panel：空间连续过渡
- dock hover：不影响主内容
- filter/search：整体有微妙的 reflow 脉冲

**避免**：
- 瞬移
- 突然跳动
- reflow 闪烁
- 白屏
- 布局跳跃

---

## Anti-Web-Feeling Rules

**减少网页感的关键**：

1. **无 container 感**：workspace 100% 全宽，无居中限制
2. **无 section 标题**：移除 "Recent clips" 等网页标题
3. **点击即操作**：点击卡片直接复制
4. **OS Window 结构**：所有弹出窗口使用 .window BEM 结构
5. **统一 Window 语言**：Edit/Settings/Advanced 风格一致

**禁止**：
- Bootstrap 味按钮
- 普通 fade 动画
- 双滚动
- 内层滚动条
- 突然 layout reflow

---

## Performance Rules

**动画性能要求**：

**优先使用**：
- `transform`
- `opacity`
- `filter: blur()`

**谨慎使用**：
- `box-shadow` 动态变化（只在 hover 状态）
- `width/height` 动画

**禁止**：
- 高频 box-shadow 动画
- 触发 layout thrash
- 明显掉帧

**will-change 策略**：
```css
.clip-card {
  will-change: transform, opacity, filter;
}
```

---

## Keyframes Reference

| Animation | Purpose |
|-----------|---------|
| `card-enter` | 卡片入场（blur + scale + translateY） |
| `card-exit` | 卡片删除（blur + scale out + opacity fade） |
| `modal-fade-in/out` | Modal 覆盖层 |
| `modal-scale-in/out` | Modal 面板弹出 |
| `toast-in/out` | Toast 通知 |
| `window-content-slide` | Settings tab 内容滑动 |
| `grid-regroup` | Filter 触发时 grid 脉冲 |
| `content-reflow` | Main content reflow 脉冲 |

---

## Future Improvements (Not Implemented)

1. **FLIP Motion System**：记录位置差值，平滑补间（需要 JS 逻辑）
2. **Motion Settings**：Off/Minimal/Normal/Slow/Cinematic
3. **Inertia System**：拖拽惯性
4. **Advanced Hover States**：多层 shadow stack

---

## Version

v0.9.0 - OS Spatial Motion System
