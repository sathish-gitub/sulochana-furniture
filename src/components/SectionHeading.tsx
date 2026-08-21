type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  description?: string | null;
  centered?: boolean;
  className?: string;
  eyebrowClassName?: string;
  titleClassName?: string;
  descriptionClassName?: string;
};

export default function SectionHeading({ eyebrow, title, description, centered = true, className, eyebrowClassName, titleClassName, descriptionClassName }: SectionHeadingProps) {
  return (
    <div className={`${centered ? 'mx-auto max-w-3xl text-center' : ''} ${className ?? ''}`.trim()}>
      <div className={`flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.33em] text-brand ${centered ? 'justify-center' : ''} ${eyebrowClassName ?? ''}`.trim()}>
        <span className="h-1.5 w-1.5 rounded-full bg-brandBg" />
        <span>{eyebrow}</span>
      </div>
      <h2 className={`mt-4 font-display text-3xl text-stone-900 sm:text-4xl ${titleClassName ?? ''}`.trim()}>{title}</h2>
      {description ? <p className={`mt-4 text-base leading-8 text-stone-600 ${centered ? 'mx-auto max-w-2xl' : ''} ${descriptionClassName ?? ''}`.trim()}>{description}</p> : null}
    </div>
  );
}
