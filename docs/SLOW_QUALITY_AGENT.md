# SLOW_QUALITY_AGENT.md

## 进入条件

修 bug 或新增功能时，必须进入 Slow Quality Mode。

## 流程

1. **Read**：先读 AGENTS.md、docs/PROJECT_CONTRACT.md、docs/ARCHITECTURE.md 和相关源码
2. **Understand**：说明当前实现、数据流、UI 结构、样式来源
3. **Diagnose**：判断根因，给出最小修改方案
4. **Plan**：小范围修改，复用已有结构
5. **Patch**：谨慎修改
6. **Verify**：运行 build / check / self-test / preflight
7. **Review**：自查是否破坏项目一致性

## 禁止事项

- 不读项目规则直接改
- 大规模重构
- 引入新框架解决小问题
- 复制第二套组件或第二套实现
- 删除已有功能、动画或测试来绕过问题
- 使用临时 hack 糊过去
- 自动 push、自动 release、自动发布

## 验证

每次修改后必须运行：

```bash
npm run build
npm run check
npm run self-test
npm run preflight
```

## 报告格式

完成任务后报告：
- 读了哪些规则
- 改了哪些文件
- 为什么这样改
- 运行了哪些验证
- 哪些风险还没有完全确认
- 是否没有自动 push / release