import { motion } from "framer-motion";
import { OTHER_PAGES_HEADING, SOCIAL_LINKS } from "../../../config/site.config";
import { SocialIcon } from "../../../components/SocialIcon";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

export function OtherPagesSection() {
  return (
    <section id="other-pages" className="relative px-4 py-20 sm:px-6 md:py-32">
      {/* 陶土橙微光背景 */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(217,119,87,0.04),transparent_60%)]" />

      <div className="relative mx-auto max-w-[800px]">
        <div className="mx-auto max-w-3xl text-center">
          {/* eyebrow：陶土橙 + 手绘短横线 */}
          <div className="flex items-center justify-center gap-3">
            <span className="h-px w-8 bg-clay/40" />
            <p className="text-[11px] font-medium uppercase tracking-[0.32em] text-clay sm:text-xs sm:tracking-[0.42em]">
              {OTHER_PAGES_HEADING.eyebrow}
            </p>
            <span className="h-px w-8 bg-clay/40" />
          </div>
          {/* 衬线标题 */}
          <h2 className="mt-5 font-serif text-[1.9rem] font-semibold leading-tight tracking-[-0.02em] text-ink sm:mt-6 sm:text-3xl md:text-[2.75rem] md:leading-[1.15]">
            {OTHER_PAGES_HEADING.title}
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-ink/55 sm:mt-6 sm:leading-8 md:text-base">
            {OTHER_PAGES_HEADING.description}
          </p>
        </div>

        {/* 卡片组：staggered 入场，陶土橙 hover 效果 */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-3 sm:mt-14 sm:gap-4">
          {SOCIAL_LINKS.map((page, index) => (
            <motion.a
              key={page.id}
              href={page.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative flex items-center gap-2.5 overflow-hidden rounded-xl border border-clay/15 bg-fog/40 px-5 py-3 text-sm font-medium text-ink/70 transition duration-300 ease-expo hover:border-clay/40 hover:bg-paper hover:text-clay-dark hover:shadow-warm sm:px-6 sm:py-3.5"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1, ease: EASE }}
            >
              {/* 陶土橙底部进度条：hover 时从左滑入 */}
              <span className="absolute bottom-0 left-0 h-0.5 w-full origin-left scale-x-0 bg-clay transition-transform duration-300 ease-expo group-hover:scale-x-100" />
              <span className="relative transition-colors duration-300 group-hover:text-clay">
                <SocialIcon icon={page.icon} />
              </span>
              <span className="relative">{page.title}</span>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
