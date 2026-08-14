"use client";

import { useEffect, useState } from 'react';
import Image from 'next/image';

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

  const goToSlide = (index: number) => setActiveIndex(index);

  return (
    <section className="relative isolate mt-6 px-4 md:px-6">
      <div className="mx-auto max-w-7xl overflow-hidden rounded-[32px]">
        <div className="relative overflow-hidden rounded-[32px]">
          <div className="flex w-full transition-transform duration-500 ease-in-out" style={{ transform: `translateX(-${activeIndex * 100}%)` }}>
            {banners.map((banner, index) => (
              <div key={banner.id} className="relative min-w-full">
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[32px] bg-transparent md:aspect-[1350/450]">
                  <Image
                    src={banner.image}
                    alt={banner.title ?? `Featured banner ${index + 1}`}
                    fill
                    className="h-full w-full object-cover"
                    unoptimized
                    priority={index === 0}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {banners.length > 1 ? (
        <div className="absolute inset-x-0 bottom-5 z-10 flex items-center justify-center gap-2">
          {banners.map((banner, index) => (
            <button
              key={banner.id}
              type="button"
              aria-label={`Go to banner ${index + 1}`}
              onClick={() => goToSlide(index)}
              className={`h-2.5 rounded-full transition ${index === activeIndex ? 'w-8 bg-white/90' : 'w-2.5 bg-white/60 hover:bg-white'}`}
            />
          ))}
        </div>
      ) : null}
    </section>
  );
}
