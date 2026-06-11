# SilentFall_Home 性能优化与宝塔部署 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 在尽量保留首屏视觉效果的前提下，完成当前前端仓库的流畅度优化、构建稳定性修复、性能验证文档与宝塔部署文档交付。

**Architecture:** 先建立可对比的性能基线，再把巨大的 `App.tsx` 拆成可独立优化的组件与 Hook。高频动画数据改为 `ref`、`motion value` 和单一 `requestAnimationFrame` 回路驱动，减少 React 重渲染；最后补齐构建配置、性能报告和宝塔部署文档。

**Tech Stack:** Vite、React 19、TypeScript、Tailwind CSS、Framer Motion、Lenis、Vitest

---

## 文件结构与职责

### 计划创建或修改的文件

- 修改：`package.json`
  - 增加测试、诊断或构建辅助脚本
- 修改：`vite.config.ts`
  - 补充生产构建优化与测试配置
- 修改：`src/App.tsx`
  - 仅保留页面组合、少量顶层状态与组件装配
- 修改：`src/index.css`
  - 增补性能相关的全局样式、降级策略与字体回退
- 修改：`src/main.tsx`
  - 如有需要，为性能模式或严格模式兼容做轻量调整
- 创建：`src/components/layout/Navbar.tsx`
  - 导航栏及锚点跳转 UI
- 创建：`src/components/hero/PerspectiveHeroSection.tsx`
  - 首屏 Hero 组合逻辑
- 创建：`src/components/hero/DotGridCanvas.tsx`
  - 点阵背景画布
- 创建：`src/components/hero/SignatureLetters.tsx`
  - 标题字母与视差文字
- 创建：`src/components/hero/LiquidGlassDefs.tsx`
  - SVG 玻璃滤镜定义
- 创建：`src/components/sections/AboutSection.tsx`
  - 个人简介区块
- 创建：`src/components/sections/OtherPagesSection.tsx`
  - 外链入口区块
- 创建：`src/components/sections/ContactSection.tsx`
  - 联系方式区块
- 创建：`src/constants/site.tsx`
  - 导航、社交链接、联系方式等静态数据
- 创建：`src/hooks/useViewportProfile.ts`
  - 设备能力判断
- 创建：`src/hooks/useParallaxPointer.ts`
  - 鼠标视差输入
- 创建：`src/hooks/usePerspectiveTrail.ts`
  - Hero 遮罩拖尾动画控制
- 创建：`src/hooks/useSmoothScroll.ts`
  - Lenis 初始化与锚点滚动封装
- 创建：`src/hooks/useHeroActivity.ts`
  - Hero 可见性与高成本动画启停控制
- 创建：`src/utils/performance.ts`
  - 纯函数形式的性能模式计算工具
- 创建：`src/utils/__tests__/performance.test.ts`
  - 对性能决策工具做聚焦测试
- 创建：`docs/performance-report.md`
  - 优化前后性能对比报告
- 创建：`docs/宝塔部署博客项目指南.md`
  - 宝塔部署落地文档

### 约束

- 不新增后端代码
- 不引入与当前项目无关的大型基础设施
- 不为了分数大幅删除首屏视觉语言
- 仅为有明确收益的逻辑增加测试

## Task 1: 建立基线并修复当前构建失败

**Files:**
- Modify: `e:\Project\Web_Project\SilentFall_Home\src\App.tsx`
- Create: `e:\Project\Web_Project\SilentFall_Home\docs\performance-report.md`

- [ ] **Step 1: 记录当前构建失败信息到报告中**

````md
## 一、优化前基线

### 1. 构建状态

执行命令：

```bash
npm run build
```

当前结果：

- 构建失败
- `src/App.tsx` 中存在未使用导入 `useMemo`
- `src/App.tsx` 中存在未使用函数 `isInternalHashLink`
````

- [ ] **Step 2: 运行构建命令确认问题仍可复现**

Run: `npm run build`
Expected: FAIL，输出包含 `useMemo` 与 `isInternalHashLink` 未使用错误

- [ ] **Step 3: 做最小修复让构建先恢复**

```tsx
import { useCallback, useEffect, useRef, useState } from 'react';

// 删除未使用函数 isInternalHashLink
```

- [ ] **Step 4: 再次运行构建命令确认恢复**

Run: `npm run build`
Expected: PASS，生成 `dist` 目录

