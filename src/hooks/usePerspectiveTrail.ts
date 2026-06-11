import { useCallback, useEffect, useRef, useState } from "react";

const TRAIL_COUNT = 6;
const CIRCLE_RADIUS = 220;
const POLYGON_SEGMENTS = 24;

export function usePerspectiveTrail() {
  const trailRef = useRef({
    targetX: -300,
    targetY: -300,
    trailPoints: Array.from({ length: TRAIL_COUNT }, () => ({
      x: -300,
      y: -300,
    })),
    animationId: 0,
    isInside: false,
  });
  const overlayRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    setIsTouchDevice(
      window.matchMedia("(hover: none), (pointer: coarse)").matches ||
        "ontouchstart" in window ||
        navigator.maxTouchPoints > 0,
    );
  }, []);

  const animate = useCallback(() => {
    const trail = trailRef.current;

    for (let index = 0; index < TRAIL_COUNT; index += 1) {
      const prevX =
        index === 0 ? trail.targetX : trail.trailPoints[index - 1].x;
      const prevY =
        index === 0 ? trail.targetY : trail.trailPoints[index - 1].y;
      const damping = 0.7 - 0.04 * index;
      trail.trailPoints[index].x +=
        (prevX - trail.trailPoints[index].x) * damping;
      trail.trailPoints[index].y +=
        (prevY - trail.trailPoints[index].y) * damping;
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
        const theta =
          angle - Math.PI / 2 + (Math.PI * index) / POLYGON_SEGMENTS;
        parts[pointIndex] =
          `${head.x + CIRCLE_RADIUS * Math.cos(theta)}px ${head.y + CIRCLE_RADIUS * Math.sin(theta)}px`;
        pointIndex += 1;
      }

      for (let index = 0; index <= POLYGON_SEGMENTS; index += 1) {
        const theta =
          angle + Math.PI / 2 + (Math.PI * index) / POLYGON_SEGMENTS;
        parts[pointIndex] =
          `${tail.x + CIRCLE_RADIUS * Math.cos(theta)}px ${tail.y + CIRCLE_RADIUS * Math.sin(theta)}px`;
        pointIndex += 1;
      }

      path = `polygon(${parts.join(", ")})`;
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

      const rect = (
        containerRef.current ?? event.currentTarget
      ).getBoundingClientRect();
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
