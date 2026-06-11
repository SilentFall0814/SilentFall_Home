# SilentFall_Home

一个基于 `Vite + React + TypeScript + Tailwind CSS` 构建的个人主页项目，包含动态点阵背景、鼠标透视跟随遮罩动画、滚动视差、磨砂导航和外部链接卡片等交互效果。

## 项目简介

SilentFall 的个人主页，以单页形式展示个人简介、社交页面入口和联系方式。首屏采用独特的鼠标透视跟随动画——鼠标移入时出现黑色圆形遮罩，露出底层文字，遮罩形状随鼠标移动速度在圆形和椭圆之间切换，配合 6 点弹性拖尾轨迹，营造流畅的视觉体验。

页面主要包含以下部分：

- **首屏 Hero** — 动态点阵背景 + 鼠标透视跟随遮罩动画
- **个人简介** — 个人标签与信息卡片
- **个人页面** — GitHub、个人博客、哔哩哔哩、抖音等社交页面入口
- **联系方式** — 邮箱地址展示与一键复制

## 技术栈

- `Vite`
- `React 19`
- `TypeScript`
- `Tailwind CSS`
- `Framer Motion`
- `Lenis`（平滑滚动）
- `PostCSS` / `Autoprefixer`

## 功能特点

- Canvas 动态点阵背景，支持鼠标视差与滚动联动
- 鼠标透视跟随遮罩动画（圆形/椭圆切换 + 6 点弹性拖尾）
- 首屏文字 3D 视差位移效果
- 首屏滚动视差动画
- 磨砂玻璃风格导航栏
- 锚点导航与外部链接跳转
- 触摸设备自动降级（禁用鼠标跟随效果）
- `Tailwind CSS` 响应式布局

## 项目结构

```text
SilentFall_Home
├─ public
│  └─ 111.png              # 网站图标
├─ src
│  ├─ assets
│  │  ├─ PingFangSC-Semibold.ttf   # 全局字体
│  │  └─ 111.png                   # 备用图标
│  ├─ App.tsx              # 主应用组件
│  ├─ index.css            # 全局样式
│  └─ main.tsx             # 入口文件
├─ index.html
─ package.json
├─ postcss.config.js
├─ tailwind.config.js
├─ tsconfig.json
└─ vite.config.ts
```

## 环境要求

- `Node.js 18` 及以上
- `npm 9` 及以上

## 安装依赖

```bash
npm install
```

## 本地开发

```bash
npm run dev
```

启动后终端会显示本地访问地址。

## 生产构建

```bash
npm run build
```

构建完成后生成 `dist` 目录，可用于静态部署。

## 本地预览构建结果

```bash
npm run preview
```

## 文档

- 性能优化报告：`docs/performance-report.md`
- 宝塔部署指南：`docs/宝塔部署博客项目指南.md`
- 设计规格：`docs/superpowers/specs/2026-06-11-performance-and-bt-deploy-design.md`

## 许可证

MIT
