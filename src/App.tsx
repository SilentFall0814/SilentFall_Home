import { useCallback, useEffect, useState } from 'react';
import { motion, useMotionTemplate, useScroll, useTransform } from 'framer-motion';
import { LiquidGlassDefs } from './components/hero/LiquidGlassDefs';
import { PerspectiveHeroSection } from './components/hero/PerspectiveHeroSection';
import { AboutSection } from './components/sections/AboutSection';
import { ContactSection } from './components/sections/ContactSection';
import { OtherPagesSection } from './components/sections/OtherPagesSection';
import { NAV_LINKS } from './constants/site';
import { useHeroActivity } from './hooks/useHeroActivity';
import { useParallaxPointer } from './hooks/useParallaxPointer';
import { useSmoothScroll } from './hooks/useSmoothScroll';
import { useViewportProfile } from './hooks/useViewportProfile';
import { getAnimationLevel } from './utils/performance';

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

export default function App() {
  const [copiedContact, setCopiedContact] = useState<string | null>(null);
  const viewportProfile = useViewportProfile();
  const { isCompactScreen } = viewportProfile;
  const animationLevel = getAnimationLevel(viewportProfile);
  const lenisRef = useSmoothScroll(animationLevel);
  const isHeroActive = useHeroActivity();
  const { springX, springY } = useParallaxPointer();

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
  }, [isCompactScreen, lenisRef, scrollWithNonLinearEasing]);

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
          animationLevel={animationLevel}
          isHeroActive={isHeroActive}
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
