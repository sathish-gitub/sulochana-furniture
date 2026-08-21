'use client';

import { motion } from 'framer-motion';
import { Headset, Leaf, ShieldCheck, Truck } from 'lucide-react';
import SectionHeading from '@/components/SectionHeading';

type FeatureCard = {
  icon: 'shield' | 'leaf' | 'headset' | 'truck';
  title: string;
};

type WhyChooseUsSectionProps = {
  featureCards?: FeatureCard[];
};

const defaultFeatureCards: FeatureCard[] = [
  { icon: 'shield', title: 'Premium Quality' },
  { icon: 'leaf', title: 'Sustainable Materials' },
  { icon: 'headset', title: 'Customer Support' },
  { icon: 'truck', title: 'Swift Delivery' },
];

export default function WhyChooseUsSection({ featureCards = defaultFeatureCards }: WhyChooseUsSectionProps) {
  return (
    <section className="bg-brandBg">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-20">
        <div className="rounded-[2rem] bg-brandBg p-8 text-white shadow-[0_20px_60px_rgba(0,0,0,0.12)] lg:p-12">
          <SectionHeading
            eyebrow="Why Choose Us"
            title="Elevate Your Home Comfort"
            description="Every piece is selected to bring warmth, craftsmanship, and lasting comfort into your home."
            eyebrowClassName="text-white"
            titleClassName="text-white"
            descriptionClassName="text-white/90"
            className="text-white"
          />
          <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {featureCards.map(({ icon, title }, index) => {
              const Icon = icon === 'leaf' ? Leaf : icon === 'headset' ? Headset : icon === 'truck' ? Truck : ShieldCheck;

              return (
                <motion.div
                  key={title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.45, delay: index * 0.05 }}
                  className="rounded-[1.5rem] border border-white/20 bg-[#f7efe8] p-8 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                >
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-brandBg/10 text-brand">
                    <Icon className="h-7 w-7" />
                  </div>
                  <h3 className="mt-6 font-display text-xl text-stone-800">{title}</h3>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
