# ARCHITECTURE.md

## 技术栈

- 前端框架：React 18.3.1
- 构建工具：Vite 6.0.7
- 语言：TypeScript 5.7.2
- UI 图标：lucide-react
- 加密：Web Crypto API (AES-GCM, PBKDF2)

## 项目结构

```
local-clipboard-vault/
├── src/
│   ├── App.tsx              # 主应用组件
│   ├── main.tsx            # 入口文件
│   ├── config/
│   │   └── siteMeta.ts    # 站点元信息
│   ├── lib/
│   │   ├── clipboardUtils.ts      # 剪切板工具函数
│   │   ├── clipboardStorage.ts  # localStorage 适配器
│   │   └── cryptoVault.ts       # Web Crypto 加密
│   ├── data/
│   │   └── sampleClips.ts    # 示例数据
│   └── hooks/
│       └── usePersistentState.ts
├── public/
│   ├── sw.js               # Service Worker
│   └── manifest.webmanifest
├── scripts/
│   ├── run-self-test.mjs   # 自测脚本
│   └── preflight.mjs      # 发布前检查
├── dist/                   # 构建产物
└── vite.config.ts          # Vite 配置
```

## 数据流

1. 用户粘贴或点击"从剪切板读取"
2. `clipboardUtils.ts` 生成标题、检测类型
3. `clipboardStorage.ts` 保存到 localStorage
4. App.tsx 从 localStorage 读取并渲染浮动卡片

## 加密流程

1. 用户设置主密码
2. cryptoVault.ts 使用 PBKDF2 派生密钥
3. 使用 AES-GCM 加密内容
4. 存储 ciphertext、salt、iv
5. 主密码只存于内存，刷新页面即清除

## 资源路径

- GitHub Pages base：`/local-clipboard-vault/`
- 线上资源路径：`https://w0nderful666.github.io/local-clipboard-vault/assets/xxx.js`