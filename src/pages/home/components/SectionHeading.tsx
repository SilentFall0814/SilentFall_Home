type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  description?: string;
};

export function SectionHeading({
  eyebrow,
  title,
  description,
}: SectionHeadingProps) {
  return (
    <div className="mx-auto max-w-3xl text-center">
      {/* eyebrow：陶土橙小字 + 手绘风格短横线装饰 */}
      <div className="flex items-center justify-center gap-3">
        <span className="h-px w-8 bg-clay/40" />
        <p className="text-[11px] font-medium uppercase tracking-[0.32em] text-clay sm:text-xs sm:tracking-[0.42em]">
          {eyebrow}
        </p>
        <span className="h-px w-8 bg-clay/40" />
      </div>
      {/* 标题：Lora 衬线字体，编辑式气质 */}
      <h2 className="mt-5 font-serif text-[1.9rem] font-semibold leading-tight tracking-[-0.02em] text-ink sm:mt-6 sm:text-3xl md:text-[2.75rem] md:leading-[1.15]">
        {title}
      </h2>
      {description ? (
        <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 tracking-[0.04em] text-ink/55 sm:mt-6 sm:leading-8 md:text-base md:tracking-[0.06em]">
          {description}
        </p>
      ) : null}
    </div>
  );
}
