# SilentFall_Home

一个基于 `Vite + React + TypeScript` 构建的单页个人主页项目，主打沉浸式 Hero 首屏、动态点阵背景、鼠标透视遮罩、平滑滚动和响应式信息展示。

## 项目简介

`SilentFall_Home` 用来展示个人简介、站外页面入口和联系方式。项目当前是纯静态前端站点，不包含后端接口、数据库或服务端渲染逻辑，适合直接构建后部署到静态托管环境或宝塔面板的 `Nginx` 站点中。

当前项目重点保留了以下视觉与交互特征：

- 动态点阵 Hero 背景
- 鼠标透视跟随与黑色遮罩拖尾效果
- 滚动视差和标题层次动效
- 单页锚点导航
- 外链入口与邮箱复制交互
- 触摸设备降级与减少动态偏好适配

## 技术栈

- `Vite 8`
- `React 19`
- `TypeScript 6`
- `Tailwind CSS 3`
- `Framer Motion`
- `Lenis`
- `Vitest`
- `PostCSS` / `Autoprefixer`

## 环境依赖

建议本地开发环境如下：

- `Node.js 18` 或更高版本
- `npm 9` 或更高版本

安装依赖：

```bash
npm install
```

## 本地开发

启动开发环境：

```bash
npm run dev
```

启动后根据终端输出访问本地开发地址。

## 常用脚本

```bash
npm run dev
npm run typecheck
npm run test
npm run build
npm run preview
```

说明：

- `dev`：启动开发服务器
- `typecheck`：执行 TypeScript 类型检查
- `test`：运行 Vitest 单元测试
- `build`：执行生产构建
- `preview`：本地预览构建产物

## 构建与部署

生产构建：

```bash
npm run build
```

构建成功后会生成 `dist` 目录，可直接用于静态部署。

如果你要部署到服务器：

1. 本地执行 `npm run build`
2. 将 `dist` 目录中的内容上传到服务器站点根目录
3. 用 `Nginx` 或宝塔面板创建静态站点
4. 配置域名、HTTPS 和缓存策略

更完整的服务器部署说明见：`docs/宝塔部署博客项目指南.md`

## 核心功能模块

### 1. 首页页面模块

位于 `src/pages/home/`，负责单页主页的页面级组合与展示逻辑。

### 2. 首屏 Hero 模块

位于 `src/pages/home/hero/`，负责：

- 点阵背景绘制
- 标题视差效果
- 鼠标遮罩拖尾
- 动画降级策略

### 3. 页面内容区块

位于 `src/pages/home/sections/`，负责：

- 个人简介区
- 外链入口区
- 联系方式区

### 4. 通用布局与交互能力

- `src/components/layout/`：导航栏等布局组件
- `src/hooks/`：滚动控制、视差指针、Hero 活跃态判断等 Hook
- `src/utils/`：性能模式判断等通用工具函数
- `tests/`：单元测试用例

## 目录结构

```text
SilentFall_Home
├─ docs
│  ├─ maintenance
│  │  ├─ cleanup-candidates.md
│  │  └─ project-file-inventory.json
│  ├─ performance-report.md
│  └─ 宝塔部署博客项目指南.md
├─ public
│  └─ 111.png
├─ src
│  ├─ components
│  │  └─ layout
│  │     └─ Navbar.tsx
│  ├─ hooks
│  │  ├─ useHeroActivity.ts
│  │  ├─ useParallaxPointer.ts
│  │  ├─ usePerspectiveTrail.ts
│  │  ├─ useSmoothScroll.ts
│  │  └─ useViewportProfile.ts
│  ├─ pages
│  │  └─ home
│  │     ├─ components
│  │     │  └─ SectionHeading.tsx
│  │     ├─ hero
│  │     │  ├─ DotGridCanvas.tsx
│  │     │  ├─ LiquidGlassDefs.tsx
│  │     │  ├─ PerspectiveHeroSection.tsx
│  │     │  └─ SignatureLetters.tsx
│  │     ├─ sections
│  │     │  ├─ AboutSection.tsx
│  │     │  ├─ ContactSection.tsx
│  │     │  └─ OtherPagesSection.tsx
│  │     ├─ content.tsx
│  │     └─ HomePage.tsx
│  ├─ utils
│  │  └─ performance.ts
│  ├─ App.tsx
│  ├─ index.css
│  └─ main.tsx
├─ tests
│  └─ unit
│     └─ performance.test.ts
├─ index.html
├─ package.json
├─ postcss.config.js
├─ tailwind.config.js
├─ tsconfig.json
└─ vite.config.ts
```

## 文档说明

- `docs/performance-report.md`：性能优化结果与构建体积对比
- `docs/宝塔部署博客项目指南.md`：宝塔面板静态部署文档
- `docs/maintenance/project-file-inventory.json`：本轮整理前导出的项目文件清单备份
- `docs/maintenance/cleanup-candidates.md`：本轮整理的候选清理记录

## 贡献指南

如果你要继续维护这个项目，建议遵循以下规则：

1. 优先保持单页主页的视觉风格一致性
2. 高刷新的交互优先使用 `ref`、`motion value` 或 `requestAnimationFrame`
3. 页面级逻辑优先放入 `src/pages/`，通用能力再下沉到 `components`、`hooks`、`utils`
4. 修改后至少执行：

```bash
npm run typecheck
npm run test
npm run build
```

## 当前状态说明

- 当前项目为静态前端站点
- 当前仓库已完成一次结构整理与冗余清理
- 不包含服务端代码，因此数据库、接口缓存、进程守护等内容仅在部署文档中以建议形式出现

## 许可证

MIT
