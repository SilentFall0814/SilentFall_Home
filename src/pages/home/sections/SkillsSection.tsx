import { motion } from "framer-motion";
import { SKILLS } from "../../../config/site.config";
import { SectionHeading } from "../components/SectionHeading";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

// 标签配色映射：以 tone 标识符为 key，与 level 文字解耦
const LEVEL_STYLE: Record<string, { border: string; bg: string; text: string }> = {
  "clay": { border: "border-clay/35", bg: "bg-clay/8", text: "text-clay-dark" },
  "clay-strong": { border: "border-clay/50", bg: "bg-clay/12", text: "text-clay-dark" },
  "sage": { border: "border-sage/35", bg: "bg-sage/8", text: "text-sage" },
  "slate": { border: "border-slate/35", bg: "bg-slate/8", text: "text-slate" },
  "ink": { border: "border-ink/20", bg: "bg-ink/5", text: "text-ink/60" },
};

export function SkillsSection() {
  return (
    <section
      id="skills"
      className="relative overflow-hidden px-4 py-20 sm:px-6 md:py-32"
    >
      {/* 陶土橙微光背景 */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(217,119,87,0.05),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,rgba(255,253,247,0.92),rgba(250,249,245,0.75)_48%,rgba(245,243,237,0.88))]" />

      <div className="relative mx-auto max-w-[1000px]">
        <SectionHeading
          eyebrow={SKILLS.heading.eyebrow}
          title={SKILLS.heading.title}
          description={SKILLS.heading.description}
        />

        <div className="mt-12 grid gap-8 sm:mt-14 md:grid-cols-3">
          {SKILLS.groups.map((group, groupIndex) => (
            <motion.div
              key={group.category}
              className="rounded-[1.5rem] border border-ink/8 bg-paper/60 p-6 shadow-paper backdrop-blur-xs sm:rounded-[1.75rem] sm:p-7"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: groupIndex * 0.12, ease: EASE }}
            >
              {/* 分类标题：陶土橙短横线 + 衬线 */}
              <div className="flex items-center gap-2">
                <span className="h-px w-5 bg-clay/40" />
                <h3 className="font-serif text-base font-semibold text-ink">
                  {group.category}
                </h3>
              </div>

              {/* 技能标签列表 */}
              <div className="mt-5 space-y-3">
                {group.items.map((skill, skillIndex) => {
                  const style = LEVEL_STYLE[skill.tone] ?? LEVEL_STYLE["ink"];
                  return (
                    <motion.div
                      key={skill.name}
                      className="group flex items-center justify-between gap-3"
                      initial={{ opacity: 0, x: -12 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{
                        duration: 0.4,
                        delay: groupIndex * 0.12 + skillIndex * 0.06,
                        ease: EASE,
                      }}
                    >
                      <span className="text-sm text-ink/75">{skill.name}</span>
                      <span
                        className={`shrink-0 rounded-full border px-2.5 py-0.5 text-[10px] font-medium ${style.border} ${style.bg} ${style.text} transition-all duration-300 group-hover:scale-105`}
                      >
                        {skill.level}
                      </span>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
