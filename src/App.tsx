import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  motion,
  type MotionValue,
  useMotionTemplate,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
} from 'framer-motion';
import Lenis from 'lenis';

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const NAV_LINKS = [
  { label: '个人简介', href: '#about' },
  { label: '个人页面', href: '#other-pages' },
  { label: '联系我', href: '#contact' },
] as const;

const ABOUT_POINTS = [
  {
    title: '日常罢了',
    description: '除了这些，我也会刷视频、听音乐、偶尔发呆，和大多数人差不多，因为我真的很闲。',
  },
  {
    title: '宅男',
       description: '一天里大部分时间都在电脑前，但也会偶尔站起来走走，假装自己很健康。',
  },
  {
    title: '人类？？？',
    description: '有时候会盯着一个界面发呆，然后才意识到已经过去好几分钟。',
  },
] as const;

const OTHER_PAGES = [
  {
    id: 'github',
    title: 'GitHub',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
      </svg>
    ),
    href: 'https://github.com/SilentFall0814',
  },
  {
    id: 'blog',
    title: '个人博客',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5">
        <path d="M4 4h16a1 1 0 011 1v14a1 1 0 01-1 1H4a1 1 0 01-1-1V5a1 1 0 011-1z" />
        <path d="M8 8h8M8 12h5" strokeLinecap="round" />
      </svg>
    ),
    href: 'https://LJB666.xyz',
  },
  {
    id: 'bilibili',
    title: '哔哩哔哩',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
        <path d="M17.813 4.653h.854c1.51.054 2.769.578 3.773 1.574 1.004.995 1.524 2.249 1.56 3.76v7.36c-.036 1.51-.556 2.769-1.56 3.773s-2.262 1.524-3.773 1.56H5.333c-1.51-.036-2.769-.556-3.773-1.56S.036 18.858 0 17.347v-7.36c.036-1.511.556-2.765 1.56-3.76 1.004-.996 2.262-1.52 3.773-1.574h.774l-1.174-1.12a1.234 1.234 0 01-.373-.906c0-.356.124-.658.373-.907l.027-.027c.267-.249.573-.373.92-.373.347 0 .653.124.92.373L9.653 4.44c.071.071.134.142.187.213h4.267a.836.836 0 01.16-.213l2.853-2.747c.267-.249.573-.373.92-.373.347 0 .662.151.929.4.267.249.391.551.391.907 0 .355-.124.657-.373.906L17.813 4.653zM5.333 7.24c-.746.018-1.373.276-1.88.773-.506.498-.769 1.13-.786 1.894v7.52c.017.764.28 1.395.786 1.893.507.498 1.134.756 1.88.773h13.334c.746-.017 1.373-.275 1.88-.773.506-.498.769-1.129.786-1.893v-7.52c-.017-.765-.28-1.396-.786-1.894-.507-.497-1.134-.755-1.88-.773H5.333zM8 11.107c.373 0 .684.124.933.373.25.249.383.569.4.96v1.173c-.017.391-.15.711-.4.96-.249.25-.56.374-.933.374s-.684-.125-.933-.374c-.25-.249-.383-.569-.4-.96V12.44c.017-.391.15-.711.4-.96.249-.249.56-.373.933-.373zm8 0c.373 0 .684.124.933.373.25.249.383.569.4.96v1.173c-.017.391-.15.711-.4.96-.249.25-.56.374-.933.374s-.684-.125-.933-.374c-.25-.249-.383-.569-.4-.96V12.44c.017-.391.15-.711.4-.96.249-.249.56-.373.933-.373z" />
      </svg>
    ),
    href: 'https://space.bilibili.com/3493079350774423',
  },
  {
    id: 'douyin',
    title: '抖音',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
        <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 0010.86 4.46V13a8.28 8.28 0 005.58 2.15V11.7a4.83 4.83 0 01-3.77-1.63V6.69h3.77z" />
      </svg>
    ),
    href: 'https://www.douyin.com/user/MS4wLjABAAAA7aQIXbw_TC2NVqsX2amf0oxu7f5J-sTd9cu4_QGK-D9KTGJyPfYZDYBwHHYTpET_?from_tab_name=main',
  },
] as const;

const CONTACT_ITEMS = [
  {
    label: '163网易邮箱',
    value: 'LJB110814@163.com',
    description: '你有什么想和我单独说的呢？欢迎投稿！',
    href: 'mailto:LJB110814@163.com',
  },
  {
    label: 'QQ邮箱',
    value: 'liangjunboljb@qq.com',
    description: '163网易邮箱未及时回复时可发这里',
    href: 'mailto:liangjunboljb@qq.com',
  },
] as const;


type PointerState = {
  x: number;
  y: number;
};

function useViewportProfile() {
  const [profile, setProfile] = useState(() => {
    if (typeof window === 'undefined') {
      return {
        isCompactScreen: false,
        isCoarsePointer: false,
        prefersReducedMotion: false,
      };
    }

    return {
      isCompactScreen: window.matchMedia('(max-width: 640px)').matches,
      isCoarsePointer: window.matchMedia('(pointer: coarse)').matches,
      prefersReducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    };
  });

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

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
    window.addEventListener('resize', updateProfile);

    return () => {
      compactMedia.removeEventListener('change', updateProfile);
      coarseMedia.removeEventListener('change', updateProfile);
      motionMedia.removeEventListener('change', updateProfile);
      window.removeEventListener('resize', updateProfile);
    };
  }, []);

  return profile;
}

