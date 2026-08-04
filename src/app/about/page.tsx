import type { Metadata } from 'next';
import Image from 'next/image';
import FadeInSection from '@/components/FadeInSection';
import FaqAccordion from '@/components/FaqAccordion';
import PageHero from '@/components/PageHero';
import SectionHeading from '@/components/SectionHeading';
import TestimonialsCarousel from '@/components/TestimonialsCarousel';
import WhyChooseUsSection from '@/components/WhyChooseUsSection';
import { prisma, safePrismaQuery } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'About Us | Sulochana Furniture',
};

const faqItems = [
  {
    question: 'Do you offer custom furniture?',
    answer: 'Yes. We can tailor dimensions, finishes, and upholstery based on your room layout and design goals.',
  },
  {
    question: 'What materials do you use?',
    answer: 'Our collections primarily use solid wood, engineered wood, and premium upholstery chosen for longevity and comfort.',
  },
  {
    question: 'Do you deliver outside Pollachi?',
    answer: 'Yes, we support deliveries across nearby regions. Delivery timelines vary by location and product type.',
  },
  {
    question: 'How do I place an order?',
    answer: 'You can place your order directly through our WhatsApp support team for quick recommendations and confirmations.',
  },
  {
    question: 'Can I visit the store before ordering?',
    answer: 'Absolutely. We encourage showroom visits so you can experience material quality, comfort, and finishes in person.',
  },
];

export default async function AboutPage() {
  const [settings, testimonials, awards] = await Promise.all([
    safePrismaQuery(() => prisma.siteSetting.findUnique({ where: { id: 'singleton' } }), null),
    safePrismaQuery(() => prisma.testimonial.findMany({ where: { featured: true }, orderBy: { createdAt: 'desc' }, take: 12 }), []),
    safePrismaQuery(() => prisma.award.findMany({ orderBy: { order: 'asc' } }), []),
  ]);

  return (
    <div className="bg-cream pb-16">
      <PageHero title="About Us" currentLabel="About Us" imageUrl={settings?.aboutBanner} eyebrow="About" />

      {settings?.storyTitle && settings.storyContent ? (
        <FadeInSection className="mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-20">
          <div className="grid gap-10 rounded-[2rem] border border-stone-200 bg-[#fcf8f2] p-8 shadow-sm lg:grid-cols-[1.05fr_0.95fr] lg:p-12">
            <div className="relative min-h-[320px] overflow-hidden rounded-[1.5rem] bg-stone-100 p-3">
              {settings.storyImage ? (
                <Image src={settings.storyImage} alt={settings.storyTitle} fill className="rounded-[1.25rem] object-cover" unoptimized />
              ) : (
                <div className="flex h-full w-full items-center justify-center rounded-[1.25rem] border border-dashed border-stone-300 bg-stone-200/60 text-sm text-stone-500">
                  Story image not configured yet
                </div>
              )}
            </div>
            <div className="flex flex-col justify-center">
              <SectionHeading eyebrow="Our Story" title={settings.storyTitle} description={settings.storyContent} centered={false} />
            </div>
          </div>
        </FadeInSection>
      ) : null}

      <FadeInSection className="mx-auto max-w-7xl px-6 py-8 lg:px-8 lg:py-10">
        <div className="grid gap-6 md:grid-cols-2">
          <article className="relative isolate min-h-[320px] overflow-hidden rounded-[1.75rem] border border-stone-200 bg-stone-900 p-8">
            <Image
              src="https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1200&q=80"
              alt="Our vision"
              fill
              className="object-cover opacity-70"
              unoptimized
            />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-stone-900/45 to-transparent" />
            <div className="relative flex h-full flex-col justify-end">
              <p className="text-sm font-semibold uppercase tracking-[0.28em] text-white/80">Our Vision</p>
              <h2 className="mt-3 font-display text-3xl text-white">Timeless Spaces, Thoughtfully Curated</h2>
              <p className="mt-3 max-w-md text-sm leading-7 text-white/90">We envision homes filled with furniture that balances warmth, utility, and enduring craftsmanship.</p>
            </div>
          </article>

          <article className="relative isolate min-h-[320px] overflow-hidden rounded-[1.75rem] border border-stone-200 bg-stone-900 p-8">
            <Image
              src="https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80"
              alt="Our mission"
              fill
              className="object-cover opacity-70"
              unoptimized
            />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-stone-900/45 to-transparent" />
            <div className="relative flex h-full flex-col justify-end">
              <p className="text-sm font-semibold uppercase tracking-[0.28em] text-white/80">Our Mission</p>
              <h2 className="mt-3 font-display text-3xl text-white">Built Around Customer Comfort</h2>
              <p className="mt-3 max-w-md text-sm leading-7 text-white/90">Our mission is to guide every customer to furniture that feels personal, practical, and beautifully made.</p>
            </div>
          </article>
        </div>
      </FadeInSection>

      <FadeInSection>
        <WhyChooseUsSection />
      </FadeInSection>

      {awards.length > 0 ? (
        <FadeInSection className="mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-20">
          <SectionHeading eyebrow="Recognition" title="Awards & Certifications" description="Milestones that reflect trust, consistency, and design excellence." />
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {awards.map((award) => (
              <article key={award.id} className="overflow-hidden rounded-[1.5rem] border border-stone-200 bg-[#fcf8f2] shadow-sm">
                <div className="relative aspect-[4/3] bg-stone-100 p-3">
                  <Image src={award.image} alt={award.title} fill className="rounded-[1.1rem] object-cover" unoptimized />
                </div>
                <div className="p-5">
                  <h3 className="font-display text-2xl text-stone-900">{award.title}</h3>
                </div>
              </article>
            ))}
          </div>
        </FadeInSection>
      ) : null}

      <FadeInSection className="mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-20">
        <TestimonialsCarousel testimonials={testimonials} />
      </FadeInSection>

      <FadeInSection className="mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-20">
        <FaqAccordion items={faqItems} />
      </FadeInSection>
    </div>
  );
}
