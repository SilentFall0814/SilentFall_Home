import {
  motion,
  useMotionTemplate,
  useScroll,
  useTransform,
} from "framer-motion";
import { SITE } from "../../config/site.config";

type NavbarProps = {
  links: ReadonlyArray<{
    label: string;
    href: string;
  }>;
  onNavigate: (href: string) => void;
};

export function Navbar({ links, onNavigate }: NavbarProps) {
  const { scrollY } = useScroll();
  // Claude 风格：奶油白底 + 陶土橙微光，取代原冷白液态玻璃
  const backgroundOpacity = useTransform(scrollY, [0, 80], [0.72, 0.88]);
  const borderOpacity = useTransform(scrollY, [0, 80], [0.4, 0.6]);
  const blur = useTransform(scrollY, [0, 80], [20, 28]);
  const shadowOpacity = useTransform(scrollY, [0, 80], [0.06, 0.1]);
  const background = useMotionTemplate`rgba(250, 249, 245, ${backgroundOpacity})`;
  const borderColor = useMotionTemplate`rgba(217, 119, 87, ${borderOpacity})`;
  const liquidBackdropFilter = useMotionTemplate`url(#liquid-glass-nav) blur(${blur}px) saturate(1.18) brightness(1.04) contrast(1.02)`;
  const liquidShadow = useMotionTemplate`0 18px 50px rgba(20, 20, 19, ${shadowOpacity}), 0 2px 12px rgba(217, 119, 87, 0.08)`;

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
        {/* 顶部高光层：暖白色调 */}
        <div
          className="pointer-events-none absolute inset-[1px] rounded-full"
          style={{
            background:
              "linear-gradient(180deg, rgba(255, 253, 247, 0.52) 0%, rgba(250, 249, 245, 0.16) 24%, rgba(250, 249, 245, 0.07) 58%, rgba(250, 249, 245, 0.04) 100%)",
          }}
        />
        {/* 内描边：陶土橙微光 */}
        <div
          className="pointer-events-none absolute inset-0 rounded-full"
          style={{
            boxShadow:
              "inset 0 1px 0 rgba(255, 253, 247, 0.98), inset 0 -1px 0 rgba(217, 119, 87, 0.18), inset 0 0 24px rgba(217, 119, 87, 0.04)",
          }}
        />
        {/* 流动光斑：陶土橙暖光，取代原冷白光斑 */}
        <motion.div
          className="pointer-events-none absolute left-[7%] top-[1px] h-[62%] w-[30%] rounded-full opacity-80"
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
              "radial-gradient(circle at center, rgba(217, 119, 87, 0.22) 0%, rgba(232, 147, 120, 0.12) 34%, rgba(217, 119, 87, 0.04) 54%, rgba(217, 119, 87, 0) 76%)",
            filter: "blur(10px)",
          }}
        />
        <motion.div
          className="pointer-events-none absolute left-[34%] top-[8px] h-[36%] w-[18%] rounded-full opacity-45 mix-blend-multiply"
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
              "radial-gradient(circle at center, rgba(120, 140, 93, 0.18) 0%, rgba(120, 140, 93, 0.06) 40%, rgba(120, 140, 93, 0) 76%)",
            filter: "blur(7px)",
          }}
        />
        <motion.div
          className="pointer-events-none absolute right-[9%] bottom-[1px] h-[48%] w-[24%] rounded-full opacity-55"
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
              "radial-gradient(circle at center, rgba(217, 119, 87, 0.16) 0%, rgba(217, 119, 87, 0.06) 44%, rgba(217, 119, 87, 0) 74%)",
            filter: "blur(12px)",
          }}
        />
        {/* Logo：衬线字体 + 陶土橙圆点装饰 */}
        <div className="relative z-10 flex items-center gap-2">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-clay animate-pulseClay" />
          <span className="font-serif text-[13px] font-semibold tracking-[0.18em] text-ink sm:text-[15px] sm:tracking-[0.22em]">
            {SITE.name}
          </span>
        </div>
        <nav className="relative z-10 flex w-full items-center gap-1.5 overflow-x-auto pb-1 text-[12px] font-medium text-ink/80 md:w-auto md:justify-end md:gap-6 md:overflow-visible md:pb-0 md:text-[13px]">
          {links.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={(event) => {
                event.preventDefault();
                onNavigate(item.href);
              }}
              className="shrink-0 rounded-full border border-clay/15 bg-paper/60 px-3 py-2 text-center backdrop-blur-sm transition duration-300 ease-expo hover:border-clay/40 hover:bg-clay/8 hover:text-clay-dark md:rounded-none md:border-0 md:bg-transparent md:px-0 md:py-0 md:backdrop-blur-none md:hover:bg-transparent md:hover:text-clay"
            >
              {item.label}
            </a>
          ))}
        </nav>
      </motion.div>
    </motion.header>
  );
}
