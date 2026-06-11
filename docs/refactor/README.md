# ede.js 模块化改造

本目录存放 ede.js 模块化改造相关文档。

## 文档索引

| 文档 | 说明 |
|------|------|
| [REFACTOR_PLAN.md](./REFACTOR_PLAN.md) | 改造方案：目录结构、模块划分、构建配置、迁移注意事项 |
| [REFACTOR_SCHEDULE.md](./REFACTOR_SCHEDULE.md) | 计划编排：分阶段任务、验收标准、执行建议 |

## 分支

- `feature/modular-refactor`：模块化改造主分支

## 方案

采用 **方案 A：ESM + 构建工具（Rollup）**，将单文件拆分为多模块，构建为 IIFE 格式单文件输出。
