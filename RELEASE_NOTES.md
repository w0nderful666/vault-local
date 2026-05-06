# Release Notes

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
