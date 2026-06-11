import { useEffect, useRef } from "react";
import Lenis from "lenis";
import {
  shouldEnableSmoothScroll,
  type AnimationLevel,
} from "../utils/performance";

export function useSmoothScroll(level: AnimationLevel) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    if (!shouldEnableSmoothScroll(level)) {
      lenisRef.current = null;
      return;
    }

    const lenis = new Lenis({
      duration: 1.05,
      lerp: 0.085,
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
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [level]);

  return lenisRef;
}
