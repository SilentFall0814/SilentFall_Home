import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import type { AnimationLevel } from "../../../utils/performance";
import { getDotGridConfig } from "../../../utils/performance";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

type PointerState = {
  x: number;
  y: number;
};

type DotGridCanvasProps = {
  pointer: PointerState;
  scrollProgress: number;
  animationLevel: AnimationLevel;
};

export function DotGridCanvas({
  pointer,
  scrollProgress,
  animationLevel,
}: DotGridCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const pointerRef = useRef(pointer);
  const scrollRef = useRef(scrollProgress);

  useEffect(() => {
    pointerRef.current = pointer;
  }, [pointer]);

  useEffect(() => {
    scrollRef.current = scrollProgress;
  }, [scrollProgress]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const context = canvas.getContext("2d");
    if (!context) {
      return;
    }

    const { spacing, heightRatio, alphaSteps } =
      getDotGridConfig(animationLevel);

    let animationId = 0;
    let width = 0;
    let height = 0;
    let dpr = 1;

    const resize = () => {
      dpr = window.devicePixelRatio || 1;
      width = window.innerWidth;
      height = window.innerHeight * heightRatio;
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
      const driftY =
        Math.cos(time * 0.00015) * 10 -
        currentPointer.y * 14 +
        currentScroll * 40;
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
          const key = Math.round(alpha * alphaSteps);

          let bucket = buckets.get(key);
          if (!bucket) {
            bucket = [];
            buckets.set(key, bucket);
          }

          bucket.push([px, py, radius]);
        }
      }

      for (const [key, points] of buckets) {
        const alpha = key / alphaSteps;
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
    window.addEventListener("resize", resize);

    return () => {
      window.cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
    };
  }, [animationLevel]);

  return (
    <motion.canvas
      ref={canvasRef}
      className="absolute inset-0 h-[130vh] w-full opacity-0 will-change-transform"
      animate={{ opacity: 1 }}
      transition={{ duration: 1.2, ease: EASE }}
      style={{
        x: -pointer.x * 16,
        y: -pointer.y * 12 + scrollProgress * 50,
      }}
    />
  );
}
