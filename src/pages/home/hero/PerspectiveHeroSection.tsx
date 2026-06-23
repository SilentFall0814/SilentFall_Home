import { useEffect, useState } from "react";
import {
  motion,
  type MotionValue,
  useMotionTemplate,
  useScroll,
  useTransform,
} from "framer-motion";
import type { AnimationLevel } from "../../../utils/performance";
import { usePerspectiveTrail } from "../../../hooks/usePerspectiveTrail";
import { DotGridCanvas } from "./DotGridCanvas";
import { SignatureLetters } from "./SignatureLetters";
import { HERO } from "../../../config/site.config";

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
  const shouldReduceMotion = animationLevel === "lite";
  const { scrollYProgress, scrollY } = useScroll();
  const heroY = useTransform(
    scrollY,
    [0, heroRange],
    [0, shouldReduceMotion ? -36 : -90],
  );
  const heroScale = useTransform(
    scrollY,
    [0, heroRange],
    [1, shouldReduceMotion ? 0.985 : 0.96],
  );
  const titleX = useTransform(
    springX,
    [-1, 1],
    shouldReduceMotion ? [-4, 4] : [-10, 10],
  );
  const titleY = useTransform(
    springY,
    [-1, 1],
    shouldReduceMotion ? [-4, 4] : [-10, 10],
  );
  const heroRotateX = useTransform(
    springY,
    [-1, 1],
    shouldReduceMotion ? [1.4, -1.4] : [4, -4],
  );
  const heroRotateY = useTransform(
    springX,
    [-1, 1],
    shouldReduceMotion ? [-1.8, 1.8] : [-5, 5],
  );
  const eyebrowX = useTransform(
    springX,
    [-1, 1],
    shouldReduceMotion ? [-3, 3] : [-8, 8],
  );
  const eyebrowY = useTransform(
    springY,
    [-1, 1],
    shouldReduceMotion ? [-2, 2] : [-6, 6],
  );
  const helloX = useTransform(
    springX,
    [-1, 1],
    shouldReduceMotion ? [-5, 5] : [-14, 14],
  );
  const helloY = useTransform(
    springY,
    [-1, 1],
    shouldReduceMotion ? [-4, 4] : [-12, 12],
  );
  const subtitleX = useTransform(
    springX,
    [-1, 1],
    shouldReduceMotion ? [-4, 4] : [-10, 10],
  );
  const subtitleY = useTransform(
    springY,
    [-1, 1],
    shouldReduceMotion ? [-3, 3] : [-8, 8],
  );
  // Claude 风格：陶土橙柔和阴影，取代原冷黑阴影
  const helloShadow = useMotionTemplate`${titleX}px ${titleY}px 28px rgba(217, 119, 87, 0.12)`;
  const { overlayRef, onMouseEnter, onMouseMove, onMouseLeave, isTouchDevice } =
    usePerspectiveTrail();

  useEffect(() => {
    const unsubscribeX = springX.on("change", (value) => {
      setPointer((prev) => ({ ...prev, x: value }));
    });

    const unsubscribeY = springY.on("change", (value) => {
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
    window.addEventListener("resize", updateRange);

    return () => {
      window.removeEventListener("resize", updateRange);
    };
  }, []);

  useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (value) => {
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
      {/* Claude 风格背景：奶油白 + 陶土橙暖光，取代原冷白渐变 */}
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(250,249,245,0.84),rgba(245,243,237,0.96))]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,253,247,0.65),rgba(250,249,245,0.92)_58%,rgba(232,230,220,1))]" />
      {/* 陶土橙暖光晕：从右上方洒下，营造温暖的光照感 */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(217,119,87,0.08),transparent_50%)]" />
      {/* 橄榄绿微光：从左下方呼应，增加色彩层次 */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(120,140,93,0.06),transparent_45%)]" />

      {!shouldReduceMotion && isHeroActive ? (
        <DotGridCanvas
          pointer={pointer}
          scrollProgress={scrollProgress}
          animationLevel={animationLevel}
        />
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
            transformStyle: "preserve-3d",
          }}
        >
          {/* eyebrow：陶土橙 + 手绘短横线装饰 */}
          <motion.div
            className="mb-5 flex items-center gap-3 sm:mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55, duration: 0.8, ease: EASE }}
            style={{ x: eyebrowX, y: eyebrowY }}
          >
            <span className="h-px w-10 bg-clay/40" />
            <p className="text-[11px] font-medium uppercase tracking-[0.42em] text-clay sm:text-[12px] sm:tracking-[0.55em] md:text-[13px]">
              {HERO.welcomeText}
            </p>
            <span className="h-px w-10 bg-clay/40" />
          </motion.div>

          <div className="flex flex-col items-center justify-center gap-3 text-center leading-none sm:flex-row sm:flex-wrap sm:items-end sm:gap-x-4">
            {/* HELLO,I'M：衬线字体 + 暖黑，取代原无衬线黑色 */}
            <motion.span
              className="font-serif text-[clamp(2.6rem,16vw,8.8rem)] font-semibold uppercase tracking-[-0.04em] text-ink sm:text-[clamp(3.4rem,10vw,8.8rem)] sm:tracking-[-0.06em]"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8, ease: EASE }}
              style={{
                x: helloX,
                y: helloY,
                textShadow: helloShadow,
                transform: "translateZ(24px)",
              }}
            >
              {HERO.greeting}
            </motion.span>

            <SignatureLetters springX={springX} springY={springY} />
          </div>

          {/* 副标题：陶土橙分隔符 + 暖灰文字 */}
          <motion.div
            className="mt-7 flex items-center gap-3 sm:mt-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1, duration: 0.75, ease: EASE }}
            style={{ x: subtitleX, y: subtitleY }}
          >
            {HERO.subtitleItems.map((item, idx) => (
              <span key={item} className="flex items-center gap-3">
                {idx > 0 && <span className="h-3 w-px bg-clay/40" />}
                <span className="text-[11px] tracking-[0.22em] text-ink/55 sm:text-[12px] sm:tracking-[0.35em] md:text-[14px]">
                  {item}
                </span>
              </span>
            ))}
          </motion.div>

          {/* Claude 风格手绘下划线装饰：陶土橙波浪线 */}
          <motion.svg
            className="mt-6 h-3 w-48 text-clay/60 sm:w-64"
            viewBox="0 0 240 12"
            fill="none"
            initial={{ opacity: 0, pathLength: 0 }}
            animate={{ opacity: 1, pathLength: 1 }}
            transition={{ delay: 1.4, duration: 1.2, ease: EASE }}
          >
            <path
              d="M2 8 Q 20 2, 40 8 T 80 8 T 120 8 T 160 8 T 200 8 T 238 8"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              fill="none"
            />
          </motion.svg>
        </motion.div>
      </motion.div>

      {/* 暗色覆盖层：保留原交互效果，改为暖黑底 */}
      <div
        ref={overlayRef}
        className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center bg-ink"
        style={{
          clipPath: "circle(0px at -300px -300px)",
          willChange: "clip-path",
        }}
      >
        <motion.div
          className="relative z-10 text-center"
          style={{
            x: titleX,
            y: titleY,
            rotateX: heroRotateX,
            rotateY: heroRotateY,
            transformPerspective: 1400,
            transformStyle: "preserve-3d",
          }}
        >
          <motion.p
            className="mb-4 text-[11px] font-medium uppercase tracking-[0.42em] text-clay-light/70 sm:mb-5 sm:text-[12px] sm:tracking-[0.65em] md:text-[13px]"
            style={{ x: eyebrowX, y: eyebrowY }}
          >
            {HERO.welcomeTextDark}
          </motion.p>
          <motion.h1
            className="font-serif text-[clamp(2.6rem,16vw,8.8rem)] font-semibold uppercase tracking-[-0.04em] text-paper sm:text-[clamp(3.4rem,10vw,8.8rem)] sm:tracking-[-0.06em]"
            style={{ x: helloX, y: helloY, transform: "translateZ(24px)" }}
          >
            {HERO.greetingDark}
          </motion.h1>
          <motion.h1
            className="mt-2 font-serif text-[clamp(2.5rem,15vw,5rem)] font-medium italic tracking-[-0.05em] text-clay-light sm:text-[clamp(2.2rem,5vw,5rem)]"
            style={{ x: helloX, y: helloY }}
          >
            {HERO.signatureName}
          </motion.h1>
          <motion.p
            className="mt-7 text-[11px] tracking-[0.22em] text-paper/60 sm:text-[12px] sm:tracking-[0.35em] md:text-[14px]"
            style={{ x: subtitleX, y: subtitleY }}
          >
            {HERO.subtitleDark}
          </motion.p>
        </motion.div>
      </div>

      {isTouchDevice ? null : (
        <div className="absolute bottom-8 left-1/2 z-30 -translate-x-1/2 text-[10px] tracking-[0.3em] text-clay/50 sm:text-[11px]">
          {HERO.exploreHint}
        </div>
      )}
    </section>
  );
}
