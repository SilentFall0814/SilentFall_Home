# 项目候选清理清单

## 明确可清理

- `src/assets/PingFangSC-Semibold.ttf`
  - 原因：当前项目已改为系统字体栈，源码与样式中均无引用
  - 风险：低

## 可清理候选

- `docs/superpowers/specs/2026-06-11-performance-and-bt-deploy-design.md`
  - 原因：属于过程性规格文档，不属于正式交付文档
  - 风险：低
- `docs/superpowers/plans/2026-06-11-performance-and-bt-deploy-plan.md`
  - 原因：属于过程性实施计划，不属于正式交付文档
  - 风险：低

## 保留项

- `src/`
- `README.md`
- `docs/performance-report.md`
- `docs/宝塔部署博客项目指南.md`
- 根目录配置文件与构建脚本
