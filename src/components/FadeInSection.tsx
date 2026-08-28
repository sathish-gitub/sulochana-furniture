"use client";

import { useRef, useEffect } from 'react';
import { motion, useInView, useAnimation } from 'framer-motion';
import type { ReactNode } from 'react';

type FadeInSectionProps = {
  children: ReactNode;
  className?: string;
};

export default function FadeInSection({ children, className }: FadeInSectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  // amount:0 + margin expansion — fires as soon as any pixel enters the viewport, reliable on short mobile screens
  const isInView = useInView(ref, { once: true, amount: 0, margin: "0px 0px -5% 0px" });
  const controls = useAnimation();

  useEffect(() => {
    if (isInView) {
      controls.start({ opacity: 1, y: 0 });
    }
  }, [isInView, controls]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={controls}
      transition={{ duration: 0.5 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
