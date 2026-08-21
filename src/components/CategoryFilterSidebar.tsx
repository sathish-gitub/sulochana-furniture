'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { ChevronDown } from 'lucide-react';

type SidebarCategory = {
  id: string;
  name: string;
  slug: string;
  children: Array<{
    id: string;
    name: string;
    slug: string;
  }>;
};

type CategoryFilterSidebarProps = {
  categories: SidebarCategory[];
  currentCategorySlug: string;
  currentTopLevelSlug: string;
};

export default function CategoryFilterSidebar({ categories, currentCategorySlug, currentTopLevelSlug }: CategoryFilterSidebarProps) {
  const initialExpanded = useMemo(
    () =>
      categories.reduce<Record<string, boolean>>((accumulator, category) => {
        accumulator[category.id] = category.slug === currentTopLevelSlug;
        return accumulator;
      }, {}),
    [categories, currentTopLevelSlug]
  );

  const [expanded, setExpanded] = useState<Record<string, boolean>>(initialExpanded);

  return (
    <div className="rounded-[1.5rem] border border-stone-200 bg-white p-5 shadow-sm lg:sticky lg:top-28">
      <h2 className="font-display text-2xl text-stone-900">Categories</h2>
      <div className="mt-5 space-y-3">
        {categories.map((category) => {
          const isCurrentTopLevel = category.slug === currentTopLevelSlug;
          const isExpanded = expanded[category.id] ?? false;

          return (
            <div key={category.id} className="rounded-2xl border border-stone-200 bg-white/70 p-3">
              <div className="flex items-center justify-between gap-2">
                <Link
                  href={`/category/${category.slug}`}
                  className={`text-sm uppercase tracking-[0.18em] transition ${isCurrentTopLevel ? 'font-semibold text-brand' : 'font-medium text-stone-700 hover:text-brand'}`}
                >
                  {category.name}
                </Link>
                {category.children.length > 0 ? (
                  <button
                    type="button"
                    onClick={() => setExpanded((previous) => ({ ...previous, [category.id]: !isExpanded }))}
                    className="rounded-full border border-stone-200 p-1 text-stone-500 transition hover:border-brand hover:text-brand"
                    aria-label={`Toggle ${category.name} subcategories`}
                  >
                    <ChevronDown className={`h-4 w-4 transition ${isExpanded ? 'rotate-180' : ''}`} />
                  </button>
                ) : null}
              </div>
              {category.children.length > 0 && isExpanded ? (
                <ul className="mt-3 space-y-2 border-t border-stone-200 pt-3">
                  {category.children.map((child) => {
                    const isCurrentChild = child.slug === currentCategorySlug;
                    return (
                      <li key={child.id}>
                        <Link
                          href={`/category/${child.slug}`}
                          className={`block rounded-full px-3 py-1.5 text-sm transition ${isCurrentChild ? 'bg-brandBg text-white' : 'bg-stone-100 text-stone-600 hover:bg-brandBg/10 hover:text-brand'}`}
                        >
                          {child.name}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}
