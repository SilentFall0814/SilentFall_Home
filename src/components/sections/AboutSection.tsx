import { ABOUT_POINTS } from '../../constants/site';

type AboutSectionProps = {
  renderSectionHeading: (props: {
    eyebrow: string;
    title: string;
    description?: string;
  }) => React.JSX.Element;
};

export function AboutSection({ renderSectionHeading }: AboutSectionProps) {
  return (
    <section id="about" className="relative overflow-hidden px-4 py-20 sm:px-6 md:py-32">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.95),rgba(245,245,243,0.8)_48%,rgba(240,240,238,0.9))]" />
      <div className="relative mx-auto max-w-[1200px]">
        {renderSectionHeading({
          eyebrow: '个人简介',
          title: '你好！我是SilentFall',
          description: '我是一名学生，一个试图把脑子里的奇怪想法变成软件的人...',
        })}

        <div className="mt-12 grid gap-5 sm:mt-14 sm:gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-[1.75rem] border border-black/8 bg-white/70 p-6 shadow-soft backdrop-blur-xs sm:p-8 md:rounded-[2rem] md:p-10">
            <p className="text-sm font-semibold tracking-[0.3em] text-black/30">关于我</p>
            <h3 className="mt-5 text-[1.75rem] font-semibold tracking-[-0.04em] text-black sm:text-2xl md:text-4xl">
              一个社恐、宅男、一个有着非常非常多的奇怪想法的人类
            </h3>
            <p className="mt-6 text-sm leading-8 text-black/60 md:text-base">
              平时喜欢待在电脑前折腾点东西，有时候是写点小程序，有时候只是单纯地把桌面整理得更顺眼一点。
            </p>
            <p className="mt-6 text-sm leading-8 text-black/60 md:text-base">
              我对“为什么会这样”这种问题有点执念，比如会突然想做一个网页来介绍自己，然后就真的来做了个网页。
            </p>
            <p className="mt-6 text-sm leading-8 text-black/60 md:text-base">我的一些标签：</p>
            <div className="mt-8 flex flex-wrap gap-2.5 text-sm text-black/60 sm:gap-3">
              <span className="rounded-full border border-black/10 px-4 py-2">宅男</span>
              <span className="rounded-full border border-black/10 px-4 py-2">社恐</span>
              <span className="rounded-full border border-black/10 px-4 py-2">抽象</span>
              <span className="rounded-full border border-black/10 px-4 py-2">伪人</span>
            </div>
          </div>

          <div className="grid gap-4">
            {ABOUT_POINTS.map((item) => (
              <article
                key={item.title}
                className="rounded-[1.5rem] border border-black/8 bg-black/[0.03] p-5 transition duration-300 ease-expo hover:-translate-y-1 hover:bg-white/70 sm:rounded-[1.75rem] sm:p-6"
              >
                <p className="text-sm font-semibold tracking-[0.22em] text-black/35">{item.title}</p>
                <p className="mt-4 text-sm leading-7 text-black/60">{item.description}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