function mapPointerRange(value: number, output: readonly [number, number]) {
  const progress = (value + 1) / 2;
  return output[0] + (output[1] - output[0]) * progress;
}

// 将鼠标位移转换为平滑的视差信号，避免交互过硬。
function useParallaxPointer() {
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const springX = useSpring(pointerX, { stiffness: 70, damping: 20, mass: 0.8 });
  const springY = useSpring(pointerY, { stiffness: 70, damping: 20, mass: 0.8 });

  useEffect(() => {
    const handleMove = (event: MouseEvent) => {
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      const nextX = (event.clientX - centerX) / centerX;
      const nextY = (event.clientY - centerY) / centerY;

      pointerX.set(nextX);
      pointerY.set(nextY);
    };

    const handleLeave = () => {
      pointerX.set(0);
      pointerY.set(0);
    };

    window.addEventListener('mousemove', handleMove, { passive: true });
    window.addEventListener('mouseleave', handleLeave);

    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseleave', handleLeave);
    };
  }, [pointerX, pointerY]);

  return { springX, springY };
}

// 使用 canvas 绘制动态点阵，并叠加呼吸漂移、鼠标视差和滚动层级变化。
function DotGridCanvas({ pointer, scrollProgress }: { pointer: PointerState; scrollProgress: number }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const pointerRef = useRef(pointer);
  const scrollRef = useRef(scrollProgress);

  pointerRef.current = pointer;
  scrollRef.current = scrollProgress;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const context = canvas.getContext('2d');
    if (!context) {
      return;
    }

    let animationId = 0;
    let width = 0;
    let height = 0;
    let dpr = 1;
    const spacing = 28;

    const resize = () => {
      dpr = window.devicePixelRatio || 1;
      width = window.innerWidth;
      height = window.innerHeight * 1.3;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const render = (time: number) => {
      const currentPointer = pointerRef.current;
      const currentScroll = scrollRef.current;
      const driftX = Math.sin(time * 0.00018) * 8 - currentPointer.x * 14;
      const driftY = Math.cos(time * 0.00015) * 10 - currentPointer.y * 14 + currentScroll * 40;
      const pulse = 0.72 + Math.sin(time * 0.0011) * 0.08;

      context.clearRect(0, 0, width, height);

      // 按透明度分桶，减少 fillStyle 切换次数
      const buckets = new Map<number, Array<[number, number, number]>>();

      for (let x = -spacing; x <= width + spacing; x += spacing) {
        for (let y = -spacing; y <= height + spacing; y += spacing) {
          const px = x + driftX * ((x / width) * 0.4 + 0.8);
          const py = y + driftY * ((y / height) * 0.2 + 0.8);
          const wave = Math.sin((x + y) * 0.018 + time * 0.001) * 0.32;
          const radius = 0.95 + wave * 0.2 + currentScroll * 0.28;
          const alpha = Math.max(0.08, 0.28 + pulse * 0.2 + wave * 0.08);
          // 将 alpha 量化到 0.02 精度以减少桶数
          const key = Math.round(alpha * 50);
          let bucket = buckets.get(key);
          if (!bucket) {
            bucket = [];
            buckets.set(key, bucket);
          }
          bucket.push([px, py, radius]);
        }
      }

      // 按桶批量绘制
      for (const [key, points] of buckets) {
        const alpha = key / 50;
        context.fillStyle = `rgba(185,185,185,${alpha})`;
        for (let i = 0; i < points.length; i++) {
          const [px, py, r] = points[i];
          // 用 fillRect 替代 arc，小点视觉差异极小但性能更好
          const d = r * 2;
          context.fillRect(px - r, py - r, d, d);
        }
      }

      animationId = window.requestAnimationFrame(render);
    };

    resize();
    animationId = window.requestAnimationFrame(render);
    window.addEventListener('resize', resize);

    return () => {
      window.cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <motion.canvas
      ref={canvasRef}
      className="absolute inset-0 h-[130vh] w-full opacity-0"
      animate={{ opacity: 1 }}
      transition={{ duration: 1.2, ease: EASE }}
      style={{
        x: -pointer.x * 16,
        y: -pointer.y * 12 + scrollProgress * 50,
      }}
    />
  );
}

// 顶部导航根据滚动逐渐显现磨砂背景，贴近作品集首屏的悬浮感。
function LiquidGlassDefs() {
  return (
    <svg aria-hidden="true" className="pointer-events-none absolute h-0 w-0 overflow-hidden">
      <defs>
        <filter id="liquid-glass-nav" x="-20%" y="-20%" width="140%" height="140%">
          <feTurbulence type="fractalNoise" baseFrequency="0.009 0.02" numOctaves="3" seed="7" result="noise" />
          <feGaussianBlur in="noise" stdDeviation="2.4" result="softNoise" />
          <feDisplacementMap
            in="SourceGraphic"
            in2="softNoise"
            scale="22"
            xChannelSelector="R"
            yChannelSelector="B"
          />
        </filter>
      </defs>
    </svg>
  );
}

function Navbar({
  onNavigate,
}: {
  onNavigate: (href: string) => void;
}) {
  const { scrollY } = useScroll();
  const backgroundOpacity = useTransform(scrollY, [0, 80], [0.14, 0.24]);
  const borderOpacity = useTransform(scrollY, [0, 80], [0.34, 0.48]);
  const blur = useTransform(scrollY, [0, 80], [20, 28]);
  const shadowOpacity = useTransform(scrollY, [0, 80], [0.08, 0.12]);
  const background = useMotionTemplate`rgba(255, 255, 255, ${backgroundOpacity})`;
  const borderColor = useMotionTemplate`rgba(255, 255, 255, ${borderOpacity})`;
  const liquidBackdropFilter = useMotionTemplate`url(#liquid-glass-nav) blur(${blur}px) saturate(1.22) brightness(1.08) contrast(1.04)`;
  const liquidShadow = useMotionTemplate`0 18px 50px rgba(0, 0, 0, ${shadowOpacity})`;

  return (
    <motion.header className="fixed inset-x-0 top-0 z-40 px-3 py-3 sm:px-4 md:px-8 md:py-4">
      <motion.div
        className="relative mx-auto flex max-w-[1320px] flex-col gap-3 overflow-hidden rounded-[1.75rem] border px-3 py-3 sm:px-4 md:flex-row md:items-center md:justify-between md:rounded-full md:px-6"
        style={{
          background,
          borderColor,
          backdropFilter: liquidBackdropFilter,
          WebkitBackdropFilter: liquidBackdropFilter,
          boxShadow: liquidShadow,
        }}
      >
        <div
          className="pointer-events-none absolute inset-[1px] rounded-full"
          style={{
            background:
              'linear-gradient(180deg, rgba(255, 255, 255, 0.52) 0%, rgba(255, 255, 255, 0.16) 24%, rgba(255, 255, 255, 0.07) 58%, rgba(255, 255, 255, 0.04) 100%)',
          }}
        />
        <div
          className="pointer-events-none absolute inset-0 rounded-full"
          style={{
            boxShadow:
              'inset 0 1px 0 rgba(255, 255, 255, 0.98), inset 0 -1px 0 rgba(255, 255, 255, 0.42), inset 0 0 24px rgba(255, 255, 255, 0.08)',
          }}
        />
        <motion.div
          className="pointer-events-none absolute left-[7%] top-[1px] h-[62%] w-[30%] rounded-full opacity-95"
          animate={{
            x: [0, 26, 8, 18, 0],
            y: [0, 2, -1, 1, 0],
            scaleX: [1, 1.08, 0.98, 1.04, 1],
          }}
          transition={{
            duration: 8.5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          style={{
            background:
              'radial-gradient(circle at center, rgba(255, 255, 255, 0.7) 0%, rgba(255, 255, 255, 0.24) 34%, rgba(255, 255, 255, 0.08) 54%, rgba(255, 255, 255, 0) 76%)',
            filter: 'blur(10px)',
          }}
        />
        <motion.div
          className="pointer-events-none absolute left-[34%] top-[8px] h-[36%] w-[18%] rounded-full opacity-55 mix-blend-screen"
          animate={{
            x: [0, -18, 10, -8, 0],
            y: [0, 1, -2, 1, 0],
            scale: [1, 1.06, 0.96, 1.03, 1],
          }}
          transition={{
            duration: 6.8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          style={{
            background:
              'radial-gradient(circle at center, rgba(255, 255, 255, 0.82) 0%, rgba(255, 255, 255, 0.2) 40%, rgba(255, 255, 255, 0) 76%)',
            filter: 'blur(7px)',
          }}
        />
        <motion.div
          className="pointer-events-none absolute right-[9%] bottom-[1px] h-[48%] w-[24%] rounded-full opacity-62"
          animate={{
            x: [0, -18, -6, -14, 0],
            y: [0, -1, 2, 0, 0],
            scaleX: [1, 0.94, 1.06, 0.98, 1],
          }}
          transition={{
            duration: 9.2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          style={{
            background:
              'radial-gradient(circle at center, rgba(255, 255, 255, 0.42) 0%, rgba(255, 255, 255, 0.12) 44%, rgba(255, 255, 255, 0) 74%)',
            filter: 'blur(12px)',
          }}
        />
        <div className="relative z-10 text-[11px] font-black tracking-[0.22em] text-ink sm:text-sm sm:tracking-[0.28em]">
          SilentFall
        </div>
        <nav className="relative z-10 flex w-full items-center gap-2 overflow-x-auto pb-1 text-[12px] font-medium text-ink/80 md:w-auto md:justify-end md:gap-8 md:overflow-visible md:pb-0 md:text-[13px]">
          {NAV_LINKS.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={(event) => {
                event.preventDefault();
                onNavigate(item.href);
              }}
              className="shrink-0 rounded-full border border-black/8 bg-white/40 px-3 py-2 text-center backdrop-blur-sm transition duration-300 ease-expo hover:border-black/16 hover:bg-white/70 hover:text-ink md:rounded-none md:border-0 md:bg-transparent md:px-0 md:py-0 md:backdrop-blur-none"
            >
              {item.label}
            </a>
          ))}
        </nav>
      </motion.div>
    </motion.header>
  );
}

function LeoLetter({
  char,
  springX,
  springY,
  offsetX,
  offsetY,
  rotateRange,
  delay,
  className,
}: {
  char: string;
  springX: MotionValue<number>;
  springY: MotionValue<number>;
  offsetX: readonly [number, number];
  offsetY: readonly [number, number];
  rotateRange: readonly [number, number];
  delay: number;
  className?: string;
}) {
  const letterX = useTransform(springX, (value) => mapPointerRange(value, offsetX));
  const letterY = useTransform(springY, (value) => mapPointerRange(value, offsetY));
  const letterRotate = useTransform(springX, (value) => mapPointerRange(value, rotateRange));
  const letterShadow = useMotionTemplate`${letterX}px ${letterY}px 28px rgba(0, 0, 0, 0.08)`;

  return (
    <motion.span
      className={className ?? 'inline-block text-[clamp(3.3rem,9vw,8.1rem)] font-light italic tracking-[-0.08em] text-black'}
      variants={{
        initial: { opacity: 0, scale: 0.8, rotate: -11, y: 8 },
        enter: { opacity: 1, scale: 1, rotate: -5, y: 0 },
        hover: { scale: 1.05 },
      }}
      transition={{ delay, duration: 0.9, ease: EASE }}
      style={{
        x: letterX,
        y: letterY,
        rotate: letterRotate,
        textShadow: letterShadow,
        transform: 'translateZ(54px)',
      }}
    >
      {char}
    </motion.span>
  );
}

// 将名字拆成独立字符，保留层次感更强的视差动效。
function SignatureLetters({
  springX,
  springY,
}: {
  springX: MotionValue<number>;
  springY: MotionValue<number>;
}) {
  const letters = [
    { char: 'S', offsetX: [-18, 12], offsetY: [-10, 8], rotate: [-6.8, -3.2], delay: 0.5 },
    { char: 'i', offsetX: [-12, 9], offsetY: [-8, 7], rotate: [-6.1, -3.6], delay: 0.55 },
    { char: 'l', offsetX: [-4, 5], offsetY: [-5, 5], rotate: [-5.2, -4.3], delay: 0.65 },
    { char: 'e', offsetX: [6, -7], offsetY: [5, -6], rotate: [-4.4, -5.2], delay: 0.75 },
    { char: 'n', offsetX: [14, -12], offsetY: [8, -8], rotate: [-3.6, -6.4], delay: 0.85 },
    { char: 't', offsetX: [14, -12], offsetY: [8, -8], rotate: [-3.6, -6.4], delay: 0.95 },
    { char: 'F', offsetX: [14, -12], offsetY: [8, -8], rotate: [-3.6, -6.4], delay: 1.05 },
    { char: 'a', offsetX: [14, -12], offsetY: [8, -8], rotate: [-3.6, -6.4], delay: 1.15 },
    { char: 'l', offsetX: [14, -12], offsetY: [8, -8], rotate: [-3.6, -6.4], delay: 1.25 },
    { char: 'l', offsetX: [14, -12], offsetY: [8, -8], rotate: [-3.6, -6.4], delay: 1.35 },
  ] as const;

  return (
    <motion.span
      className="inline-flex origin-center cursor-default items-end gap-[0.05em] sm:gap-[0.08em]"
      whileHover="hover"
      initial="initial"
      animate="enter"
    >
      {letters.map((letter, idx) => (
        <LeoLetter
          key={`${letter.char}-${idx}`}
          char={letter.char}
          springX={springX}
          springY={springY}
          offsetX={letter.offsetX}
          offsetY={letter.offsetY}
          rotateRange={letter.rotate}
          delay={letter.delay}
          className="inline-block text-[clamp(2.5rem,15vw,5rem)] font-light italic tracking-[-0.05em] text-black sm:text-[clamp(2.2rem,5vw,5rem)]"
        />
      ))}
    </motion.span>
  );
}

// ── 透视跟随动画组件 ──────────────────────────────────────────────
// 灵感来自小米 MIMO 官网，双层文字矩阵 + 鼠标跟随 clip-path 遮罩。
// 底层：浅色水印 + 中文标题；上层：黑色背景 + 白色水印 + 英文标题。
// 鼠标移入时以圆形/椭圆遮罩显示上层内容，快速移动时椭圆拉伸跟随。

const TRAIL_COUNT = 6;
const CIRCLE_RADIUS = 220;
const POLYGON_SEGMENTS = 24;

function usePerspectiveTrail() {
  const trailRef = useRef({
    targetX: -300,
    targetY: -300,
    trailPoints: Array.from({ length: TRAIL_COUNT }, () => ({ x: -300, y: -300 })),
    animationId: 0,
    isInside: false,
  });
  const clipPathRef = useRef('circle(0px at -300px -300px)');
  const overlayRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  // 检测触摸设备
  useEffect(() => {
    setIsTouchDevice(
      window.matchMedia('(hover: none), (pointer: coarse)').matches ||
      'ontouchstart' in window ||
      navigator.maxTouchPoints > 0,
    );
  }, []);

  // 动画循环
  const animate = useCallback(() => {
    const trail = trailRef.current;

    for (let t = 0; t < TRAIL_COUNT; t++) {
      const prevX = t === 0 ? trail.targetX : trail.trailPoints[t - 1].x;
      const prevY = t === 0 ? trail.targetY : trail.trailPoints[t - 1].y;
      const damping = 0.7 - 0.04 * t;
      trail.trailPoints[t].x += (prevX - trail.trailPoints[t].x) * damping;
      trail.trailPoints[t].y += (prevY - trail.trailPoints[t].y) * damping;
    }

    const head = trail.trailPoints[0];
    const tail = trail.trailPoints[5];
    const diffX = head.x - tail.x;
    const diffY = head.y - tail.y;
    const distSq = diffX * diffX + diffY * diffY;

    let path: string;
    if (distSq < 100) {
      // 距离小于10px时用圆形
      path = `circle(${CIRCLE_RADIUS}px at ${head.x}px ${head.y}px)`;
    } else {
      const angle = Math.atan2(diffY, diffX);
      const totalPoints = (POLYGON_SEGMENTS + 1) * 2;
      const parts = new Array<string>(totalPoints);
      let idx = 0;
      for (let i = 0; i <= POLYGON_SEGMENTS; i++) {
        const theta = angle - Math.PI / 2 + (Math.PI * i) / POLYGON_SEGMENTS;
        parts[idx++] = `${head.x + CIRCLE_RADIUS * Math.cos(theta)}px ${head.y + CIRCLE_RADIUS * Math.sin(theta)}px`;
      }
      for (let i = 0; i <= POLYGON_SEGMENTS; i++) {
        const theta = angle + Math.PI / 2 + (Math.PI * i) / POLYGON_SEGMENTS;
        parts[idx++] = `${tail.x + CIRCLE_RADIUS * Math.cos(theta)}px ${tail.y + CIRCLE_RADIUS * Math.sin(theta)}px`;
      }
      path = `polygon(${parts.join(', ')})`;
    }

    clipPathRef.current = path;
    if (overlayRef.current) {
      overlayRef.current.style.clipPath = path;
    }

    const lastPoint = trail.trailPoints[TRAIL_COUNT - 1];
    if (
      Math.abs(trail.targetX - lastPoint.x) > 2 ||
      Math.abs(trail.targetY - lastPoint.y) > 2 ||
      trail.isInside
    ) {
      trail.animationId = requestAnimationFrame(animate);
    } else {
      trail.animationId = 0;
    }
  }, []);

  const onMouseEnter = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (isTouchDevice) return;
    containerRef.current = e.currentTarget;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const trail = trailRef.current;
    trail.targetX = x;
    trail.targetY = y;
    trail.isInside = true;
    for (let i = 0; i < TRAIL_COUNT; i++) {
      trail.trailPoints[i] = { x, y };
    }
    if (!trail.animationId) {
      trail.animationId = requestAnimationFrame(animate);
    }
  }, [isTouchDevice, animate]);

  const onMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (isTouchDevice) return;
    // 每次都获取最新 rect，滚动后位置会变化
    const rect = (containerRef.current ?? e.currentTarget).getBoundingClientRect();
    trailRef.current.targetX = e.clientX - rect.left;
    trailRef.current.targetY = e.clientY - rect.top;
    const trail = trailRef.current;
    if (!trail.animationId) {
      trail.animationId = requestAnimationFrame(animate);
    }
  }, [isTouchDevice, animate]);

  const onMouseLeave = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (isTouchDevice) return;
    const trail = trailRef.current;
    trail.isInside = false;
    const rect = e.currentTarget.getBoundingClientRect();
    containerRef.current = null;
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    let targetX = x;
    let targetY = y;
    if (x <= 0) targetX = -400;
    else if (x >= rect.width) targetX = rect.width + 400;
    if (y <= 0) targetY = -400;
    else if (y >= rect.height) targetY = rect.height + 400;
    trail.targetX = targetX;
    trail.targetY = targetY;
    if (!trail.animationId) {
      trail.animationId = requestAnimationFrame(animate);
    }
  }, [isTouchDevice, animate]);

  return { overlayRef, onMouseEnter, onMouseMove, onMouseLeave, isTouchDevice };
}

