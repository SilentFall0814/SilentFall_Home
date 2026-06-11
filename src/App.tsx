import { useCallback, useEffect, useRef, useState } from 'react';
import {
  motion,
  type MotionValue,
  useMotionTemplate,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
} from 'framer-motion';
import { AboutSection } from './components/sections/AboutSection';
import { ContactSection } from './components/sections/ContactSection';
import { OtherPagesSection } from './components/sections/OtherPagesSection';
import { NAV_LINKS } from './constants/site';
import { useSmoothScroll } from './hooks/useSmoothScroll';
import { useViewportProfile } from './hooks/useViewportProfile';
import { getAnimationLevel } from './utils/performance';

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];


type PointerState = {
  x: number;
  y: number;
};

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

export default function App() {
  const [pointer, setPointer] = useState<PointerState>({ x: 0, y: 0 });
  const [scrollProgress, setScrollProgress] = useState(0);
  const [heroRange, setHeroRange] = useState(1080);
  const [copiedContact, setCopiedContact] = useState<string | null>(null);
  const viewportProfile = useViewportProfile();
  const { isCompactScreen } = viewportProfile;
  const animationLevel = getAnimationLevel(viewportProfile);
  const lenisRef = useSmoothScroll(animationLevel);
  const shouldReduceMotion = animationLevel === 'lite';
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

  const renderSectionHeading = useCallback(
    (props: { eyebrow: string; title: string; description?: string }) => <SectionHeading {...props} />,
    [],
  );

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
        <AboutSection renderSectionHeading={renderSectionHeading} />
        <ContactSection
          copiedValue={copiedContact}
          onCopy={handleCopyContact}
          renderSectionHeading={renderSectionHeading}
        />
      </main>
    </div>
  );
}
