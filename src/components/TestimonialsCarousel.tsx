'use client';

import { useState } from 'react';
import SectionHeading from '@/components/SectionHeading';

type TestimonialItem = {
  id: string;
  name: string;
  quote: string;
  rating: number;
};

type TestimonialsCarouselProps = {
  testimonials: TestimonialItem[];
};

export default function TestimonialsCarousel({ testimonials }: TestimonialsCarouselProps) {
  const [testimonialIndex, setTestimonialIndex] = useState(0);
  const totalSlides = Math.max(1, testimonials.length);

  if (!testimonials.length) return null;

  return (
    <section>
      <SectionHeading eyebrow="Testimonials" title="Loved by our clients" description="The comfort and quality of our furniture continue to speak for themselves." />
      <div className="mt-8 flex items-center justify-end gap-3">
        <button
          type="button"
          onClick={() => setTestimonialIndex((current) => (current === 0 ? totalSlides - 1 : current - 1))}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-stone-300 bg-white text-stone-700 transition hover:border-brand hover:text-brand"
          aria-label="Previous testimonials"
        >
          ←
        </button>
        <button
          type="button"
          onClick={() => setTestimonialIndex((current) => (current + 1) % totalSlides)}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-stone-300 bg-white text-stone-700 transition hover:border-brand hover:text-brand"
          aria-label="Next testimonials"
        >
          →
        </button>
      </div>
      <div className="mt-6 overflow-hidden">
        <div className="flex transition-transform duration-500 ease-in-out" style={{ transform: `translateX(-${testimonialIndex * 100}%)` }}>
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="w-full min-w-full">
              <article className="mx-auto max-w-4xl rounded-[1.5rem] border border-stone-200 bg-[#fcf8f2] p-8 text-center shadow-sm lg:p-10">
                <div className="mb-4 flex justify-center text-brand">
                  {Array.from({ length: testimonial.rating }).map((_, starIndex) => (
                    <span key={starIndex}>★</span>
                  ))}
                </div>
                <p className="text-lg leading-8 text-stone-700">“{testimonial.quote}”</p>
                <p className="mt-6 font-semibold text-stone-900">{testimonial.name}</p>
              </article>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
