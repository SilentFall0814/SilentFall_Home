import { motion } from "framer-motion";
import { SITE, SOCIAL_LINKS } from "../../config/site.config";
import { SocialIcon } from "../SocialIcon";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative border-t border-ink/8 px-4 py-12 sm:px-6 md:py-16">
      {/* 陶土橙底部微光 */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(217,119,87,0.04),transparent_50%)]" />

      <div className="relative mx-auto max-w-[1000px]">
        <div className="flex flex-col items-center gap-8 md:flex-row md:justify-between">
          {/* 左侧：品牌签名 */}
          <motion.div
            className="text-center md:text-left"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: EASE }}
          >
            <div className="flex items-center justify-center gap-2 md:justify-start">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-clay animate-pulseClay" />
              <span className="font-serif text-sm font-semibold tracking-[0.18em] text-ink">
                {SITE.name}
              </span>
            </div>
            <p className="mt-2 text-xs leading-6 text-ink/40">
              {SITE.footerTagline}
            </p>
          </motion.div>

          {/* 中间：社交链接 */}
          <motion.div
            className="flex items-center gap-4"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1, ease: EASE }}
          >
            {SOCIAL_LINKS.map((page) => (
              <a
                key={page.id}
                href={page.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-ink/10 text-ink/40 transition duration-300 ease-expo hover:border-clay/30 hover:bg-clay/5 hover:text-clay"
                title={page.title}
              >
                <SocialIcon icon={page.icon} />
              </a>
            ))}
          </motion.div>

          {/* 右侧：版权 */}
          <motion.div
            className="text-center md:text-right"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2, ease: EASE }}
          >
            <p className="text-xs text-ink/35">
              &copy; {currentYear} {SITE.name}
            </p>
            <p className="mt-1 text-[10px] text-ink/25">
              {SITE.footerCopyright}
            </p>
          </motion.div>
        </div>
      </div>
    </footer>
  );
}
