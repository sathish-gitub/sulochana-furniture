'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ChevronDown } from 'lucide-react';

type CategoryNode = {
  id: string;
  name: string;
  slug: string;
  children: Array<{
    id: string;
    name: string;
    slug: string;
  }>;
};

type CategoriesMegaMenuProps = {
  categories: CategoryNode[];
};

export default function CategoriesMegaMenu({ categories }: CategoriesMegaMenuProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener('mousedown', handlePointerDown);
    return () => document.removeEventListener('mousedown', handlePointerDown);
  }, []);

  return (
    <div ref={containerRef} className="relative hidden md:block">
      <button
        type="button"
        onMouseEnter={() => setOpen(true)}
        onClick={() => setOpen((value) => !value)}
        className="flex items-center gap-2 text-sm font-medium uppercase tracking-[0.24em] text-stone-700 transition hover:text-brand"
      >
        <span>Categories</span>
        <ChevronDown className={`h-4 w-4 transition ${open ? 'rotate-180' : ''}`} />
      </button>

      {open ? (
        <div
          onMouseLeave={() => setOpen(false)}
          className="absolute left-1/2 top-full z-50 mt-4 w-[min(92vw,74rem)] -translate-x-1/2 rounded-[2rem] border border-stone-200 bg-white/95 p-6 shadow-[0_24px_80px_rgba(0,0,0,0.16)] backdrop-blur"
        >
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {categories.map((category) => (
              <div key={category.id} className="rounded-[1.5rem] border border-stone-200 bg-stone-50/80 p-5">
                <Link href={`/category/${category.slug}`} onClick={() => setOpen(false)} className="font-display text-lg font-semibold text-stone-900 transition hover:text-brand">
                  {category.name}
                </Link>
                {category.children.length > 0 ? (
                  <ul className="mt-3 space-y-2">
                    {category.children.map((child) => (
                      <li key={child.id}>
                        <Link href={`/category/${child.slug}`} onClick={() => setOpen(false)} className="block text-sm text-stone-600 transition hover:text-brand">
                          {child.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
