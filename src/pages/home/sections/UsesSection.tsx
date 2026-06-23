import { motion } from "framer-motion";
import { USES } from "../../../config/site.config";
import { SectionHeading } from "../components/SectionHeading";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

export function UsesSection() {
  return (
    <section
      id="uses"
      className="relative overflow-hidden px-4 py-20 sm:px-6 md:py-32"
    >
      {/* 陶土橙微光背景 */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(217,119,87,0.05),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,rgba(255,253,247,0.92),rgba(250,249,245,0.75)_48%,rgba(245,243,237,0.88))]" />

      <div className="relative mx-auto max-w-[1000px]">
        <SectionHeading
          eyebrow={USES.heading.eyebrow}
          title={USES.heading.title}
          description={USES.heading.description}
        />

        <div className="mt-12 grid gap-8 sm:mt-14 md:grid-cols-2">
          {/* 硬件 */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, ease: EASE }}
          >
            <div className="flex items-center gap-2 mb-5">
              <span className="h-px w-5 bg-clay/40" />
              <h3 className="font-serif text-base font-semibold text-ink">{USES.hardwareLabel}</h3>
            </div>
            <div className="space-y-3">
              {USES.hardware.map((item, index) => (
                <motion.div
                  key={item.name}
                  className="group rounded-[1.25rem] border border-ink/8 bg-paper/60 p-5 shadow-paper transition duration-300 ease-expo hover:border-clay/20 hover:shadow-warm"
                  initial={{ opacity: 0, x: -12 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.08, ease: EASE }}
                >
                  <p className="font-serif text-sm font-semibold text-ink">
                    {item.name}
                  </p>
                  <p className="mt-1.5 text-sm leading-6 text-ink/55">
                    {item.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* 软件 */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, delay: 0.12, ease: EASE }}
          >
            <div className="flex items-center gap-2 mb-5">
              <span className="h-px w-5 bg-clay/40" />
              <h3 className="font-serif text-base font-semibold text-ink">{USES.softwareLabel}</h3>
            </div>
            <div className="space-y-3">
              {USES.software.map((item, index) => (
                <motion.div
                  key={item.name}
                  className="group rounded-[1.25rem] border border-ink/8 bg-paper/60 p-5 shadow-paper transition duration-300 ease-expo hover:border-clay/20 hover:shadow-warm"
                  initial={{ opacity: 0, x: 12 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.08, ease: EASE }}
                >
                  <p className="font-serif text-sm font-semibold text-ink">
                    {item.name}
                  </p>
                  <p className="mt-1.5 text-sm leading-6 text-ink/55">
                    {item.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
