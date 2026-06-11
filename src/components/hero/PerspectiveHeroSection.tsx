import { useEffect, useState } from 'react';
import {
  motion,
  type MotionValue,
  useMotionTemplate,
  useScroll,
  useTransform,
} from 'framer-motion';
import type { AnimationLevel } from '../../utils/performance';
import { usePerspectiveTrail } from '../../hooks/usePerspectiveTrail';
import { DotGridCanvas } from './DotGridCanvas';
import { SignatureLetters } from './SignatureLetters';

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

type PointerState = {
  x: number;
  y: number;
};

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
        <DotGridCanvas pointer={pointer} scrollProgress={scrollProgress} animationLevel={animationLevel} />
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
