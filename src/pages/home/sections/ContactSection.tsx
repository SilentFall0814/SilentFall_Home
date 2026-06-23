import { motion } from "framer-motion";
import { CONTACT, SITE } from "../../../config/site.config";
import { SectionHeading } from "../components/SectionHeading";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

type ContactSectionProps = {
  copiedValue: string | null;
  onCopy: (value: string) => void;
};

export function ContactSection({ copiedValue, onCopy }: ContactSectionProps) {
  return (
    <section
      id="contact"
      className="relative px-4 pb-14 pt-20 sm:px-6 md:pb-24 md:pt-28"
    >
      {/* 陶土橙暖光背景 */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(217,119,87,0.06),transparent_55%)]" />

      <motion.div
        className="relative mx-auto max-w-[1200px] rounded-[1.75rem] border border-clay/12 bg-paper/70 px-5 py-10 shadow-paper backdrop-blur-xs sm:px-8 sm:py-12 md:rounded-[2rem] md:px-10 md:py-16"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.7, ease: EASE }}
      >
        <SectionHeading
          eyebrow={CONTACT.heading.eyebrow}
          title={CONTACT.heading.title}
          description={CONTACT.heading.description}
        />

        <div className="mt-12 grid gap-5 md:grid-cols-2">
          {CONTACT.items.map((item, index) => (
            <motion.article
              key={item.value}
              className="group relative rounded-[1.5rem] border border-ink/8 bg-fog/40 p-5 transition duration-300 ease-expo hover:border-clay/30 hover:bg-paper/80 hover:shadow-warm sm:rounded-[1.75rem] sm:p-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: index * 0.12, ease: EASE }}
            >
              {/* 陶土橙角标 */}
              <div className="absolute right-5 top-5 h-1.5 w-1.5 rounded-full bg-clay/50 transition-transform duration-300 group-hover:scale-150" />

              <div className="flex items-center gap-2">
                <span className="h-px w-5 bg-clay/40" />
                <p className="text-sm font-medium tracking-[0.24em] text-clay">
                  {item.label}
                </p>
              </div>

              <a
                href={item.href}
                className="mt-4 block break-all font-serif text-base font-semibold text-ink transition duration-300 ease-expo hover:text-clay-dark sm:text-lg"
              >
                {item.value}
              </a>

              <p className="mt-3 text-sm leading-7 text-ink/58">
                {item.description}
              </p>

              <button
                type="button"
                onClick={() => onCopy(item.value)}
                className="mt-5 flex w-full items-center justify-center gap-2 rounded-full border border-clay/25 bg-clay/5 px-4 py-2 text-sm font-medium text-clay-dark transition duration-300 ease-expo hover:border-clay/50 hover:bg-clay hover:text-paper sm:w-auto"
              >
                {/* 复制图标 */}
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  className="h-4 w-4"
                >
                  {copiedValue === item.value ? (
                    <path
                      d="M5 13l4 4L19 7"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  ) : (
                    <>
                      <rect x="9" y="9" width="13" height="13" rx="2" />
                      <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
                    </>
                  )}
                </svg>
                <span>
                  {copiedValue === item.value ? CONTACT.copiedButton : CONTACT.copyButton}
                </span>
              </button>
            </motion.article>
          ))}
        </div>

        {/* 底部签名：陶土橙手绘风格 */}
        <motion.div
          className="mt-12 flex items-center justify-center gap-3 text-ink/40"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3, ease: EASE }}
        >
          <span className="h-px w-12 bg-clay/30" />
          <p className="font-serif text-xs italic tracking-[0.2em]">
            {SITE.contactSignature}
          </p>
          <span className="h-px w-12 bg-clay/30" />
        </motion.div>
      </motion.div>
    </section>
  );
}
