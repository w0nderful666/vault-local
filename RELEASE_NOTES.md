# Release Notes

## v0.7.0 — OS Window System Polish

May 6, 2026.

Added:

- Unified OS Window Design System
- Edit Window with OS Floating Window styling (window chrome, structured content)
- Settings Window with macOS Preferences-style sidebar (Appearance, Workspace, Advanced)
- Advanced Tools merged into Settings (no longer in page footer)
- Global overflow protection (word-break, overflow-wrap, min-width)
- Window classes: `.window`, `.window__header`, `.window__chrome`, `.window__toolbar`, `.window__content`, `.window__footer`
- Edit form: proper grouping, label hierarchy, styled checkboxes
- Settings tabs: sidebar navigation with icons

Changed:

- Edit Modal: now uses OS Window structure with traffic lights
- Settings Modal: now uses sidebar + content layout
- Advanced section: removed from main workspace, integrated into Settings
- Global CSS: comprehensive overflow protection for all elements

## v0.6.0 — OS Window System Fix

May 6, 2026.

Added:

- Click card to copy (direct copy interaction)
- OS Toast notification for copy success
- Larger dock icons (40px)
- Fixed modal z-index and positioning
- Card overflow fixed (word-break, line-clamp)
- v0.6.0

Changed:

- Card click: openEdit → copyClip
- Edit button is now secondary action
- Dock icon: 32px → 40px
- Modal: proper fixed overlay, z-index 100

## v0.5.0 — OS Navigation

May 6, 2026.

Added:

- Bottom Dock with floating glass style
- Dock category switching (All, Prompt, API Key, Token, Command, etc.)
- Settings panel (Appearance, Language)
- OS Dock System at bottom of workspace
- v0.5.0

## v0.4.0 — OS Workspace

May 6, 2026.

Added:

- Full-width workspace (removed container max-width)
- No section headers (removed "Recent clips", "Quick Capture" titles)
- All regions unified as OS Windows
- Floating window system layout
- v0.4.0

Changed:

- main-content: 100% width, no container
- Removed all "section title" elements
- All panels as floating windows
- Unified OS window style

## v0.3.1 — OS Card Proportions

May 6, 2026.

Added:

- Wider content area, reduced side margins
- Card proportions: wider, shorter, more window-like
- Copy button as primary action (highlighted)
- Unified toolbar styling
- OS card structure for motion prep
- v0.3.1

Changed:

- Grid: 5 columns per row target
- Cards: more horizontal, less tall
- Actions: primary/secondary/danger hierarchy

## v0.3.0 — OS Floating Workbench

May 6, 2026.

Added:

- OS-style floating cards with layered shadows
- Icon-only card action buttons
- Removed inner scrollbars, page-level scrolling only
- Card hover with subtle lift animation
- v0.3.0

Changed:

- Cards more like floating windows
- Buttons reduced to icons with hover tooltips
- Content area fills full width

## v0.2.0 — OS Workbench Refactor

May 6, 2026.

Added:

- OS-style workbench layout (left: content area, right: sidebar)
- Compact sidebar sections with clear visual hierarchy
- Quick Capture as fixed sidebar panel
- Card redesign: smaller, more OS-like floating windows with color bar indicator
- Tighter spacing and higher information density
- Version bump to v0.2.0

Changed:

- Removed hero section → now direct-to-work mode
- Sidebar becomes fixed system panel
- Cards are smaller (220px min) with gradient hover bar

## v0.1.0 — Local Clipboard Vault C-Level Launch

May 5, 2026.

Added:

- Quick Capture 快速导入.
- Paste from clipboard with `navigator.clipboard.readText`.
- Ctrl + Enter manual save.
- Auto title generation.
- Local type detection.
- Floating cards layout.
- Local storage adapter.
- Secure Vault basic encryption with Web Crypto API.
- Sensitive content mask and unlock-to-reveal flow.
- Copy / Edit / Clone / Delete.
- Pin / Favorite.
- Search / Filter.
- JSON import / export.
- Dark mode.
- Chinese / English switching.
- Mobile responsive layout.
- self-test / preflight checks for the Local Clipboard Vault launch.

Checks:

- `npm run build`
- `npm run self-test`
- `npm run preflight`
