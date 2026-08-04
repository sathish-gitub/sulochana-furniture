import Image from 'next/image';
import Link from 'next/link';

type PageHeroProps = {
  title: string;
  currentLabel: string;
  imageUrl?: string | null;
  eyebrow?: string;
};

export default function PageHero({ title, currentLabel, imageUrl, eyebrow = 'Page' }: PageHeroProps) {
  const hasImage = Boolean(imageUrl && imageUrl.trim());

  return (
    <section className="relative isolate overflow-hidden">
      <div className="absolute inset-0 bg-stone-900" />
      {hasImage ? <Image src={imageUrl!} alt={title} fill className="object-cover opacity-60" unoptimized priority /> : null}
      <div className="absolute inset-0 bg-gradient-to-b from-stone-900/60 via-stone-900/50 to-stone-900/75" />

      <div className="relative mx-auto max-w-7xl px-6 py-20 text-white lg:px-8 lg:py-24">
        <p className="text-sm font-semibold uppercase tracking-[0.33em] text-white/80">{eyebrow}</p>
        <h1 className="mt-4 font-display text-4xl sm:text-5xl lg:text-6xl">{title}</h1>
        <nav aria-label="Breadcrumb" className="mt-6 text-sm text-white/85">
          <ol className="flex items-center gap-2">
            <li>
              <Link href="/" className="transition hover:text-white">
                Home
              </Link>
            </li>
            <li>/</li>
            <li className="font-medium text-white">{currentLabel}</li>
          </ol>
        </nav>
      </div>
    </section>
  );
}
