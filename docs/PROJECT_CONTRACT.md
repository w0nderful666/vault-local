# PROJECT_CONTRACT.md

项目名称：local-clipboard-vault
定位：Local First、No Backend、GitHub Pages Ready 的剪切板/文本收纳工具

## 核心承诺

- 数据只保存在浏览器 localStorage，不上传任何服务器
- 纯前端 Web，不引入后端服务
- 通过 GitHub Pages 部署，自动化发布
- 尊重用户隐私，不收集用户内容

## 禁止事项

- 不引入后端服务或 API 端点
- 不引入数据库服务
- 不新增登录系统或第三方认证
- 不引入远程日志或分析服务
- 不新增大型 UI 框架
- 不删除已有功能来绕过测试
- 不修改现有 UI 风格

## 质量门槛

每次修改后必须运行：
- `npm run build`
- `npm run check`
- `npm run self-test`
- `npm run preflight`

## 项目级别

C-Level（C 级启动）：聚焦单页面本地优先工具，核心功能完整，稳定可用。

## 部署信息

- 仓库：w0nderful666/local-clipboard-vault
- 线上地址：https://w0nderful666.github.io/local-clipboard-vault/
- 部署方式：GitHub Actions → GitHub Pages