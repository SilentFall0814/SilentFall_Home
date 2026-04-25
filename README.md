# Repea Home

一个基于 `Vite + React + TypeScript + Tailwind CSS` 构建的个人主页项目，整体风格偏作品展示与视觉表达，包含动态点阵背景、鼠标视差、滚动过渡、磨砂导航和外部链接卡片等交互效果。

## 项目简介

这个项目用于展示个人信息、作品入口和联系方式，页面内容以单页形式组织，适合用作个人主页、轻量作品集或展示型落地页。

当前页面主要包含以下几个部分：

- 顶部导航：用于跳转到页面不同区域
- 首屏展示：强调视觉氛围、标题动效与动态背景
- 个人简介：展示个人描述与基础信息
- 我的页面：展示外部项目或页面入口
- 联系方式：展示邮箱等联系信息

## 技术栈

- `Vite`
- `React 19`
- `TypeScript`
- `Tailwind CSS`
- `Framer Motion`
- `Lenis`
- `PostCSS`
- `Autoprefixer`

## 功能特点

- 单页式个人主页结构，内容清晰
- 使用 `Framer Motion` 实现入场动画、悬浮动效与滚动过渡
- 使用 `canvas` 绘制动态点阵背景，增强页面氛围
- 提供鼠标视差反馈，提升交互表现
- 使用磨砂玻璃风格导航栏增强视觉层次
- 支持锚点导航与外部链接跳转
- 使用 `Tailwind CSS` 快速组织样式与响应式布局

## 项目结构

```text
Repea_Home
├─ public
│  ├─ avatar.png
│  ├─ favicon.svg
│  └─ icons.svg
├─ src
│  ├─ assets
│  │  ├─ hero.png
│  │  ├─ typescript.svg
│  │  └─ vite.svg
│  ├─ App.tsx
│  ├─ index.css
│  └─ main.tsx
├─ index.html
├─ package.json
├─ postcss.config.js
├─ tailwind.config.js
├─ tsconfig.json
└─ vite.config.ts
```

## 环境要求

建议使用以下环境：

- `Node.js 18` 及以上
- `npm 9` 及以上

## 安装依赖

```bash
npm install
```

## 本地开发

启动开发服务器：

```bash
npm run dev
```

默认情况下，项目会由 Vite 启动本地开发服务，终端中会显示访问地址。

## 生产构建

执行构建：

```bash
npm run build
```

构建完成后会生成 `dist` 目录，可用于静态部署。

## 本地预览构建结果

```bash
npm run preview
```

## 可修改内容

如果你想基于这个项目继续定制，通常可以从下面这些位置开始：

- `src/App.tsx`
  - 页面主体结构
  - 导航项配置
  - 个人简介内容
  - 外部页面卡片数据
  - 联系方式数据
- `src/index.css`
  - 全局样式
  - 页面基础背景
  - 选择态与基础标签样式
- `tailwind.config.js`
  - 主题颜色
  - 字体
  - 阴影
  - 动画与缓动配置
- `public/`
  - 网站图标
  - 头像与静态资源

## 页面内容配置说明

项目当前将大部分展示内容直接写在 `src/App.tsx` 中，例如：

- `NAV_LINKS`：顶部导航
- `ABOUT_POINTS`：个人简介卡片内容
- `OTHER_PAGES`：外部项目或页面入口
- `CONTACT_ITEMS`：联系方式

如果需要替换成你自己的主页内容，优先修改这些数据即可。

## 部署说明

这个项目构建后产物为纯静态文件，适合部署到以下平台：

- `Vercel`
- `Netlify`
- `GitHub Pages`
- 任意支持静态资源托管的服务器或对象存储

部署时通常只需要上传 `dist` 目录中的内容。

## 后续优化建议

- 将 `src/App.tsx` 中的静态数据拆分到独立配置文件
- 为外部项目卡片补充封面图和更完整的描述
- 增加深色模式或主题切换
- 补充 SEO 配置与社交分享信息
- 为关键模块补充更细致的移动端适配

## 许可说明

当前仓库未包含明确的开源许可证。

如果你打算公开分发或允许他人复用，建议补充 `LICENSE` 文件。
