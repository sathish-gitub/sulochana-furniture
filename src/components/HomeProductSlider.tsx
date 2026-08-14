"use client";

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import WhatsAppButton from '@/components/WhatsAppButton';
import { buildProductAbsoluteUrl } from '@/lib/whatsapp';

type HomeProductSliderProps = {
  products: Array<{
    id: string;
    name: string;
    slug: string;
    images?: Array<{ url: string }> | null;
  }>;
  whatsappNumber?: string | null;
};

export default function HomeProductSlider({ products, whatsappNumber }: HomeProductSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(1);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setVisibleCount(4);
        return;
      }

      if (window.innerWidth >= 768) {
        setVisibleCount(2);
        return;
      }

      setVisibleCount(1);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const slides = useMemo(() => {
    const groups: Array<Array<{ id: string; name: string; slug: string; images?: Array<{ url: string }> | null }>> = [];
    for (let index = 0; index < products.length; index += visibleCount) {
      groups.push(products.slice(index, index + visibleCount));
    }
    return groups;
  }, [products, visibleCount]);

  useEffect(() => {
    setCurrentIndex((previous) => Math.min(previous, Math.max(0, slides.length - 1)));
  }, [slides.length]);

  if (!products.length) return null;

  const prevDisabled = currentIndex === 0;
  const nextDisabled = currentIndex >= slides.length - 1;

  return (
    <div className="mt-10">
      <div className="mb-4 flex items-center justify-end gap-3">
        <button type="button" onClick={() => setCurrentIndex((value) => Math.max(0, value - 1))} disabled={prevDisabled} className="flex h-10 w-10 items-center justify-center rounded-full border border-stone-300 bg-white text-stone-700 transition hover:border-brand hover:text-brand disabled:cursor-not-allowed disabled:opacity-40" aria-label="View previous products">
          ←
        </button>
        <button type="button" onClick={() => setCurrentIndex((value) => Math.min(slides.length - 1, value + 1))} disabled={nextDisabled} className="flex h-10 w-10 items-center justify-center rounded-full border border-stone-300 bg-white text-stone-700 transition hover:border-brand hover:text-brand disabled:cursor-not-allowed disabled:opacity-40" aria-label="View next products">
          →
        </button>
      </div>
      <div className="overflow-hidden touch-none">
        <div className="flex transition-transform duration-500 ease-in-out" style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
          {slides.map((slideProducts) => (
            <div key={slideProducts.map((product) => product.id).join('-')} className="w-full min-w-full">
              <div className="grid gap-5 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
                {slideProducts.map((product) => {
                  const imageUrl = product.images?.[0]?.url ?? 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80';
                  const productUrl = buildProductAbsoluteUrl(product.slug);

                  return (
                    <article key={product.id} className="group min-w-0 overflow-hidden rounded-[1.5rem] border border-stone-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
                      <Link href={`/product/${product.slug}`} className="block">
                        <div className="relative aspect-[4/3] overflow-hidden bg-stone-100 p-3">
                          <Image src={imageUrl} alt={product.name} fill className="rounded-[1rem] object-cover transition duration-500 group-hover:scale-105" unoptimized />
                        </div>
                      </Link>
                      <div className="space-y-4 p-5">
                        <Link href={`/product/${product.slug}`} className="block">
                          <h3 className="font-display text-xl text-stone-800">{product.name}</h3>
                        </Link>
                        {whatsappNumber ? (
                          <WhatsAppButton phone={whatsappNumber} productName={product.name} productUrl={productUrl} className="inline-flex w-full items-center justify-center rounded-full border border-brand/20 bg-white px-4 py-2.5 text-sm font-semibold text-brand transition hover:bg-brand hover:text-white" />
                        ) : null}
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
