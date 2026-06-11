import { useCallback, useEffect, useRef, useState } from 'react';
import {
  motion,
  type MotionValue,
  useMotionTemplate,
  useScroll,
  useTransform,
} from 'framer-motion';
import type { AnimationLevel } from '../../utils/performance';
import { SignatureLetters } from './SignatureLetters';

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];
const TRAIL_COUNT = 6;
const CIRCLE_RADIUS = 220;
const POLYGON_SEGMENTS = 24;

type PointerState = {
  x: number;
  y: number;
};

function DotGridCanvas({
  pointer,
  scrollProgress,
}: {
  pointer: PointerState;
  scrollProgress: number;
}) {
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

      const buckets = new Map<number, Array<[number, number, number]>>();

      for (let x = -spacing; x <= width + spacing; x += spacing) {
        for (let y = -spacing; y <= height + spacing; y += spacing) {
          const px = x + driftX * ((x / width) * 0.4 + 0.8);
          const py = y + driftY * ((y / height) * 0.2 + 0.8);
          const wave = Math.sin((x + y) * 0.018 + time * 0.001) * 0.32;
          const radius = 0.95 + wave * 0.2 + currentScroll * 0.28;
          const alpha = Math.max(0.08, 0.28 + pulse * 0.2 + wave * 0.08);
          const key = Math.round(alpha * 50);

          let bucket = buckets.get(key);
          if (!bucket) {
            bucket = [];
            buckets.set(key, bucket);
          }

          bucket.push([px, py, radius]);
        }
      }

      for (const [key, points] of buckets) {
        const alpha = key / 50;
        context.fillStyle = `rgba(185,185,185,${alpha})`;
        for (let index = 0; index < points.length; index += 1) {
          const [px, py, radius] = points[index];
          const diameter = radius * 2;
          context.fillRect(px - radius, py - radius, diameter, diameter);
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

function usePerspectiveTrail() {
  const trailRef = useRef({
    targetX: -300,
    targetY: -300,
    trailPoints: Array.from({ length: TRAIL_COUNT }, () => ({ x: -300, y: -300 })),
    animationId: 0,
    isInside: false,
  });
  const overlayRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    setIsTouchDevice(
      window.matchMedia('(hover: none), (pointer: coarse)').matches ||
        'ontouchstart' in window ||
        navigator.maxTouchPoints > 0,
    );
  }, []);

  const animate = useCallback(() => {
    const trail = trailRef.current;

    for (let index = 0; index < TRAIL_COUNT; index += 1) {
      const prevX = index === 0 ? trail.targetX : trail.trailPoints[index - 1].x;
      const prevY = index === 0 ? trail.targetY : trail.trailPoints[index - 1].y;
      const damping = 0.7 - 0.04 * index;
      trail.trailPoints[index].x += (prevX - trail.trailPoints[index].x) * damping;
      trail.trailPoints[index].y += (prevY - trail.trailPoints[index].y) * damping;
    }

    const head = trail.trailPoints[0];
    const tail = trail.trailPoints[TRAIL_COUNT - 1];
    const diffX = head.x - tail.x;
    const diffY = head.y - tail.y;
    const distSq = diffX * diffX + diffY * diffY;

    let path: string;
    if (distSq < 100) {
      path = `circle(${CIRCLE_RADIUS}px at ${head.x}px ${head.y}px)`;
    } else {
      const angle = Math.atan2(diffY, diffX);
      const totalPoints = (POLYGON_SEGMENTS + 1) * 2;
      const parts = new Array<string>(totalPoints);
      let pointIndex = 0;

      for (let index = 0; index <= POLYGON_SEGMENTS; index += 1) {
        const theta = angle - Math.PI / 2 + (Math.PI * index) / POLYGON_SEGMENTS;
        parts[pointIndex] = `${head.x + CIRCLE_RADIUS * Math.cos(theta)}px ${head.y + CIRCLE_RADIUS * Math.sin(theta)}px`;
        pointIndex += 1;
      }

      for (let index = 0; index <= POLYGON_SEGMENTS; index += 1) {
        const theta = angle + Math.PI / 2 + (Math.PI * index) / POLYGON_SEGMENTS;
        parts[pointIndex] = `${tail.x + CIRCLE_RADIUS * Math.cos(theta)}px ${tail.y + CIRCLE_RADIUS * Math.sin(theta)}px`;
        pointIndex += 1;
      }

      path = `polygon(${parts.join(', ')})`;
    }

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

  const onMouseEnter = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      if (isTouchDevice) {
        return;
      }

      containerRef.current = event.currentTarget;
      const rect = event.currentTarget.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const trail = trailRef.current;

      trail.targetX = x;
      trail.targetY = y;
      trail.isInside = true;

      for (let index = 0; index < TRAIL_COUNT; index += 1) {
        trail.trailPoints[index] = { x, y };
      }

      if (!trail.animationId) {
        trail.animationId = requestAnimationFrame(animate);
      }
    },
    [animate, isTouchDevice],
  );

  const onMouseMove = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      if (isTouchDevice) {
        return;
      }

      const rect = (containerRef.current ?? event.currentTarget).getBoundingClientRect();
      trailRef.current.targetX = event.clientX - rect.left;
      trailRef.current.targetY = event.clientY - rect.top;

      if (!trailRef.current.animationId) {
        trailRef.current.animationId = requestAnimationFrame(animate);
      }
    },
    [animate, isTouchDevice],
  );

  const onMouseLeave = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      if (isTouchDevice) {
        return;
      }

      const trail = trailRef.current;
      trail.isInside = false;

      const rect = event.currentTarget.getBoundingClientRect();
      containerRef.current = null;
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
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
    },
    [animate, isTouchDevice],
  );

  return { overlayRef, onMouseEnter, onMouseMove, onMouseLeave, isTouchDevice };
}

type PerspectiveHeroSectionProps = {
  animationLevel: AnimationLevel;
  isHeroActive: boolean;
  springX: MotionValue<number>;
  springY: MotionValue<number>;
};

export function PerspectiveHeroSection({
  animationLevel,
  isHeroActive,
  springX,
  springY,
}: PerspectiveHeroSectionProps) {
  const [pointer, setPointer] = useState<PointerState>({ x: 0, y: 0 });
  const [scrollProgress, setScrollProgress] = useState(0);
  const [heroRange, setHeroRange] = useState(1080);
  const shouldReduceMotion = animationLevel === 'lite';
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
  const { overlayRef, onMouseEnter, onMouseMove, onMouseLeave, isTouchDevice } = usePerspectiveTrail();

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

  return (
    <section
      className="relative flex min-h-[100svh] items-center justify-center overflow-hidden px-4 pt-24 sm:px-6 md:min-h-screen"
      onMouseEnter={onMouseEnter}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
    >
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.84),rgba(245,245,243,0.96))]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.65),rgba(245,245,243,0.92)_58%,rgba(237,237,234,1))]" />

      {!shouldReduceMotion && isHeroActive ? (
        <DotGridCanvas pointer={pointer} scrollProgress={scrollProgress} />
      ) : null}

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

      {isTouchDevice ? null : (
        <div className="absolute bottom-8 left-1/2 z-30 -translate-x-1/2 text-[10px] tracking-[0.3em] text-black/20 sm:text-[11px]">
          移动鼠标探索
        </div>
      )}
    </section>
  );
}