- [ ] **Step 5: 提交基线修复**

```bash
git add src/App.tsx docs/performance-report.md
git commit -m "fix: 修复当前构建失败并记录性能基线"
```

## Task 2: 引入可测试的性能决策工具

**Files:**
- Modify: `e:\Project\Web_Project\SilentFall_Home\package.json`
- Modify: `e:\Project\Web_Project\SilentFall_Home\vite.config.ts`
- Create: `e:\Project\Web_Project\SilentFall_Home\src\utils\performance.ts`
- Create: `e:\Project\Web_Project\SilentFall_Home\src\utils\__tests__\performance.test.ts`

- [ ] **Step 1: 添加测试依赖与脚本**

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "test": "vitest run"
  },
  "devDependencies": {
    "vitest": "^3.2.4"
  }
}
```

- [ ] **Step 2: 编写会先失败的性能模式测试**

```ts
import { describe, expect, it } from 'vitest';
import {
  getAnimationLevel,
  getDotGridConfig,
  shouldEnableSmoothScroll,
} from '../performance';

describe('performance', () => {
  it('在移动或减少动态时返回轻量动画等级', () => {
    expect(getAnimationLevel({ isCompactScreen: true, isCoarsePointer: false, prefersReducedMotion: false })).toBe('lite');
    expect(getAnimationLevel({ isCompactScreen: false, isCoarsePointer: false, prefersReducedMotion: true })).toBe('lite');
  });

  it('在桌面精细指针环境返回完整动画等级', () => {
    expect(getAnimationLevel({ isCompactScreen: false, isCoarsePointer: false, prefersReducedMotion: false })).toBe('full');
  });

  it('根据动画等级生成不同点阵配置', () => {
    expect(getDotGridConfig('full').spacing).toBeLessThan(getDotGridConfig('lite').spacing);
  });

  it('仅在完整动画等级下启用平滑滚动', () => {
    expect(shouldEnableSmoothScroll('full')).toBe(true);
    expect(shouldEnableSmoothScroll('lite')).toBe(false);
  });
});
```

- [ ] **Step 3: 运行测试确认失败**

Run: `npm test`
Expected: FAIL，提示 `../performance` 不存在

- [ ] **Step 4: 实现最小性能工具函数**

```ts
export type ViewportProfile = {
  isCompactScreen: boolean;
  isCoarsePointer: boolean;
  prefersReducedMotion: boolean;
};

export type AnimationLevel = 'full' | 'lite';

export function getAnimationLevel(profile: ViewportProfile): AnimationLevel {
  if (profile.isCompactScreen || profile.isCoarsePointer || profile.prefersReducedMotion) {
    return 'lite';
  }
  return 'full';
}

export function shouldEnableSmoothScroll(level: AnimationLevel) {
  return level === 'full';
}

export function getDotGridConfig(level: AnimationLevel) {
  return level === 'full'
    ? { spacing: 28, heightRatio: 1.3, alphaSteps: 50 }
    : { spacing: 40, heightRatio: 1.05, alphaSteps: 24 };
}
```

- [ ] **Step 5: 运行测试确认通过**

Run: `npm test`
Expected: PASS，4 个测试全部通过

- [ ] **Step 6: 提交性能工具层**

```bash
git add package.json vite.config.ts src/utils/performance.ts src/utils/__tests__/performance.test.ts package-lock.json
git commit -m "test: 添加性能决策工具与聚焦测试"
```

## Task 3: 提取静态数据与无状态内容区块

**Files:**
- Create: `e:\Project\Web_Project\SilentFall_Home\src\constants\site.tsx`
- Create: `e:\Project\Web_Project\SilentFall_Home\src\components\sections\AboutSection.tsx`
- Create: `e:\Project\Web_Project\SilentFall_Home\src\components\sections\OtherPagesSection.tsx`
- Create: `e:\Project\Web_Project\SilentFall_Home\src\components\sections\ContactSection.tsx`
- Modify: `e:\Project\Web_Project\SilentFall_Home\src\App.tsx`

- [ ] **Step 1: 提取静态常量**

```tsx
export const NAV_LINKS = [
  { label: '个人简介', href: '#about' },
  { label: '个人页面', href: '#other-pages' },
  { label: '联系我', href: '#contact' },
] as const;
```

- [ ] **Step 2: 提取内容区块组件**

```tsx
type ContactSectionProps = {
  copiedValue: string | null;
  onCopy: (value: string) => void;
};

