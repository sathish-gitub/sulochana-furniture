'use client';

import { useState } from 'react';
import { Menu, X } from 'lucide-react';

export default function MobileSidebarToggle({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="inline-flex items-center justify-center rounded-md border border-stone-200 p-2 text-stone-600 md:hidden"
        aria-label={open ? 'Close menu' : 'Open menu'}
      >
        {open ? <X size={20} /> : <Menu size={20} />}
      </button>

      {open ? (
        <div className="fixed inset-0 z-40 flex md:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
          <div className="relative z-50 h-full w-64 bg-white shadow-lg">{children}</div>
        </div>
      ) : null}
    </>
  );
}
