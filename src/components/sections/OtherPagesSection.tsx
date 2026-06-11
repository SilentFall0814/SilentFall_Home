import { OTHER_PAGES } from '../../constants/site';

export function OtherPagesSection() {
  return (
    <section id="other-pages" className="relative px-4 py-20 sm:px-6 md:py-32">
      <div className="mx-auto max-w-[800px]">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-[11px] tracking-[0.28em] text-black/35 sm:text-xs sm:tracking-[0.45em]">个人页面</p>
          <h2 className="mt-4 text-[1.9rem] font-semibold tracking-[-0.05em] text-black sm:mt-5 sm:text-3xl md:text-5xl">
            我的个人页面
          </h2>
        </div>

        <div className="mt-12 flex flex-wrap items-center justify-center gap-3 sm:mt-14 sm:gap-4">
          {OTHER_PAGES.map((page) => (
            <a
              key={page.id}
              href={page.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2.5 rounded-xl border border-black/10 bg-black/[0.03] px-5 py-3 text-sm font-medium text-black/70 transition duration-300 ease-expo hover:border-black/20 hover:bg-white hover:text-black sm:px-6 sm:py-3.5"
            >
              {page.icon}
              <span>{page.title}</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
