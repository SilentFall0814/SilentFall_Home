import { useCallback, useEffect, useState } from 'react';
import { LiquidGlassDefs } from './components/hero/LiquidGlassDefs';
import { PerspectiveHeroSection } from './components/hero/PerspectiveHeroSection';
import { Navbar } from './components/layout/Navbar';
import { AboutSection } from './components/sections/AboutSection';
import { ContactSection } from './components/sections/ContactSection';
import { OtherPagesSection } from './components/sections/OtherPagesSection';
import { useHeroActivity } from './hooks/useHeroActivity';
import { useParallaxPointer } from './hooks/useParallaxPointer';
import { useSmoothScroll } from './hooks/useSmoothScroll';
import { useViewportProfile } from './hooks/useViewportProfile';
import { getAnimationLevel } from './utils/performance';

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
