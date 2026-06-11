import { useEffect } from "react";
import { useMotionValue, useSpring } from "framer-motion";

export function useParallaxPointer() {
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const springX = useSpring(pointerX, {
    stiffness: 70,
    damping: 20,
    mass: 0.8,
  });
  const springY = useSpring(pointerY, {
    stiffness: 70,
    damping: 20,
    mass: 0.8,
  });

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

    window.addEventListener("mousemove", handleMove, { passive: true });
    window.addEventListener("mouseleave", handleLeave);

    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseleave", handleLeave);
    };
  }, [pointerX, pointerY]);

  return { springX, springY };
}