export function ContactSection({ copiedValue, onCopy }: ContactSectionProps) {
  return <section id="contact">{/* 保留现有 JSX 结构 */}</section>;
}
```

- [ ] **Step 3: 在 `App.tsx` 中替换为组件引用**

```tsx
import { AboutSection } from './components/sections/AboutSection';
import { ContactSection } from './components/sections/ContactSection';
import { OtherPagesSection } from './components/sections/OtherPagesSection';
```

- [ ] **Step 4: 运行构建确认纯拆分无回归**

Run: `npm run build`
Expected: PASS

- [ ] **Step 5: 提交无状态拆分**

```bash
git add src/App.tsx src/constants/site.tsx src/components/sections
git commit -m "refactor: 提取站点常量与内容区块组件"
```

## Task 4: 提取设备能力与滚动控制 Hook

**Files:**
- Create: `e:\Project\Web_Project\SilentFall_Home\src\hooks\useViewportProfile.ts`
- Create: `e:\Project\Web_Project\SilentFall_Home\src\hooks\useSmoothScroll.ts`
- Modify: `e:\Project\Web_Project\SilentFall_Home\src\App.tsx`

- [ ] **Step 1: 提取设备能力 Hook**

```ts
import { useEffect, useState } from 'react';

export function useViewportProfile() {
  const [profile, setProfile] = useState({
    isCompactScreen: false,
    isCoarsePointer: false,
    prefersReducedMotion: false,
  });

  useEffect(() => {
    const compactMedia = window.matchMedia('(max-width: 640px)');
    const coarseMedia = window.matchMedia('(pointer: coarse)');
    const motionMedia = window.matchMedia('(prefers-reduced-motion: reduce)');

    const updateProfile = () => {
      setProfile({
        isCompactScreen: compactMedia.matches,
        isCoarsePointer: coarseMedia.matches,
        prefersReducedMotion: motionMedia.matches,
      });
    };

    updateProfile();
    compactMedia.addEventListener('change', updateProfile);
    coarseMedia.addEventListener('change', updateProfile);
    motionMedia.addEventListener('change', updateProfile);

    return () => {
      compactMedia.removeEventListener('change', updateProfile);
      coarseMedia.removeEventListener('change', updateProfile);
      motionMedia.removeEventListener('change', updateProfile);
    };
  }, []);

  return profile;
}
```

- [ ] **Step 2: 提取平滑滚动 Hook**

```ts
import { useEffect, useRef } from 'react';
import Lenis from 'lenis';
import { shouldEnableSmoothScroll, type AnimationLevel } from '../utils/performance';

export function useSmoothScroll(level: AnimationLevel) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    if (!shouldEnableSmoothScroll(level)) {
      return;
    }

    const lenis = new Lenis({
      duration: 1.05,
      lerp: 0.085,
      smoothWheel: true,
      wheelMultiplier: 0.95,
    });

    lenisRef.current = lenis;
    let rafId = 0;

    const raf = (time: number) => {
      lenis.raf(time);
      rafId = window.requestAnimationFrame(raf);
    };

    rafId = window.requestAnimationFrame(raf);

    return () => {
      window.cancelAnimationFrame(rafId);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [level]);

  return lenisRef;
}
```

- [ ] **Step 3: 接入 `App.tsx`，删除内联 Lenis 与设备判断实现**

```tsx
const profile = useViewportProfile();
const animationLevel = getAnimationLevel(profile);
const lenisRef = useSmoothScroll(animationLevel);
```

- [ ] **Step 4: 运行测试与构建**

Run: `npm test && npm run build`
Expected: PASS

- [ ] **Step 5: 提交 Hook 基础层**

```bash
git add src/App.tsx src/hooks/useViewportProfile.ts src/hooks/useSmoothScroll.ts src/utils/performance.ts
git commit -m "refactor: 提取设备能力与平滑滚动 Hook"
```

## Task 5: 提取 Hero 组件并移除高频 React 状态同步

**Files:**
- Create: `e:\Project\Web_Project\SilentFall_Home\src\hooks\useParallaxPointer.ts`
- Create: `e:\Project\Web_Project\SilentFall_Home\src\hooks\useHeroActivity.ts`
- Create: `e:\Project\Web_Project\SilentFall_Home\src\components\hero\SignatureLetters.tsx`
- Create: `e:\Project\Web_Project\SilentFall_Home\src\components\hero\LiquidGlassDefs.tsx`
- Create: `e:\Project\Web_Project\SilentFall_Home\src\components\hero\PerspectiveHeroSection.tsx`
- Modify: `e:\Project\Web_Project\SilentFall_Home\src\App.tsx`

- [ ] **Step 1: 提取鼠标视差 Hook**

```ts
import { useEffect } from 'react';
import { useMotionValue, useSpring } from 'framer-motion';

