import { motion } from "framer-motion";
import { ABOUT } from "../../../config/site.config";
import { SectionHeading } from "../components/SectionHeading";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

export function AboutSection() {
  return (
    <section
      id="about"
      className="relative overflow-hidden px-4 py-20 sm:px-6 md:py-32"
    >
      {/* Claude 风格背景：奶油白 + 陶土橙微光 */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,253,247,0.95),rgba(250,249,245,0.8)_48%,rgba(245,243,237,0.9))]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(217,119,87,0.05),transparent_50%)]" />

      <div className="relative mx-auto max-w-[1200px]">
        <SectionHeading
          eyebrow={ABOUT.heading.eyebrow}
          title={ABOUT.heading.title}
          description={ABOUT.heading.description}
        />

        <div className="mt-12 grid gap-5 sm:mt-14 sm:gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          {/* 主卡片：编辑式排版，衬线标题，陶土橙点缀 */}
          <motion.div
            className="relative rounded-[1.75rem] border border-clay/12 bg-paper/80 p-6 shadow-paper backdrop-blur-xs sm:p-8 md:rounded-[2rem] md:p-10"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, ease: EASE }}
          >
            {/* 陶土橙角标装饰 */}
            <div className="absolute right-6 top-6 h-2 w-2 rounded-full bg-clay/60 sm:right-8 sm:top-8" />

            <div className="flex items-center gap-3">
              <span className="h-px w-6 bg-clay/40" />
              <p className="text-sm font-medium tracking-[0.3em] text-clay">
                {ABOUT.cardLabel}
              </p>
            </div>

            {/* 衬线大标题：编辑式气质 */}
            <h3 className="mt-5 font-serif text-[1.75rem] font-semibold leading-tight tracking-[-0.02em] text-ink sm:text-2xl md:text-[2.25rem] md:leading-[1.2]">
              {ABOUT.cardTitle}
            </h3>

            <div className="mt-6 space-y-4">
              {ABOUT.cardParagraphs.map((paragraph) => (
                <p key={paragraph} className="text-sm leading-8 text-ink/65 md:text-base">
                  {paragraph}
                </p>
              ))}
            </div>

            {/* 标签：陶土橙边框，编辑式 */}
            <div className="mt-8">
              <div className="flex items-center gap-3">
                <span className="h-px w-6 bg-clay/40" />
                <p className="text-xs font-medium tracking-[0.24em] text-ink/45">
                  {ABOUT.tagsLabel}
                </p>
              </div>
              <div className="mt-4 flex flex-wrap gap-2.5 text-sm text-ink/70 sm:gap-3">
                {ABOUT.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-clay/25 bg-clay/5 px-4 py-2 transition duration-300 ease-expo hover:border-clay/50 hover:bg-clay/10 hover:text-clay-dark"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>

          {/* 右侧：时间线 + 特性卡片 */}
          <div className="grid gap-4">
            {/* 时间线卡片 */}
            <motion.div
              className="rounded-[1.5rem] border border-ink/8 bg-fog/40 p-5 sm:rounded-[1.75rem] sm:p-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, ease: EASE }}
            >
              <div className="flex items-center gap-2 mb-4">
                <span className="h-px w-5 bg-clay/40" />
                <p className="text-sm font-medium tracking-[0.22em] text-clay">
                  {ABOUT.timelineLabel}
                </p>
              </div>

              <div className="relative space-y-5 pl-4">
                {/* 时间线竖线 */}
                <div className="absolute left-0 top-2 bottom-2 w-px bg-clay/20" />

                {ABOUT.timeline.map((item, index) => (
                  <motion.div
                    key={item.title}
                    className="relative"
                    initial={{ opacity: 0, x: -8 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.1, ease: EASE }}
                  >
                    {/* 时间线节点 */}
                    <div className="absolute -left-4 top-1.5 h-2 w-2 rounded-full border-2 border-paper bg-clay" />
                    <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-clay/70">
                      {item.year}
                    </p>
                    <p className="mt-1 font-serif text-sm font-semibold text-ink">
                      {item.title}
                    </p>
                    <p className="mt-1 text-xs leading-6 text-ink/55">
                      {item.description}
                    </p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* 特性卡片 */}
            {ABOUT.points.map((item, index) => (
              <motion.article
                key={item.title}
                className="group relative rounded-[1.5rem] border border-ink/8 bg-fog/40 p-5 transition duration-300 ease-expo hover:-translate-y-1 hover:border-clay/30 hover:bg-paper/80 hover:shadow-warm sm:rounded-[1.75rem] sm:p-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.6, delay: 0.2 + index * 0.1, ease: EASE }}
              >
                {/* 陶土橙左竖线装饰：hover 时显现 */}
                <div className="absolute left-0 top-1/2 h-0 w-0.5 -translate-y-1/2 rounded-full bg-clay transition-all duration-300 ease-expo group-hover:h-3/5" />

                <div className="flex items-center gap-2">
                  <span className="inline-block h-1 w-1 rounded-full bg-clay/50" />
                  <p className="text-sm font-medium tracking-[0.22em] text-clay">
                    {item.title}
                  </p>
                </div>
                <p className="mt-3 text-sm leading-7 text-ink/60">
                  {item.description}
                </p>
              </motion.article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
