"use client";

import { useState } from 'react';

export default function HeaderSearch() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  return (
    <div className="flex items-center gap-2">
      {searchOpen ? (
        <form action="/search" method="get" className="flex items-center gap-2 rounded-full border border-stone-300 bg-white px-3 py-2 shadow-sm">
          <input type="text" name="q" value={searchValue} onChange={(event) => setSearchValue(event.target.value)} placeholder="Search products" className="w-32 bg-transparent text-sm text-stone-700 outline-none" />
          <button type="submit" className="text-sm font-semibold text-brand">Go</button>
        </form>
      ) : null}
      <button type="button" aria-label="Search" onClick={() => setSearchOpen((current) => !current)} className="flex h-10 w-10 items-center justify-center rounded-full border border-stone-300 bg-white text-stone-600 transition hover:border-brand hover:text-brand">
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
          <circle cx="11" cy="11" r="5.5" />
          <path strokeLinecap="round" d="M16 16l4 4" />
        </svg>
      </button>
    </div>
  );
}
