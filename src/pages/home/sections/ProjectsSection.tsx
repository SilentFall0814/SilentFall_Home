import { motion } from "framer-motion";
import { PROJECTS } from "../../../config/site.config";
import { SectionHeading } from "../components/SectionHeading";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

// 状态配色映射：以 tone 标识符为 key，与 status 文字解耦
const STATUS_STYLE: Record<string, { dot: string; text: string }> = {
  "clay": { dot: "bg-clay", text: "text-clay" },
  "sage": { dot: "bg-sage", text: "text-sage" },
  "mid": { dot: "bg-mid", text: "text-mid" },
};

export function ProjectsSection() {
  return (
    <section
      id="projects"
      className="relative overflow-hidden px-4 py-20 sm:px-6 md:py-32"
    >
      {/* 橄榄绿微光背景 */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(120,140,93,0.06),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,253,247,0.92),rgba(250,249,245,0.75)_48%,rgba(245,243,237,0.88))]" />

      <div className="relative mx-auto max-w-[1000px]">
        <SectionHeading
          eyebrow={PROJECTS.heading.eyebrow}
          title={PROJECTS.heading.title}
          description={PROJECTS.heading.description}
        />

        <div className="mt-12 grid gap-5 sm:mt-14">
          {PROJECTS.items.map((project, index) => {
            const statusStyle = STATUS_STYLE[project.tone] ?? STATUS_STYLE["mid"];
            return (
              <motion.a
                key={project.id}
                href={project.href}
                target={project.href.startsWith("http") ? "_blank" : undefined}
                rel={project.href.startsWith("http") ? "noopener noreferrer" : undefined}
                className="group relative flex flex-col gap-4 rounded-[1.5rem] border border-ink/8 bg-paper/60 p-6 shadow-paper backdrop-blur-xs transition duration-300 ease-expo hover:border-clay/25 hover:shadow-warm sm:flex-row sm:items-start sm:gap-6 sm:rounded-[1.75rem] sm:p-7"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.6, delay: index * 0.1, ease: EASE }}
              >
                {/* 序号：衬线大字 */}
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-clay/15 bg-clay/5 font-serif text-lg font-semibold text-clay/60 transition-colors duration-300 group-hover:border-clay/30 group-hover:bg-clay/10 group-hover:text-clay">
                  {String(index + 1).padStart(2, "0")}
                </div>

                <div className="min-w-0 flex-1">
                  {/* 标题行：名称 + 状态 */}
                  <div className="flex items-center gap-3">
                    <h3 className="font-serif text-lg font-semibold text-ink">
                      {project.title}
                    </h3>
                    <span className={`flex items-center gap-1.5 text-[11px] font-medium ${statusStyle.text}`}>
                      <span className={`inline-block h-1.5 w-1.5 rounded-full ${statusStyle.dot}`} />
                      {project.status}
                    </span>
                  </div>

                  {/* 描述 */}
                  <p className="mt-2 text-sm leading-7 text-ink/60">
                    {project.description}
                  </p>

                  {/* 标签 */}
                  <div className="mt-3 flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-ink/10 bg-ink/3 px-2.5 py-0.5 text-[11px] text-ink/50 transition-colors duration-300 group-hover:border-clay/20 group-hover:text-ink/65"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* 箭头：hover 时显现 */}
                <div className="flex shrink-0 items-center self-center text-ink/20 transition-all duration-300 group-hover:translate-x-1 group-hover:text-clay">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5">
                    <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </motion.a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
