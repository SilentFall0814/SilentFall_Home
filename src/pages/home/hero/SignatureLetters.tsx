import {
  motion,
  type MotionValue,
  useMotionTemplate,
  useTransform,
} from "framer-motion";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

function mapPointerRange(value: number, output: readonly [number, number]) {
  const progress = (value + 1) / 2;
  return output[0] + (output[1] - output[0]) * progress;
}

function LeoLetter({
  char,
  springX,
  springY,
  offsetX,
  offsetY,
  rotateRange,
  delay,
  className,
}: {
  char: string;
  springX: MotionValue<number>;
  springY: MotionValue<number>;
  offsetX: readonly [number, number];
  offsetY: readonly [number, number];
  rotateRange: readonly [number, number];
  delay: number;
  className?: string;
}) {
  const letterX = useTransform(springX, (value) =>
    mapPointerRange(value, offsetX),
  );
  const letterY = useTransform(springY, (value) =>
    mapPointerRange(value, offsetY),
  );
  const letterRotate = useTransform(springX, (value) =>
    mapPointerRange(value, rotateRange),
  );
  // Claude 风格：陶土橙柔和阴影，取代原冷黑阴影
  const letterShadow = useMotionTemplate`${letterX}px ${letterY}px 28px rgba(217, 119, 87, 0.18)`;

  return (
    <motion.span
      className={
        className ??
        // Claude 风格：衬线斜体 + 陶土橙，取代原无衬线黑色
        "inline-block font-serif text-[clamp(3.3rem,9vw,8.1rem)] font-medium italic tracking-[-0.08em] text-clay"
      }
      variants={{
        initial: { opacity: 0, scale: 0.8, rotate: -11, y: 8 },
        enter: { opacity: 1, scale: 1, rotate: -5, y: 0 },
        hover: { scale: 1.05 },
      }}
      transition={{ delay, duration: 0.9, ease: EASE }}
      style={{
        x: letterX,
        y: letterY,
        rotate: letterRotate,
        textShadow: letterShadow,
        transform: "translateZ(54px)",
      }}
    >
      {char}
    </motion.span>
  );
}

export function SignatureLetters({
  springX,
  springY,
}: {
  springX: MotionValue<number>;
  springY: MotionValue<number>;
}) {
  const letters = [
    {
      char: "S",
      offsetX: [-18, 12],
      offsetY: [-10, 8],
      rotate: [-6.8, -3.2],
      delay: 0.5,
    },
    {
      char: "i",
      offsetX: [-12, 9],
      offsetY: [-8, 7],
      rotate: [-6.1, -3.6],
      delay: 0.55,
    },
    {
      char: "l",
      offsetX: [-4, 5],
      offsetY: [-5, 5],
      rotate: [-5.2, -4.3],
      delay: 0.65,
    },
    {
      char: "e",
      offsetX: [6, -7],
      offsetY: [5, -6],
      rotate: [-4.4, -5.2],
      delay: 0.75,
    },
    {
      char: "n",
      offsetX: [14, -12],
      offsetY: [8, -8],
      rotate: [-3.6, -6.4],
      delay: 0.85,
    },
    {
      char: "t",
      offsetX: [14, -12],
      offsetY: [8, -8],
      rotate: [-3.6, -6.4],
      delay: 0.95,
    },
    {
      char: "F",
      offsetX: [14, -12],
      offsetY: [8, -8],
      rotate: [-3.6, -6.4],
      delay: 1.05,
    },
    {
      char: "a",
      offsetX: [14, -12],
      offsetY: [8, -8],
      rotate: [-3.6, -6.4],
      delay: 1.15,
    },
    {
      char: "l",
      offsetX: [14, -12],
      offsetY: [8, -8],
      rotate: [-3.6, -6.4],
      delay: 1.25,
    },
    {
      char: "l",
      offsetX: [14, -12],
      offsetY: [8, -8],
      rotate: [-3.6, -6.4],
      delay: 1.35,
    },
  ] as const;

  return (
    <motion.span
      className="inline-flex origin-center cursor-default items-end gap-[0.05em] sm:gap-[0.08em]"
      whileHover="hover"
      initial="initial"
      animate="enter"
    >
      {letters.map((letter, index) => (
        <LeoLetter
          key={`${letter.char}-${index}`}
          char={letter.char}
          springX={springX}
          springY={springY}
          offsetX={letter.offsetX}
          offsetY={letter.offsetY}
          rotateRange={letter.rotate}
          delay={letter.delay}
          className="inline-block font-serif text-[clamp(2.5rem,15vw,5rem)] font-medium italic tracking-[-0.05em] text-clay sm:text-[clamp(2.2rem,5vw,5rem)]"
        />
      ))}
    </motion.span>
  );
}
