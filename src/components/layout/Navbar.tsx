import {
  motion,
  useMotionTemplate,
  useScroll,
  useTransform,
} from "framer-motion";

type NavbarProps = {
  links: ReadonlyArray<{
    label: string;
    href: string;
  }>;
  onNavigate: (href: string) => void;
};

export function Navbar({ links, onNavigate }: NavbarProps) {
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
              "linear-gradient(180deg, rgba(255, 255, 255, 0.52) 0%, rgba(255, 255, 255, 0.16) 24%, rgba(255, 255, 255, 0.07) 58%, rgba(255, 255, 255, 0.04) 100%)",
          }}
        />
        <div
          className="pointer-events-none absolute inset-0 rounded-full"
          style={{
            boxShadow:
              "inset 0 1px 0 rgba(255, 255, 255, 0.98), inset 0 -1px 0 rgba(255, 255, 255, 0.42), inset 0 0 24px rgba(255, 255, 255, 0.08)",
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
            ease: "easeInOut",
          }}
          style={{
            background:
              "radial-gradient(circle at center, rgba(255, 255, 255, 0.7) 0%, rgba(255, 255, 255, 0.24) 34%, rgba(255, 255, 255, 0.08) 54%, rgba(255, 255, 255, 0) 76%)",
            filter: "blur(10px)",
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
            ease: "easeInOut",
          }}
          style={{
            background:
              "radial-gradient(circle at center, rgba(255, 255, 255, 0.82) 0%, rgba(255, 255, 255, 0.2) 40%, rgba(255, 255, 255, 0) 76%)",
            filter: "blur(7px)",
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
            ease: "easeInOut",
          }}
          style={{
            background:
              "radial-gradient(circle at center, rgba(255, 255, 255, 0.42) 0%, rgba(255, 255, 255, 0.12) 44%, rgba(255, 255, 255, 0) 74%)",
            filter: "blur(12px)",
          }}
        />
        <div className="relative z-10 text-[11px] font-black tracking-[0.22em] text-ink sm:text-sm sm:tracking-[0.28em]">
          SilentFall
        </div>
        <nav className="relative z-10 flex w-full items-center gap-2 overflow-x-auto pb-1 text-[12px] font-medium text-ink/80 md:w-auto md:justify-end md:gap-8 md:overflow-visible md:pb-0 md:text-[13px]">
          {links.map((item) => (
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