export function useParallaxPointer() {
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const springX = useSpring(pointerX, { stiffness: 70, damping: 20, mass: 0.8 });
  const springY = useSpring(pointerY, { stiffness: 70, damping: 20, mass: 0.8 });

  useEffect(() => {
    const handleMove = (event: MouseEvent) => {
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      pointerX.set((event.clientX - centerX) / centerX);
      pointerY.set((event.clientY - centerY) / centerY);
    };

    window.addEventListener('mousemove', handleMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMove);
  }, [pointerX, pointerY]);

  return { springX, springY };
}
```

- [ ] **Step 2: 添加 Hero 可见性 Hook，控制高成本动画启停**

```ts
import { useEffect, useState } from 'react';

export function useHeroActivity() {
  const [isHeroActive, setIsHeroActive] = useState(true);

  useEffect(() => {
    const onScroll = () => {
      setIsHeroActive(window.scrollY < window.innerHeight * 0.9);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return isHeroActive;
}
```

- [ ] **Step 3: 提取 Hero 组件并让顶层不再维护 `pointer` / `scrollProgress` 状态**

```tsx
<PerspectiveHeroSection
  animationLevel={animationLevel}
  isHeroActive={isHeroActive}
  springX={springX}
  springY={springY}
/>
```

- [ ] **Step 4: 删除 `App.tsx` 中这类高频同步代码**

```tsx
// 删除
const [pointer, setPointer] = useState<PointerState>({ x: 0, y: 0 });
const [scrollProgress, setScrollProgress] = useState(0);
```

- [ ] **Step 5: 运行构建确认 Hero 拆分可用**

Run: `npm run build`
Expected: PASS

- [ ] **Step 6: 提交 Hero 拆分**

```bash
git add src/App.tsx src/hooks/useParallaxPointer.ts src/hooks/useHeroActivity.ts src/components/hero
git commit -m "refactor: 拆分 Hero 组件并移除高频顶层状态"
```

## Task 6: 优化点阵画布与拖尾遮罩的运行成本

**Files:**
- Create: `e:\Project\Web_Project\SilentFall_Home\src\components\hero\DotGridCanvas.tsx`
- Create: `e:\Project\Web_Project\SilentFall_Home\src\hooks\usePerspectiveTrail.ts`
- Modify: `e:\Project\Web_Project\SilentFall_Home\src\components\hero\PerspectiveHeroSection.tsx`
- Modify: `e:\Project\Web_Project\SilentFall_Home\src\utils\performance.ts`

- [ ] **Step 1: 为点阵画布接入按等级切换的配置**

```ts
const { spacing, heightRatio, alphaSteps } = getDotGridConfig(animationLevel);
```

- [ ] **Step 2: 让画布只在 Hero 激活时绘制**

```tsx
if (!isHeroActive) {
  return null;
}
```

- [ ] **Step 3: 在画布内部使用 `ref` 保存最新输入，避免每帧因 props 变化触发复杂重算**

```tsx
const pointerRef = useRef({ x: 0, y: 0 });

useEffect(() => {
  pointerRef.current = latestPointer;
}, [latestPointer]);
```

- [ ] **Step 4: 提取拖尾 Hook，并确保离开 Hero 后自动停止动画循环**

```ts
if (
  Math.abs(trail.targetX - lastPoint.x) > 2 ||
  Math.abs(trail.targetY - lastPoint.y) > 2 ||
  trail.isInside
) {
  trail.animationId = requestAnimationFrame(animate);
} else {
  trail.animationId = 0;
}
```

- [ ] **Step 5: 运行构建并做一次手动冒烟检查**

Run: `npm run build`
Expected: PASS

Manual check:
- 首屏仍显示点阵背景
- 桌面端鼠标移动仍能看到遮罩追随
- 滚出首屏后 CPU 占用应低于优化前体感

- [ ] **Step 6: 提交高成本动画优化**

```bash
git add src/components/hero/DotGridCanvas.tsx src/hooks/usePerspectiveTrail.ts src/components/hero/PerspectiveHeroSection.tsx src/utils/performance.ts
git commit -m "perf: 优化点阵背景与拖尾遮罩运行成本"
```

## Task 7: 优化导航、全局样式与生产构建配置

**Files:**
- Create: `e:\Project\Web_Project\SilentFall_Home\src\components\layout\Navbar.tsx`
- Modify: `e:\Project\Web_Project\SilentFall_Home\src\index.css`
- Modify: `e:\Project\Web_Project\SilentFall_Home\src\App.tsx`
- Modify: `e:\Project\Web_Project\SilentFall_Home\vite.config.ts`
- Modify: `e:\Project\Web_Project\SilentFall_Home\index.html`

- [ ] **Step 1: 提取导航组件，减少 `App.tsx` 中的 UI 负担**

```tsx
type NavbarProps = {
  onNavigate: (href: string) => void;
};

export function Navbar({ onNavigate }: NavbarProps) {
  return <header>{/* 保留现有导航 JSX */}</header>;
}
```

- [ ] **Step 2: 为全局样式加入更稳妥的字体回退和滚动降级策略**

```css
:root {
  font-family: 'PingFangSC-Semibold', 'PingFang SC', 'Microsoft YaHei', sans-serif !important;
}

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

- [ ] **Step 3: 为生产构建补充分包配置**

```ts
build: {
  sourcemap: false,
  cssCodeSplit: true,
  rollupOptions: {
    output: {
      manualChunks: {
        react: ['react', 'react-dom'],
        motion: ['framer-motion'],
      },
    },
  },
}
```

- [ ] **Step 4: 在 `index.html` 中补充性能友好的基础元信息**

```html
<meta name="theme-color" content="#f5f5f3" />
<meta name="description" content="SilentFall 的个人主页，展示个人简介、外链页面与联系方式。" />
```

- [ ] **Step 5: 运行构建确认产物正常**

Run: `npm run build`
Expected: PASS，产物切分成功且无类型错误

- [ ] **Step 6: 提交样式与构建优化**

```bash
git add src/components/layout/Navbar.tsx src/index.css src/App.tsx vite.config.ts index.html
git commit -m "perf: 优化导航结构与生产构建配置"
```

## Task 8: 完成性能验证与结果文档

**Files:**
- Modify: `e:\Project\Web_Project\SilentFall_Home\docs\performance-report.md`

- [ ] **Step 1: 记录构建体积与验证命令**

````md
### 2. 构建验证

执行命令：

```bash
npm run build
```

记录内容：

- JS 产物体积
- CSS 产物体积
- 是否成功分包
````

- [ ] **Step 2: 按固定表头写入 Lighthouse 对比结果，并直接填入真实数值**

在 `docs/performance-report.md` 中新增 `### 3. Lighthouse 对比` 小节，并写入以下四列表格：

- 列名固定为 `指标`、`优化前`、`优化后`、`变化`
- 行固定为 `Performance`、`LCP`、`CLS`、`INP / 交互响应`
- 所有单元格必须填写本次实际测得的数据，不允许保留空值、示例值或占位文字
- `变化` 列使用明确的数值变化或文字说明，例如 `+18 分`、`下降 0.12s`

- [ ] **Step 3: 写明未覆盖项与解释**

```md
### 4. 说明

- 当前仓库为静态前端项目，无数据库与接口层代码
- 服务端压缩、HTTP/2、CDN 等内容将在宝塔部署文档中以建议配置形式提供
- 若 WebPageTest 无法执行，则以本地 Lighthouse 与 DevTools 结果作为主要依据
```

- [ ] **Step 4: 检查报告中不存在占位描述**

Run: 手动检查 `docs/performance-report.md`
Expected: 不保留空值、示例值或占位文案，全部替换为真实结果或明确说明无法获取的原因

- [ ] **Step 5: 提交性能报告**

```bash
git add docs/performance-report.md
git commit -m "docs: 补充性能优化验证报告"
```

## Task 9: 编写宝塔部署文档

**Files:**
- Create: `e:\Project\Web_Project\SilentFall_Home\docs\宝塔部署博客项目指南.md`

- [ ] **Step 1: 写入文档标题和适用范围**

```md
# 如何用服务器的宝塔面板将博客项目部署到你的服务器中

> 适用对象：将当前 `Vite + React` 静态前端项目部署到安装了宝塔面板的 Linux 服务器中。
```

- [ ] **Step 2: 写前置准备章节**

```md
## 一、前置准备

- 服务器建议：2 核 CPU、2 GB 内存、40 GB SSD 起步
- 操作系统建议：Ubuntu 22.04 LTS / Debian 12 / CentOS Stream 9
- 宝塔面板安装完成并完成首次登录初始化
- 已准备域名并完成实名认证与备案（如所在地区要求）
- 当前项目已执行 `npm run build` 并产出 `dist` 目录
```

- [ ] **Step 3: 写环境配置与上传部署章节**

```md
## 二、宝塔面板环境配置

推荐方案：

- Web 服务器：Nginx
- 当前项目类型：纯静态站点
- 站点根目录：`/www/wwwroot/你的域名`
```

- [ ] **Step 4: 写域名、安全、测试与维护章节**

```md
## 四、域名与安全配置

- 在域名服务商控制台添加 A 记录到服务器公网 IP
- 在宝塔站点设置中申请 `Let's Encrypt` 证书
- 开启“强制 HTTPS”
- 放行 `80` 和 `443` 端口
```

- [ ] **Step 5: 补充截图说明位**

```md
### 截图建议

- 这里建议截图“网站”列表页
- 这里建议截图“站点设置 -> SSL”页签
- 这里建议截图“文件”页面中网站根目录上传位置
```

- [ ] **Step 6: 通读并修正文档中的服务端表述**

Run: 手动检查 `docs/宝塔部署博客项目指南.md`
Expected: 明确区分“当前静态项目的真实部署步骤”和“未来接 Node / 数据库时的建议配置”

- [ ] **Step 7: 提交部署文档**

```bash
git add docs/宝塔部署博客项目指南.md
git commit -m "docs: 添加宝塔部署博客项目指南"
```

## Task 10: 最终联调与交付检查

**Files:**
- Modify: `e:\Project\Web_Project\SilentFall_Home\docs\performance-report.md`
- Modify: `e:\Project\Web_Project\SilentFall_Home\docs\宝塔部署博客项目指南.md`
- Modify: `e:\Project\Web_Project\SilentFall_Home\README.md`

- [ ] **Step 1: 运行完整验证命令**

Run: `npm test && npm run build`
Expected: PASS

- [ ] **Step 2: 获取最近修改文件诊断**

Run: 使用编辑器诊断检查以下文件
- `src/App.tsx`
- `src/components/hero/PerspectiveHeroSection.tsx`
- `src/components/hero/DotGridCanvas.tsx`
- `src/hooks/useSmoothScroll.ts`
- `vite.config.ts`

Expected: 无新增明显错误

- [ ] **Step 3: 更新 README 中的部署与优化说明**

```md
## 文档

- 性能优化报告：`docs/performance-report.md`
- 宝塔部署指南：`docs/宝塔部署博客项目指南.md`
```

- [ ] **Step 4: 做最终手动冒烟检查**

Manual check:
- 桌面端打开页面，首屏视觉风格保持稳定
- 导航点击可滚动到对应区块
- 外部链接正常打开
- 邮箱复制按钮可用
- 窄屏下页面无明显布局错乱

- [ ] **Step 5: 提交最终收尾修改**

```bash
git add README.md docs/performance-report.md docs/宝塔部署博客项目指南.md
git commit -m "chore: 完成性能优化交付收尾"
```

## 自检结果

- 规格覆盖：
  - 代码层性能优化：Task 1 到 Task 7
  - 性能验证与报告：Task 8
  - 宝塔部署文档：Task 9
  - 最终交付检查：Task 10
- 占位检查：
  - 计划中的代码步骤均给出明确文件、命令和示例代码
  - `docs/performance-report.md` 中允许先创建模板，但在 Task 8 Step 4 明确要求替换为真实值
- 一致性检查：
  - 性能模式统一为 `AnimationLevel`
  - 平滑滚动启用逻辑统一由 `shouldEnableSmoothScroll()` 决定
  - 点阵配置统一由 `getDotGridConfig()` 提供
