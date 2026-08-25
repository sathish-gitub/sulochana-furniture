'use client';

import Image from 'next/image';
import { useState } from 'react';
import Link from 'next/link';

type CategoryNode = {
  id: string;
  name: string;
  slug: string;
  children: Array<{
    id: string;
    name: string;
    slug: string;
  }>;
  products: Array<{
    id: string;
    name: string;
    slug: string;
  }>;
};

type NavItem = {
  id: string;
  label: string;
  href: string;
};

type MobileNavProps = {
  items: NavItem[];
  categories?: CategoryNode[];
};

export default function MobileNav({ items, categories = [] }: MobileNavProps) {
  const [open, setOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);

  return (
    <div className="relative z-[70] md:hidden">
      <button
        type="button"
        aria-label="Open navigation menu"
        onClick={() => setOpen(true)}
        className="rounded-full border border-stone-300 p-2 text-stone-700 transition hover:border-brand hover:text-brand"
      >
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 7h16M4 12h16M4 17h16" />
        </svg>
      </button>

      {open ? (
        <div className="fixed inset-0 z-[90] w-screen h-screen bg-stone-950/80" onClick={() => setOpen(false)}>
          <div className="ml-auto flex h-screen min-h-screen w-[min(22rem,100vw)] max-w-full flex-col bg-white p-6 shadow-2xl" onClick={(event) => event.stopPropagation()}>
            <div className="mb-6 flex items-center justify-between">
              <Link href="/" onClick={() => setOpen(false)} className="block">
                <Image
                  src="/images/sulo_logo.png"
                  alt="Sulochana Furniture"
                  width={542}
                  height={152}
                  className="h-10 w-auto"
                  priority
                />
              </Link>
              <button type="button" onClick={() => setOpen(false)} className="rounded-full border border-stone-300 p-2 text-stone-700">
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 6l12 12M18 6L6 18" />
                </svg>
              </button>
            </div>

            <nav className="min-h-0 flex-1 space-y-3 overflow-y-auto pb-8">
              {items.map((item) => (
                <Link key={item.id} href={item.href} onClick={() => setOpen(false)} className="block rounded-2xl px-3 py-3 text-base font-medium text-stone-700 transition hover:bg-stone-100 hover:text-brand">
                  {item.label}
                </Link>
              ))}

              {categories.length > 0 ? (
                <div className="rounded-2xl border border-stone-200 bg-stone-50 p-3">
                  <button type="button" onClick={() => setCategoriesOpen((value) => !value)} className="flex w-full items-center justify-between rounded-xl px-2 py-2 text-left text-base font-medium text-stone-700">
                    <span>Categories</span>
                    <span className="text-sm text-stone-500">{categoriesOpen ? '−' : '+'}</span>
                  </button>
                  {categoriesOpen ? (
                    <div className="mt-3 space-y-3">
                      {categories.map((category) => (
                        <div key={category.id}>
                          <Link href={`/category/${category.slug}`} onClick={() => setOpen(false)} className="block px-2 py-1 text-sm font-semibold text-stone-800 transition hover:text-brand">
                            {category.name}
                          </Link>
                          {category.children.length > 0 || category.products.length > 0 ? (
                            <ul className="mt-2 space-y-1 pl-3">
                              {category.children.map((child) => (
                                <li key={child.id}>
                                  <Link href={`/category/${child.slug}`} onClick={() => setOpen(false)} className="block text-sm text-stone-600 transition hover:text-brand">
                                    {child.name}
                                  </Link>
                                </li>
                              ))}
                              {category.products.map((product) => (
                                <li key={product.id}>
                                  <Link href={`/product/${product.slug}`} onClick={() => setOpen(false)} className="block text-sm text-stone-600 transition hover:text-brand">
                                    {product.name}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          ) : null}
                        </div>
                      ))}
                    </div>
                  ) : null}
                </div>
              ) : null}
            </nav>
          </div>
        </div>
      ) : null}
    </div>
  );
}
