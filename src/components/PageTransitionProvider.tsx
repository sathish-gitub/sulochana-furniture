"use client";

import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import PageLoader from './PageLoader';

export default function PageTransitionProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);
  const prevPathname = useRef(pathname);
  // Track whether the initial mount is done so we never show loader on first load
  const mounted = useRef(false);

  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      return;
    }
    if (pathname !== prevPathname.current) {
      prevPathname.current = pathname;
      setLoading(true);
      // Hide loader once the new page has painted (next macro task after pathname commit)
      const id = setTimeout(() => setLoading(false), 400);
      return () => clearTimeout(id);
    }
  }, [pathname]);

  return (
    <>
      {loading && <PageLoader />}
      {children}
    </>
  );
}
