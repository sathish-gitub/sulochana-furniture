"use client";

import Image from 'next/image';

export default function PageLoader() {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white/80 backdrop-blur-sm">
      <div className="relative flex items-center justify-center" style={{ width: 72, height: 72 }}>
        {/* Static inner icon — never rotates */}
        <Image
          src="/images/loader.svg"
          alt=""
          width={48}
          height={48}
          priority
          className="relative z-10"
        />
        {/* Spinning outer ring — only this element rotates */}
        <span
          aria-hidden
          className="page-loader-ring absolute inset-0 rounded-full"
        />
      </div>
    </div>
  );
}
