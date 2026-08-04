'use client';

import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';

type ProductImage = {
  id: string;
  url: string;
};

type ProductImageGalleryProps = {
  productName: string;
  images: ProductImage[];
};

export default function ProductImageGallery({ productName, images }: ProductImageGalleryProps) {
  const normalizedImages = useMemo(
    () =>
      images
        .filter((image) => Boolean(image.url && image.url.trim()))
        .map((image) => ({ ...image, url: image.url.trim() })),
    [images]
  );
  const visibleImages = normalizedImages.slice(0, 4);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    setActiveIndex(0);
  }, [images]);

  if (!visibleImages.length) {
    return (
      <div className="flex aspect-[4/3] items-center justify-center rounded-[1.5rem] border border-dashed border-stone-300 bg-stone-100 text-stone-500">
        No image available
      </div>
    );
  }

  const safeActiveIndex = Math.min(activeIndex, visibleImages.length - 1);
  const activeImage = visibleImages[safeActiveIndex];

  return (
    <div className="space-y-4">
      <div className="relative aspect-[4/3] overflow-hidden rounded-[1.75rem] border border-stone-200 bg-stone-100 p-3 shadow-sm">
        <Image src={activeImage.url} alt={productName} fill className="rounded-[1.35rem] object-cover" unoptimized priority />
      </div>

      {visibleImages.length > 1 ? (
        <div className="grid grid-cols-4 gap-3">
          {visibleImages.map((image, index) => {
            const isActive = index === safeActiveIndex;

            return (
              <button
                key={image.id}
                type="button"
                onClick={() => setActiveIndex(index)}
                className={`relative aspect-square w-full overflow-hidden rounded-xl border p-1 transition ${isActive ? 'border-brand' : 'border-stone-200 hover:border-brand/60'}`}
                aria-label={`View image ${index + 1}`}
              >
                <Image src={image.url} alt={`${productName} thumbnail ${index + 1}`} fill className="rounded-lg object-cover" unoptimized />
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
