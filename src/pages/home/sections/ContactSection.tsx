import { CONTACT_ITEMS } from "../content";
import { SectionHeading } from "../components/SectionHeading";

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
      <div className="mx-auto max-w-[1200px] rounded-[1.75rem] border border-black/6 bg-white/60 px-5 py-10 shadow-soft backdrop-blur-xs sm:px-8 sm:py-12 md:rounded-[2rem] md:px-10 md:py-16">
        <SectionHeading
          eyebrow="联系我"
          title="这里是主包的邮箱地址哦！"
          description="你有什么想和我单独说的呢？欢迎投稿！"
        />

        <div className="mt-12 grid gap-5 md:grid-cols-2">
          {CONTACT_ITEMS.map((item) => (
            <article
              key={item.value}
              className="rounded-[1.5rem] border border-black/8 bg-black/[0.03] p-5 sm:rounded-[1.75rem] sm:p-6"
            >
              <p className="text-sm font-semibold tracking-[0.24em] text-black/35">
                {item.label}
              </p>
              <a
                href={item.href}
                className="mt-4 block break-all text-base font-semibold text-black transition hover:opacity-75 sm:text-lg"
              >
                {item.value}
              </a>
              <p className="mt-3 text-sm leading-7 text-black/58">
                {item.description}
              </p>
              <button
                type="button"
                onClick={() => onCopy(item.value)}
                className="mt-5 w-full rounded-full border border-black/12 px-4 py-2 text-sm text-black transition duration-300 ease-expo hover:border-black/22 hover:bg-white sm:w-auto"
              >
                {copiedValue === item.value ? "已复制邮箱" : "复制邮箱地址"}
              </button>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