function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="mx-auto max-w-3xl text-center">
      <p className="text-[11px] uppercase tracking-[0.28em] text-black/35 sm:text-xs sm:tracking-[0.45em]">{eyebrow}</p>
      <h2 className="mt-4 text-[1.9rem] font-semibold tracking-[-0.05em] text-black sm:mt-5 sm:text-3xl md:text-5xl">
        {title}
      </h2>
      {description ? (
        <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 tracking-[0.08em] text-black/50 sm:mt-6 sm:leading-8 md:text-base md:tracking-[0.12em]">
          {description}
        </p>
      ) : null}
    </div>
  );
}

// ── 首屏透视跟随 Hero 区域 ──────────────────────────────────────
function PerspectiveHeroSection({
  shouldReduceMotion,
  pointer,
  scrollProgress,
  heroY,
  heroScale,
  titleX,
  titleY,
  heroRotateX,
  heroRotateY,
  eyebrowX,
  eyebrowY,
  helloX,
  helloY,
  helloShadow,
  subtitleX,
  subtitleY,
  springX,
  springY,
}: {
  shouldReduceMotion: boolean;
  pointer: PointerState;
  scrollProgress: number;
  heroY: MotionValue<number>;
  heroScale: MotionValue<number>;
  titleX: MotionValue<number>;
  titleY: MotionValue<number>;
  heroRotateX: MotionValue<number>;
  heroRotateY: MotionValue<number>;
  eyebrowX: MotionValue<number>;
  eyebrowY: MotionValue<number>;
  helloX: MotionValue<number>;
  helloY: MotionValue<number>;
  helloShadow: MotionValue<string>;
  subtitleX: MotionValue<number>;
  subtitleY: MotionValue<number>;
  springX: MotionValue<number>;
  springY: MotionValue<number>;
}) {
  const { overlayRef, onMouseEnter, onMouseMove, onMouseLeave, isTouchDevice } = usePerspectiveTrail();

  return (
    <section
      className="relative flex min-h-[100svh] items-center justify-center overflow-hidden px-4 pt-24 sm:px-6 md:min-h-screen"
      onMouseEnter={onMouseEnter}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
    >
      {/* 背景渐变 */}
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.84),rgba(245,245,243,0.96))]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.65),rgba(245,245,243,0.92)_58%,rgba(237,237,234,1))]" />

      {/* 底层：点阵画布 */}
      {!shouldReduceMotion ? <DotGridCanvas pointer={pointer} scrollProgress={scrollProgress} /> : null}

      {/* 底层中文标题 */}
      <motion.div
        className="relative z-10 mx-auto flex w-full max-w-[1320px] flex-col items-center justify-center py-8 text-center sm:py-10"
        style={{
          y: heroY,
          scale: heroScale,
        }}
      >
        <motion.div
          className="flex flex-col items-center justify-center"
          style={{
            x: titleX,
            y: titleY,
            rotateX: heroRotateX,
            rotateY: heroRotateY,
            transformPerspective: 1400,
            transformStyle: 'preserve-3d',
          }}
        >
          <motion.p
            className="mb-4 text-[11px] font-semibold uppercase tracking-[0.42em] text-black/35 sm:mb-5 sm:text-[12px] sm:tracking-[0.65em] md:text-[13px]"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55, duration: 0.8, ease: EASE }}
            style={{ x: eyebrowX, y: eyebrowY }}
          >
            欢迎来到我的个人主页
          </motion.p>

          <div className="flex flex-col items-center justify-center gap-3 text-center leading-none sm:flex-row sm:flex-wrap sm:items-end sm:gap-x-4">
            <motion.span
              className="text-[clamp(2.6rem,16vw,8.8rem)] font-black uppercase tracking-[-0.06em] text-black sm:text-[clamp(3.4rem,10vw,8.8rem)] sm:tracking-[-0.08em]"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8, ease: EASE }}
              style={{ x: helloX, y: helloY, textShadow: helloShadow, transform: 'translateZ(24px)' }}
            >
              HELLO,I&apos;M
            </motion.span>

            <SignatureLetters springX={springX} springY={springY} />
          </div>

          <motion.p
            className="mt-7 max-w-[22rem] text-center text-[11px] leading-6 tracking-[0.22em] text-[#888888] sm:mt-8 sm:max-w-none sm:text-[12px] sm:tracking-[0.35em] md:text-[14px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1, duration: 0.75, ease: EASE }}
            style={{ x: subtitleX, y: subtitleY }}
          >
            SilentFall | 14岁 | 中国-北京
          </motion.p>
        </motion.div>
      </motion.div>

      {/* 上层：黑色背景 + 英文标题，通过 clip-path 遮罩显示 */}
      <div
        ref={overlayRef}
        className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center bg-black"
        style={{ clipPath: 'circle(0px at -300px -300px)', willChange: 'clip-path' }}
      >
        <motion.div
          className="relative z-10 text-center"
          style={{
            x: titleX,
            y: titleY,
            rotateX: heroRotateX,
            rotateY: heroRotateY,
            transformPerspective: 1400,
            transformStyle: 'preserve-3d',
          }}
        >
          <motion.p
            className="mb-4 text-[11px] font-semibold uppercase tracking-[0.42em] text-white/40 sm:mb-5 sm:text-[12px] sm:tracking-[0.65em] md:text-[13px]"
            style={{ x: eyebrowX, y: eyebrowY }}
          >
            WELCOME TO MY HOMEPAGE
          </motion.p>
          <motion.h1
            className="text-[clamp(2.6rem,16vw,8.8rem)] font-black uppercase tracking-[-0.06em] text-white sm:text-[clamp(3.4rem,10vw,8.8rem)] sm:tracking-[-0.08em]"
            style={{ x: helloX, y: helloY, transform: 'translateZ(24px)' }}
          >
            HELLO, I&apos;M
          </motion.h1>
          <motion.h1
            className="mt-2 text-[clamp(2.5rem,15vw,5rem)] font-light italic tracking-[-0.05em] text-white sm:text-[clamp(2.2rem,5vw,5rem)]"
            style={{ x: helloX, y: helloY }}
          >
            SilentFall
          </motion.h1>
          <motion.p
            className="mt-7 text-[11px] tracking-[0.22em] text-white/50 sm:text-[12px] sm:tracking-[0.35em] md:text-[14px]"
            style={{ x: subtitleX, y: subtitleY }}
          >
            SilentFall | 14 | Beijing, China
          </motion.p>
        </motion.div>
      </div>

      {/* 触摸设备提示 */}
      {isTouchDevice ? null : (
        <div className="absolute bottom-8 left-1/2 z-30 -translate-x-1/2 text-[10px] tracking-[0.3em] text-black/20 sm:text-[11px]">
          移动鼠标探索
        </div>
      )}
    </section>
  );
}

