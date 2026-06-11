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
      <p className="text-[11px] uppercase tracking-[0.28em] text-black/35 sm:text-xs sm:tracking-[0.45em]">
        {eyebrow}
      </p>
      <h2 className="mt-4 text-[1.9rem] font-semibold tracking-[-0.05em] text-black sm:mt-5 sm:text-3xl md:text-5xl">
        {title}
      </h2>
      {description ? (
        <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 tracking-[0.08em] text-black/50 sm:mt-6 sm:leading-8 md:text-base md:tracking-[0.12em]">
          {description}
        </p>
      ) : null}
    </div>
  );
}
