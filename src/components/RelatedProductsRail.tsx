'use client';

import { useEffect, useMemo, useState } from 'react';
import ProductCard from '@/components/ProductCard';

type RelatedProduct = {
  id: string;
  name: string;
  slug: string;
  images?: Array<{ url: string }>;
};

type RelatedProductsRailProps = {
  products: RelatedProduct[];
};

export default function RelatedProductsRail({ products }: RelatedProductsRailProps) {
  const [visibleCount, setVisibleCount] = useState(1);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1280) {
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
    const grouped: RelatedProduct[][] = [];

    for (let index = 0; index < products.length; index += visibleCount) {
      grouped.push(products.slice(index, index + visibleCount));
    }

    return grouped;
  }, [products, visibleCount]);

  useEffect(() => {
    setCurrentIndex((previous) => Math.min(previous, Math.max(0, slides.length - 1)));
  }, [slides.length]);

  if (products.length <= 4) {
    return (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    );
  }

  const prevDisabled = currentIndex === 0;
  const nextDisabled = currentIndex >= slides.length - 1;

  return (
    <div>
      <div className="mb-4 flex items-center justify-end gap-3">
        <button
          type="button"
          onClick={() => setCurrentIndex((value) => Math.max(0, value - 1))}
          disabled={prevDisabled}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-stone-300 bg-white text-stone-700 transition hover:border-brand hover:text-brand disabled:cursor-not-allowed disabled:opacity-40"
          aria-label="View previous related products"
        >
          ←
        </button>
        <button
          type="button"
          onClick={() => setCurrentIndex((value) => Math.min(slides.length - 1, value + 1))}
          disabled={nextDisabled}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-stone-300 bg-white text-stone-700 transition hover:border-brand hover:text-brand disabled:cursor-not-allowed disabled:opacity-40"
          aria-label="View next related products"
        >
          →
        </button>
      </div>

      <div className="overflow-hidden">
        <div className="flex transition-transform duration-500 ease-in-out" style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
          {slides.map((slideProducts) => (
            <div key={slideProducts.map((product) => product.id).join('-')} className="w-full min-w-full">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
                {slideProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
