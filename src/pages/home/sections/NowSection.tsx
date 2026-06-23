import { motion } from "framer-motion";
import { NOW } from "../../../config/site.config";
import { SectionHeading } from "../components/SectionHeading";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

// 图标映射：用简洁的 SVG 代替 emoji
const ICON_MAP: Record<string, React.ReactNode> = {
  code: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-5 w-5">
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </svg>
  ),
  book: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-5 w-5">
      <path d="M4 19.5A2.5 2.5 0 016.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" />
    </svg>
  ),
  music: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-5 w-5">
      <path d="M9 18V5l12-2v13" />
      <circle cx="6" cy="18" r="3" />
      <circle cx="18" cy="16" r="3" />
    </svg>
  ),
  think: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-5 w-5">
      <circle cx="12" cy="12" r="10" />
      <path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  ),
};

export function NowSection() {
  return (
    <section
      id="now"
      className="relative overflow-hidden px-4 py-20 sm:px-6 md:py-32"
    >
      {/* 橄榄绿微光背景：与 About 的陶土橙形成冷暖交替 */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(120,140,93,0.06),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,253,247,0.92),rgba(250,249,245,0.75)_48%,rgba(245,243,237,0.88))]" />

      <div className="relative mx-auto max-w-[1000px]">
        <SectionHeading
          eyebrow={NOW.heading.eyebrow}
          title={NOW.heading.title}
          description={NOW.heading.description}
        />

        <div className="mt-12 grid gap-4 sm:mt-14 sm:grid-cols-2">
          {NOW.items.map((item, index) => (
            <motion.div
              key={item.title}
              className="group relative rounded-[1.5rem] border border-ink/8 bg-paper/60 p-6 shadow-paper backdrop-blur-xs transition duration-300 ease-expo hover:border-clay/25 hover:shadow-warm sm:rounded-[1.75rem] sm:p-7"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: index * 0.1, ease: EASE }}
            >
              {/* 陶土橙角标 */}
              <div className="absolute right-5 top-5 h-1.5 w-1.5 rounded-full bg-clay/50 transition-transform duration-300 group-hover:scale-150" />

              <div className="flex items-start gap-4">
                {/* 图标：陶土橙 */}
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-clay/20 bg-clay/5 text-clay transition-colors duration-300 group-hover:bg-clay group-hover:text-paper">
                  {ICON_MAP[item.icon]}
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-serif text-base font-semibold text-ink">
                      {item.title}
                    </h3>
                    <span className="shrink-0 rounded-full border border-sage/30 bg-sage/8 px-2 py-0.5 text-[10px] font-medium text-sage">
                      {item.tag}
                    </span>
                  </div>
                  <p className="mt-2 text-sm leading-7 text-ink/60">
                    {item.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* 底部注释：编辑式 */}
        <motion.p
          className="mt-8 text-center text-xs italic tracking-wide text-ink/35"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4, ease: EASE }}
        >
          {NOW.footnote}
        </motion.p>
      </div>
    </section>
  );
}
