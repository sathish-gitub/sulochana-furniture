import type { Metadata } from 'next';
import Link from 'next/link';
import FadeInSection from '@/components/FadeInSection';
import { FacebookIcon, InstagramIcon, YoutubeIcon } from '@/components/BrandIcons';
import PageHero from '@/components/PageHero';
import SectionHeading from '@/components/SectionHeading';
import ContactForm from '@/components/ContactForm';
import { prisma, safePrismaQuery } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Contact Us | Sulochana Furniture',
};

export default async function ContactPage() {
  const settings = await safePrismaQuery(() => prisma.siteSetting.findUnique({ where: { id: 'singleton' } }), null);
  const address = settings?.address?.trim() || '1A2, Udumalai Road, Chinnampalayam, Pollachi';
  const contactPhone = settings?.contactPhone?.trim() || '+91 75503 50009';
  const contactEmail = settings?.contactEmail?.trim() || 'sulochafurniture.superstore@gmail.com';
  const mapUrl = settings?.mapEmbedUrl?.trim() || 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d62736.145047295286!2d76.99011189213536!3d10.656403139824079!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba837b4b87bae69%3A0xc458ac7e19f5f4a0!2sSulochana%20Furniture!5e0!3m2!1sen!2sus!4v1787731444451!5m2!1sen!2sus';
  const isEmbeddableMapUrl = /(google\.com\/maps\/embed|maps\.google\.com\/maps\?|openstreetmap\.org\/export\/embed)/i.test(mapUrl);

  return (
    <div className="bg-white pb-16">
      <PageHero title="Contact Us" currentLabel="Contact Us" imageUrl={settings?.aboutBanner} eyebrow="Contact" />

      <FadeInSection className="mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-20">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <section className="rounded-[1.75rem] border border-stone-200 bg-white p-6 shadow-sm lg:p-8">
            <SectionHeading
              eyebrow="Get In Touch"
              title="Do You Have Any Questions?"
              description="Share your furniture requirements and our team will help you choose the right pieces for your space."
              centered={false}
            />

            <ContactForm />
          </section>

          <aside className="rounded-[1.75rem] border border-brand/20 bg-brandBg/5 p-6 shadow-sm lg:p-8">
            <h2 className="font-display text-3xl text-stone-900">Contact Info</h2>
            <div className="mt-6 space-y-5 text-sm text-stone-700">
              <div>
                <p className="font-semibold uppercase tracking-[0.2em] text-brand">Address</p>
                <p className="mt-2 leading-7">{address}</p>
              </div>
              <div>
                <p className="font-semibold uppercase tracking-[0.2em] text-brand">Phone</p>
                <p className="mt-2">{contactPhone}</p>
              </div>
              <div>
                <p className="font-semibold uppercase tracking-[0.2em] text-brand">Email</p>
                <p className="mt-2">{contactEmail}</p>
              </div>
              <div>
                <p className="font-semibold uppercase tracking-[0.2em] text-brand">Store Hours</p>
                <p className="mt-2">Mon - Sat: 9:30 AM - 8:30 PM</p>
                <p>Sunday: 10:00 AM - 6:00 PM</p>
              </div>
            </div>

            <div className="mt-8 flex items-center gap-3">
              <Link
                href="#"
                aria-label="Facebook"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-stone-300 bg-white text-stone-700 transition hover:border-brand hover:text-brand"
              >
                <FacebookIcon className="h-5 w-5" />
              </Link>
              <Link
                href="https://www.instagram.com/sulochana_furniture/"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-stone-300 bg-white text-stone-700 transition hover:border-brand hover:text-brand"
              >
                <InstagramIcon className="h-5 w-5" />
              </Link>
              <Link
                href="#"
                aria-label="YouTube"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-stone-300 bg-white text-stone-700 transition hover:border-brand hover:text-brand"
              >
                <YoutubeIcon className="h-5 w-5" />
              </Link>
            </div>
          </aside>
        </div>
      </FadeInSection>

      <FadeInSection className="mx-auto max-w-7xl px-6 lg:px-8">
        {isEmbeddableMapUrl ? (
          <div className="overflow-hidden rounded-[1.75rem] border border-stone-200 bg-white shadow-sm">
            <iframe
              src={mapUrl}
              className="h-[420px] w-full"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Store location"
            />
          </div>
        ) : (
          <div className="rounded-[1.75rem] border border-dashed border-stone-300 bg-white p-8 text-center text-stone-600">
            Store map will appear here once an embeddable map link is configured.
          </div>
        )}
      </FadeInSection>
    </div>
  );
}
