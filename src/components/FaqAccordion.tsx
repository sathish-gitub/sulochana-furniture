'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import SectionHeading from '@/components/SectionHeading';

type FaqItem = {
  question: string;
  answer: string;
};

type FaqAccordionProps = {
  items: FaqItem[];
};

export default function FaqAccordion({ items }: FaqAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section>
      <SectionHeading
        eyebrow="Frequently Asked Questions"
        title="Answers Before You Ask"
        description="Everything you need to know before choosing your next furniture piece."
      />
      <div className="mx-auto mt-8 max-w-4xl space-y-3">
        {items.map((item, index) => {
          const isOpen = openIndex === index;

          return (
            <div key={item.question} className="overflow-hidden rounded-2xl border border-stone-200 bg-[#fcf8f2]">
              <button
                type="button"
                onClick={() => setOpenIndex((current) => (current === index ? null : index))}
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
              >
                <span className="font-medium text-stone-800">{item.question}</span>
                <ChevronDown className={`h-4 w-4 shrink-0 text-stone-600 transition ${isOpen ? 'rotate-180' : ''}`} />
              </button>
              {isOpen ? <div className="border-t border-stone-200 px-5 py-4 text-sm leading-7 text-stone-600">{item.answer}</div> : null}
            </div>
          );
        })}
      </div>
    </section>
  );
}