function isInternalHashLink(href: string) {
  return href.startsWith('#');
}

// 第二屏开始进入正文内容，建立清晰的个人介绍与能力概览。
function AboutSection() {
  return (
    <section id="about" className="relative overflow-hidden px-4 py-20 sm:px-6 md:py-32">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.95),rgba(245,245,243,0.8)_48%,rgba(240,240,238,0.9))]" />
      <div className="relative mx-auto max-w-[1200px]">
        <SectionHeading
          eyebrow="个人简介"
          title="你好！我是SilentFall"
          description="我是一名学生，一个试图把脑子里的奇怪想法变成软件的人..."
        />

        <div className="mt-12 grid gap-5 sm:mt-14 sm:gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-[1.75rem] border border-black/8 bg-white/70 p-6 shadow-soft backdrop-blur-xs sm:p-8 md:rounded-[2rem] md:p-10">
            <p className="text-sm font-semibold tracking-[0.3em] text-black/30">关于我</p>
            <h3 className="mt-5 text-[1.75rem] font-semibold tracking-[-0.04em] text-black sm:text-2xl md:text-4xl">
              一个社恐、宅男、一个有着非常非常多的奇怪想法的人类
            </h3>
            <p className="mt-6 text-sm leading-8 text-black/60 md:text-base">
              平时喜欢待在电脑前折腾点东西，有时候是写点小程序，有时候只是单纯地把桌面整理得更顺眼一点。
            </p>
            <p className="mt-6 text-sm leading-8 text-black/60 md:text-base">
              我对“为什么会这样”这种问题有点执念，比如会突然想做一个网页来介绍自己，然后就真的来做了个网页。
            </p>
            <p className="mt-6 text-sm leading-8 text-black/60 md:text-base">
              我的一些标签：
            </p>
            <div className="mt-8 flex flex-wrap gap-2.5 text-sm text-black/60 sm:gap-3">
              <span className="rounded-full border border-black/10 px-4 py-2">宅男</span>
              <span className="rounded-full border border-black/10 px-4 py-2">社恐</span>
              <span className="rounded-full border border-black/10 px-4 py-2">抽象</span>
              <span className="rounded-full border border-black/10 px-4 py-2">伪人</span>
            </div>
          </div>

          <div className="grid gap-4">
            {ABOUT_POINTS.map((item) => (
              <article
                key={item.title}
                className="rounded-[1.5rem] border border-black/8 bg-black/[0.03] p-5 transition duration-300 ease-expo hover:-translate-y-1 hover:bg-white/70 sm:rounded-[1.75rem] sm:p-6"
              >
                <p className="text-sm font-semibold tracking-[0.22em] text-black/35">{item.title}</p>
                <p className="mt-4 text-sm leading-7 text-black/60">{item.description}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function OtherPagesSection() {
  return (
    <section id="other-pages" className="relative px-4 py-20 sm:px-6 md:py-32">
      <div className="mx-auto max-w-[800px]">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-[11px] tracking-[0.28em] text-black/35 sm:text-xs sm:tracking-[0.45em]">个人页面</p>
          <h2 className="mt-4 text-[1.9rem] font-semibold tracking-[-0.05em] text-black sm:mt-5 sm:text-3xl md:text-5xl">
            我的个人页面
          </h2>
        </div>

        <div className="mt-12 flex flex-wrap items-center justify-center gap-3 sm:mt-14 sm:gap-4">
          {OTHER_PAGES.map((page) => (
            <a
              key={page.id}
              href={page.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2.5 rounded-xl border border-black/10 bg-black/[0.03] px-5 py-3 text-sm font-medium text-black/70 transition duration-300 ease-expo hover:border-black/20 hover:bg-white hover:text-black sm:px-6 sm:py-3.5"
            >
              {page.icon}
              <span>{page.title}</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

function ContactSection({
  copiedValue,
  onCopy,
}: {
  copiedValue: string | null;
  onCopy: (value: string) => void;
}) {
  return (
    <section id="contact" className="relative px-4 pb-14 pt-20 sm:px-6 md:pb-24 md:pt-28">
      <div className="mx-auto max-w-[1200px] rounded-[1.75rem] border border-black/6 bg-white/60 px-5 py-10 shadow-soft backdrop-blur-xs sm:px-8 sm:py-12 md:rounded-[2rem] md:px-10 md:py-16">
        <SectionHeading
          eyebrow="联系我"
          title="这里是主包的邮箱地址哦！"
          description="你有什么想和我单独说的呢？欢迎投稿！"
        />

        <div className="mt-12 grid gap-5 md:grid-cols-2">
          {CONTACT_ITEMS.map((item) => (
            <article key={item.value} className="rounded-[1.5rem] border border-black/8 bg-black/[0.03] p-5 sm:rounded-[1.75rem] sm:p-6">
              <p className="text-sm font-semibold tracking-[0.24em] text-black/35">{item.label}</p>
              <a href={item.href} className="mt-4 block break-all text-base font-semibold text-black transition hover:opacity-75 sm:text-lg">
                {item.value}
              </a>
              <p className="mt-3 text-sm leading-7 text-black/58">{item.description}</p>
              <button
                type="button"
                onClick={() => onCopy(item.value)}
                className="mt-5 w-full rounded-full border border-black/12 px-4 py-2 text-sm text-black transition duration-300 ease-expo hover:border-black/22 hover:bg-white sm:w-auto"
              >
                {copiedValue === item.value ? '已复制邮箱' : '复制邮箱地址'}
              </button>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function App() {
  const lenisRef = useRef<Lenis | null>(null);
  const [pointer, setPointer] = useState<PointerState>({ x: 0, y: 0 });
  const [scrollProgress, setScrollProgress] = useState(0);
  const [heroRange, setHeroRange] = useState(1080);
  const [copiedContact, setCopiedContact] = useState<string | null>(null);
  const { isCompactScreen, isCoarsePointer, prefersReducedMotion } = useViewportProfile();
  const shouldReduceMotion = isCompactScreen || isCoarsePointer || prefersReducedMotion;
  const { springX, springY } = useParallaxPointer();
  const { scrollYProgress, scrollY } = useScroll();

  const heroY = useTransform(scrollY, [0, heroRange], [0, shouldReduceMotion ? -36 : -90]);
  const heroScale = useTransform(scrollY, [0, heroRange], [1, shouldReduceMotion ? 0.985 : 0.96]);
  const titleX = useTransform(springX, [-1, 1], shouldReduceMotion ? [-4, 4] : [-10, 10]);
  const titleY = useTransform(springY, [-1, 1], shouldReduceMotion ? [-4, 4] : [-10, 10]);
  const heroRotateX = useTransform(springY, [-1, 1], shouldReduceMotion ? [1.4, -1.4] : [4, -4]);
  const heroRotateY = useTransform(springX, [-1, 1], shouldReduceMotion ? [-1.8, 1.8] : [-5, 5]);
  const eyebrowX = useTransform(springX, [-1, 1], shouldReduceMotion ? [-3, 3] : [-8, 8]);
  const eyebrowY = useTransform(springY, [-1, 1], shouldReduceMotion ? [-2, 2] : [-6, 6]);
  const helloX = useTransform(springX, [-1, 1], shouldReduceMotion ? [-5, 5] : [-14, 14]);
  const helloY = useTransform(springY, [-1, 1], shouldReduceMotion ? [-4, 4] : [-12, 12]);
  const subtitleX = useTransform(springX, [-1, 1], shouldReduceMotion ? [-4, 4] : [-10, 10]);
  const subtitleY = useTransform(springY, [-1, 1], shouldReduceMotion ? [-3, 3] : [-8, 8]);
  const helloShadow = useMotionTemplate`${titleX}px ${titleY}px 28px rgba(0, 0, 0, 0.06)`;

  const scrollWithNonLinearEasing = useCallback((top: number) => {
    const startTop = window.scrollY;
    const distance = top - startTop;
    const duration = 1150;
    let animationId = 0;
    let startTime = 0;

    const step = (time: number) => {
      if (!startTime) {
        startTime = time;
      }

      const elapsed = time - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = 1 - Math.pow(1 - progress, 4);

      window.scrollTo({
        top: startTop + distance * easedProgress,
        behavior: 'auto',
      });

      if (progress < 1) {
        animationId = window.requestAnimationFrame(step);
      }
    };

    animationId = window.requestAnimationFrame(step);

    return () => {
      if (animationId) {
        window.cancelAnimationFrame(animationId);
      }
    };
  }, []);

  const handleNavigate = useCallback((href: string) => {
    const target = document.querySelector<HTMLElement>(href);

    if (!target) {
      return;
    }

    const headerOffset = isCompactScreen ? 124 : 96;
    const lenis = lenisRef.current;

    if (lenis) {
      lenis.scrollTo(target, {
        offset: -headerOffset,
        duration: 1.15,
        easing: (value: number) => 1 - Math.pow(1 - value, 4),
      });
    } else {
      const top = target.getBoundingClientRect().top + window.scrollY - headerOffset;
      scrollWithNonLinearEasing(top);
    }

    window.history.replaceState(null, '', href);
  }, [isCompactScreen, scrollWithNonLinearEasing]);

  useEffect(() => {
    const unsubscribeX = springX.on('change', (value) => {
      setPointer((prev) => ({ ...prev, x: value }));
    });

    const unsubscribeY = springY.on('change', (value) => {
      setPointer((prev) => ({ ...prev, y: value }));
    });

    return () => {
      unsubscribeX();
      unsubscribeY();
    };
  }, [springX, springY]);

  useEffect(() => {
    const updateRange = () => {
      setHeroRange(window.innerHeight || 1080);
    };

    updateRange();
    window.addEventListener('resize', updateRange);

    return () => {
      window.removeEventListener('resize', updateRange);
    };
  }, []);

  useEffect(() => {
    const unsubscribe = scrollYProgress.on('change', (value) => {
      setScrollProgress(value);
    });

    return () => {
      unsubscribe();
    };
  }, [scrollYProgress]);

  useEffect(() => {
    // 让 Framer Motion 的滚动联动与 Lenis 平滑滚动保持同一节奏。
    const lenis = new Lenis({
      duration: 1.15,
      lerp: 0.09,
      smoothWheel: true,
      wheelMultiplier: 0.95,
      touchMultiplier: 1.1,
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
      lenisRef.current = null;
      lenis.destroy();
    };
  }, []);

  useEffect(() => {
    if (!copiedContact) {
      return;
    }

    const timer = window.setTimeout(() => {
      setCopiedContact(null);
    }, 1600);

    return () => {
      window.clearTimeout(timer);
    };
  }, [copiedContact]);

  const handleCopyContact = async (value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedContact(value);
    } catch {
      setCopiedContact(null);
    }
  };

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-mist text-ink">
      <LiquidGlassDefs />
      <Navbar onNavigate={handleNavigate} />

      <main className="relative">
        <PerspectiveHeroSection
          shouldReduceMotion={shouldReduceMotion}
          pointer={pointer}
          scrollProgress={scrollProgress}
          heroY={heroY}
          heroScale={heroScale}
          titleX={titleX}
          titleY={titleY}
          heroRotateX={heroRotateX}
          heroRotateY={heroRotateY}
          eyebrowX={eyebrowX}
          eyebrowY={eyebrowY}
          helloX={helloX}
          helloY={helloY}
          helloShadow={helloShadow}
          subtitleX={subtitleX}
          subtitleY={subtitleY}
          springX={springX}
          springY={springY}
        />

        <OtherPagesSection />
        <AboutSection />
        <ContactSection copiedValue={copiedContact} onCopy={handleCopyContact} />
      </main>
    </div>
  );
}
