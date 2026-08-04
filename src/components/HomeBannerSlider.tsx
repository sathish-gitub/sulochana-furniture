"use client";

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

type BannerItem = {
  id: string;
  image: string;
  title?: string | null;
  subtitle?: string | null;
  ctaLabel?: string | null;
  ctaUrl?: string | null;
};

type HomeBannerSliderProps = {
  banners: BannerItem[];
};

export default function HomeBannerSlider({ banners }: HomeBannerSliderProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (banners.length <= 1) return;
    const interval = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % banners.length);
    }, 5000);

    return () => window.clearInterval(interval);
  }, [banners.length]);

  if (!banners.length) return null;

  const currentBanner = banners[activeIndex];

  const goToSlide = (index: number) => setActiveIndex(index);
  const prevSlide = () => setActiveIndex((current) => (current - 1 + banners.length) % banners.length);
  const nextSlide = () => setActiveIndex((current) => (current + 1) % banners.length);

  return (
    <section className="relative isolate z-0 overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="flex h-full w-full transition-transform duration-500 ease-in-out" style={{ transform: `translateX(-${activeIndex * 100}%)` }}>
          {banners.map((banner, index) => (
            <div key={banner.id} className="relative h-full w-full min-w-full">
              <Image src={banner.image} alt={banner.title ?? `Featured banner ${index + 1}`} fill className="object-cover" unoptimized priority={index === 0} />
            </div>
          ))}
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-stone-950/85 via-stone-900/70 to-stone-900/25" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-[560px] max-w-7xl items-center px-6 py-16 lg:px-8 lg:py-20">
        <div className="max-w-2xl text-white">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.32em] text-[#f5d7bf]">Curated for modern living</p>
          <h1 className="font-display text-4xl leading-tight sm:text-5xl lg:text-6xl">{currentBanner.title ?? 'Crafted furniture for everyday comfort'}</h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-stone-200/90">{currentBanner.subtitle ?? 'Discover timeless furnishings shaped by warmth, quality, and calm design.'}</p>
          {currentBanner.ctaUrl ? (
            <Link href={currentBanner.ctaUrl} className="mt-8 inline-flex w-fit items-center rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand/90">
              {currentBanner.ctaLabel ?? 'Explore collection'}
            </Link>
          ) : null}
          {banners.length > 1 ? (
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <button type="button" aria-label="Previous banner" onClick={prevSlide} className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white transition hover:bg-white/20">
                ←
              </button>
              <button type="button" aria-label="Next banner" onClick={nextSlide} className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white transition hover:bg-white/20">
                →
              </button>
              <div className="ml-1 flex items-center gap-2">
                {banners.map((banner, index) => (
                  <button key={banner.id} type="button" aria-label={`Go to banner ${index + 1}`} onClick={() => goToSlide(index)} className={`h-2.5 rounded-full transition ${index === activeIndex ? 'w-8 bg-white' : 'w-2.5 bg-white/40'}`} />
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
