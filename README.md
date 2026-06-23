# SilentFall_Home

一个基于 `Vite + React + TypeScript` 构建的单页个人主页项目，采用 Claude 品牌设计语言，主打沉浸式 Hero 首屏、编辑式排版、配置驱动内容和流畅的动效体验。

## 项目简介

`SilentFall_Home` 是 SilentFall 的个人主页，用于展示个人简介、技能、作品、装备和联系方式。项目是纯静态前端站点，不包含后端接口、数据库或服务端渲染逻辑，适合直接构建后部署到静态托管环境或 Nginx 站点。

### 设计语言

项目采用 Claude（Anthropic）品牌设计语言：

- **色彩系统**：奶油白 `#faf9f5` 底 + 暖黑 `#141413` 文本 + 陶土橙 `#d97757` 强调 + 橄榄绿 `#788c5d` / 雾蓝 `#6a9bcc` 辅助点缀
- **字体系统**：Lora 衬线（标题）+ Poppins 无衬线（正文）
- **视觉特征**：纸张质感、编辑式排版、慷慨留白、手绘装饰元素

### 核心交互与视觉特征

- 动态点阵 Hero 背景（陶土橙暖色调）
- 鼠标透视跟随与暗色遮罩拖尾效果
- 滚动视差和标题层次动效
- 单页锚点导航 + 平滑滚动
- 邮箱一键复制交互
- 触摸设备降级与减少动态偏好适配

## 技术栈

- `Vite 8`
- `React 19`
- `TypeScript 6`
- `Tailwind CSS 3`
- `Framer Motion`
- `Lenis`（平滑滚动）
- `Vitest`（单元测试）
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
npm run dev        # 启动开发服务器
npm run typecheck  # 执行 TypeScript 类型检查
npm run test       # 运行 Vitest 单元测试
npm run build      # 执行生产构建
npm run preview    # 本地预览构建产物
```

## 配置驱动架构

**全站所有文字内容集中在一个配置文件中**，修改文字无需改动任何组件代码：

```
src/config/site.config.ts
```

该文件包含以下板块的文字内容：

| 配置项 | 说明 |
|--------|------|
| `SITE` | 站点名称、页脚标语、版权、签名 |
| `NAV_LINKS` | 导航栏链接 |
| `HERO` | 首屏欢迎语、问候、签名、副标题 |
| `ABOUT` | 关于区域：标题、卡片、标签、时间线、特性 |
| `NOW` | 此刻区域：正在做的事 |
| `SKILLS` | 技能区域：分组与等级 |
| `PROJECTS` | 作品区域：项目列表 |
| `USES` | 装备区域：硬件 / 软件 |
| `OTHER_PAGES_HEADING` + `SOCIAL_LINKS` | 社交链接区域 |
| `CONTACT` | 联系方式：邮箱列表与复制按钮文案 |

**修改文字的流程**：

1. 打开 `src/config/site.config.ts`
2. 修改对应字段的文字
3. 保存，页面自动热更新刷新

> **关于样式与文字解耦**：技能等级（`level`）和项目状态（`status`）的配色通过 `tone` 标识符（`clay` / `sage` / `slate` 等）控制，与文字本身解耦。修改 `level` / `status` 的文字不会影响样式，只需保持 `tone` 不变即可。

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

## 核心功能模块

### 1. 首页页面模块

位于 `src/pages/home/`，负责单页主页的页面级组合与展示逻辑。

### 2. 首屏 Hero 模块

位于 `src/pages/home/hero/`，负责：

- 点阵背景绘制（`DotGridCanvas`）
- 标题视差效果（`PerspectiveHeroSection`）
- 签名字母动效（`SignatureLetters`）
- 鼠标遮罩拖尾
- 动画降级策略

### 3. 内容区块

位于 `src/pages/home/sections/`，包含七个板块：

- `AboutSection` — 关于
- `NowSection` — 此刻
- `SkillsSection` — 技能
- `ProjectsSection` — 作品
- `UsesSection` — 装备
- `OtherPagesSection` — 找到我（社交链接）
- `ContactSection` — 联系方式

### 4. 配置与组件

- `src/config/site.config.ts` — 全站文字内容配置（修改文字的唯一入口）
- `src/components/SocialIcon.tsx` — 社交图标组件（根据标识符渲染对应 SVG）
- `src/components/layout/` — 导航栏（`Navbar`）与页脚（`Footer`）

### 5. 通用布局与交互能力

- `src/hooks/` — 滚动控制、视差指针、Hero 活跃态判断等 Hook
- `src/utils/` — 性能模式判断等通用工具函数
- `tests/` — 单元测试用例

## 目录结构

```text
SilentFall_Home
├─ public
│  └─ 111.png
├─ src
│  ├─ components
│  │  ├─ layout
│  │  │  ├─ Footer.tsx
│  │  │  └─ Navbar.tsx
│  │  └─ SocialIcon.tsx
│  ├─ config
│  │  └─ site.config.ts          # 全站文字内容配置文件
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
│  │     │  ├─ NowSection.tsx
│  │     │  ├─ OtherPagesSection.tsx
│  │     │  ├─ ProjectsSection.tsx
│  │     │  ├─ SkillsSection.tsx
│  │     │  └─ UsesSection.tsx
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

## 贡献指南

如果你要继续维护这个项目，建议遵循以下规则：

1. 优先保持单页主页的 Claude 视觉风格一致性
2. **修改文字内容只改 `src/config/site.config.ts`，不要在组件中硬编码文字**
3. 高刷新的交互优先使用 `ref`、`motion value` 或 `requestAnimationFrame`
4. 页面级逻辑优先放入 `src/pages/`，通用能力再下沉到 `components`、`hooks`、`utils`
5. 修改后至少执行：

```bash
npm run typecheck
npm run test
npm run build
```

## 当前状态说明

- 当前项目为静态前端站点
- 不包含服务端代码，因此数据库、接口缓存、进程守护等内容仅在部署时以 Nginx 配置形式处理

## 许可证

MIT
