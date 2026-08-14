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
    <div className="bg-white pb-16">
      <PageHero title="About Us" currentLabel="About Us" imageUrl={settings?.aboutBanner} eyebrow="About" />

      <FadeInSection className="mx-auto max-w-5xl px-6 py-16 lg:px-8 lg:py-20">
        <div className="rounded-[2rem] border border-stone-200 bg-white p-8 shadow-sm lg:p-12">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-brand">Our Story</p>
            <h2 className="mt-4 font-display text-4xl text-stone-900 sm:text-5xl">A Tradition of Quality. A Legacy of Trust.</h2>
          </div>

          <div className="mx-auto mt-10 max-w-3xl space-y-7 text-base leading-8 text-stone-700 sm:text-lg">
            <p>
              A piece of furniture is never just a piece of furniture. It is the cot on which a child grows up. The dining table around which a family comes together. The sofa that welcomes relatives and friends. The cupboard that quietly holds years of memories.
            </p>

            <p>
              For over 40 years, Sulochana Furniture has been a part of countless homes and families, built on the values of quality, honesty and customer satisfaction. Our journey began with a simple belief — good furniture should be made from good materials, built with care and made to last for generations. That belief continues to guide us even today.
            </p>

            <p>
              Our journey was not built overnight. It was built slowly — through hard work, honest relationships, quality craftsmanship and, most importantly, the trust of our customers.
            </p>

            <h3 className="pt-4 font-display text-3xl text-stone-900">We Believe Quality Begins at the Source</h3>
            <p>
              For us, making good furniture does not begin in the showroom. It begins with the material we choose. With our own furniture manufacturing factory, we are closely involved in the journey of our furniture — from selecting raw materials to craftsmanship, finishing and the final product that reaches your home. We carefully source quality timber, including original teak wood and mahogany wood, because we believe that furniture meant to stay in a family for years must have a strong foundation. Our craftsmen combine years of experience with attention to detail to create furniture that is made not only to look beautiful today, but to remain dependable for years to come.
            </p>

            <h3 className="pt-4 font-display text-3xl text-stone-900">From Our Own Factory to Your Home</h3>
            <p>
              One of our greatest strengths is our own furniture manufacturing factory, where traditional craftsmanship meets modern manufacturing techniques. Along with our own manufactured furniture, Sulochana Furniture brings customers a wide selection of contemporary and international furniture — sourced and imported from major furniture markets including China, Malaysia and Indonesia, giving customers the freedom to explore traditional craftsmanship and modern international designs under one roof.
            </p>

            <h3 className="pt-4 font-display text-3xl text-stone-900">A Showroom Built for Every Family</h3>
            <p>
              Today, our vast showroom brings together thousands of furniture choices for different homes, lifestyles and budgets — from wooden cots, sofas and dining tables to recliners, wardrobes, swings, storage solutions, Pooja Unit, TV Wall Unit, office furniture, home décor and much more.
            </p>

            <h3 className="pt-4 font-display text-3xl text-stone-900">When Customers Return, It Means More Than a Sale</h3>
            <p>
              Over four decades, we have seen children who once came to our showroom holding their parents' hands return years later to purchase furniture for homes of their own. When a customer returns to us after many years, recommends us to a relative, or brings the next generation of their family to Sulochana Furniture, it reminds us of the responsibility that comes with their trust.
            </p>

            <h3 className="pt-4 font-display text-3xl text-stone-900">Furniture May Fill a House. Memories Make It a Home.</h3>
            <p>
              For more than 40 years, homes have changed, designs have changed, generations have changed — but our purpose remains the same: to help families bring home furniture they can choose with confidence, use with pride and remember for years to come.
            </p>
          </div>
        </div>
      </FadeInSection>

      <FadeInSection className="mx-auto max-w-7xl px-6 py-8 lg:px-8 lg:py-10">
        <div className="grid gap-6 md:grid-cols-2">
          <article className="relative isolate overflow-hidden rounded-[1.75rem] border border-stone-200 bg-stone-900">
            <div className="relative aspect-[1217/1292] w-full">
              <Image
                src="/images/store_photo.png"
                alt="Our vision"
                fill
                className="object-cover"
                unoptimized
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-stone-900/45 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-8">
              <p className="text-sm font-semibold uppercase tracking-[0.28em] text-white/80">Our Vision</p>
              <h2 className="mt-3 font-display text-3xl text-white">Crafting Enduring Homes Across Generations</h2>
              <p className="mt-3 max-w-md text-sm leading-7 text-white/90">To preserve the artistry of quality craftsmanship and create homes where families gather, grow, and make memories for generations to come.</p>
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
              <h2 className="mt-3 font-display text-3xl text-white">Helping Families Choose with Confidence</h2>
              <p className="mt-3 max-w-md text-sm leading-7 text-white/90">To help families choose furniture with confidence and trust, combining traditional Indian craftsmanship with thoughtfully selected international designs.</p>
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
              <article key={award.id} className="overflow-hidden rounded-[1.5rem] border border-stone-200 bg-white shadow-sm">
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
