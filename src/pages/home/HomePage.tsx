import { useCallback, useEffect, useState } from "react";
import { Navbar } from "../../components/layout/Navbar";
import { Footer } from "../../components/layout/Footer";
import { useHeroActivity } from "../../hooks/useHeroActivity";
import { useParallaxPointer } from "../../hooks/useParallaxPointer";
import { useSmoothScroll } from "../../hooks/useSmoothScroll";
import { useViewportProfile } from "../../hooks/useViewportProfile";
import { getAnimationLevel } from "../../utils/performance";
import { LiquidGlassDefs } from "./hero/LiquidGlassDefs";
import { PerspectiveHeroSection } from "./hero/PerspectiveHeroSection";
import { NAV_LINKS } from "../../config/site.config";
import { AboutSection } from "./sections/AboutSection";
import { NowSection } from "./sections/NowSection";
import { SkillsSection } from "./sections/SkillsSection";
import { ProjectsSection } from "./sections/ProjectsSection";
import { UsesSection } from "./sections/UsesSection";
import { OtherPagesSection } from "./sections/OtherPagesSection";
import { ContactSection } from "./sections/ContactSection";

export function HomePage() {
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
        behavior: "auto",
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

  const handleNavigate = useCallback(
    (href: string) => {
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
        const top =
          target.getBoundingClientRect().top + window.scrollY - headerOffset;
        scrollWithNonLinearEasing(top);
      }

      window.history.replaceState(null, "", href);
    },
    [isCompactScreen, lenisRef, scrollWithNonLinearEasing],
  );

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
    <div className="relative min-h-screen overflow-x-hidden bg-paper text-ink">
      <LiquidGlassDefs />
      <Navbar links={NAV_LINKS} onNavigate={handleNavigate} />

      <main className="relative">
        <PerspectiveHeroSection
          animationLevel={animationLevel}
          isHeroActive={isHeroActive}
          springX={springX}
          springY={springY}
        />
        <AboutSection />
        <NowSection />
        <SkillsSection />
        <ProjectsSection />
        <UsesSection />
        <OtherPagesSection />
        <ContactSection
          copiedValue={copiedContact}
          onCopy={handleCopyContact}
        />
      </main>

      <Footer />
    </div>
  );
}
