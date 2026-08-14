import type { Metadata } from 'next';
import Link from 'next/link';
import FadeInSection from '@/components/FadeInSection';
import { FacebookIcon, InstagramIcon, YoutubeIcon } from '@/components/BrandIcons';
import PageHero from '@/components/PageHero';
import SectionHeading from '@/components/SectionHeading';
import { prisma, safePrismaQuery } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Contact Us | Sulochana Furniture',
};

export default async function ContactPage() {
  const settings = await safePrismaQuery(() => prisma.siteSetting.findUnique({ where: { id: 'singleton' } }), null);
  const mapUrl = settings?.mapEmbedUrl?.trim() ?? '';
  const isEmbeddableMapUrl = Boolean(mapUrl) && /(google\.com\/maps\/embed|maps\.google\.com\/maps\?|openstreetmap\.org\/export\/embed)/i.test(mapUrl);

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

            <form className="mt-8 space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="space-y-2 text-sm font-medium text-stone-700">
                  <span>First Name</span>
                  <input type="text" placeholder="John" className="w-full rounded-xl border border-stone-300 bg-white px-4 py-3 text-sm text-stone-800 outline-none transition focus:border-brand" />
                </label>
                <label className="space-y-2 text-sm font-medium text-stone-700">
                  <span>Last Name</span>
                  <input type="text" placeholder="Doe" className="w-full rounded-xl border border-stone-300 bg-white px-4 py-3 text-sm text-stone-800 outline-none transition focus:border-brand" />
                </label>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="space-y-2 text-sm font-medium text-stone-700">
                  <span>Email</span>
                  <input type="email" placeholder="john@example.com" className="w-full rounded-xl border border-stone-300 bg-white px-4 py-3 text-sm text-stone-800 outline-none transition focus:border-brand" />
                </label>
                <label className="space-y-2 text-sm font-medium text-stone-700">
                  <span>Phone</span>
                  <input type="tel" placeholder="+91" className="w-full rounded-xl border border-stone-300 bg-white px-4 py-3 text-sm text-stone-800 outline-none transition focus:border-brand" />
                </label>
              </div>

              <label className="space-y-2 text-sm font-medium text-stone-700">
                <span>Message</span>
                <textarea rows={5} placeholder="Tell us what furniture you are looking for..." className="w-full resize-y rounded-xl border border-stone-300 bg-white px-4 py-3 text-sm text-stone-800 outline-none transition focus:border-brand" />
              </label>

              <button type="submit" className="inline-flex items-center rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand/90">
                Send Message
              </button>
            </form>
          </section>

          <aside className="rounded-[1.75rem] border border-brand/20 bg-brand/5 p-6 shadow-sm lg:p-8">
            <h2 className="font-display text-3xl text-stone-900">Contact Info</h2>
            <div className="mt-6 space-y-5 text-sm text-stone-700">
              <div>
                <p className="font-semibold uppercase tracking-[0.2em] text-brand">Address</p>
                <p className="mt-2 leading-7">{settings?.address ?? 'Address will be updated soon.'}</p>
              </div>
              <div>
                <p className="font-semibold uppercase tracking-[0.2em] text-brand">Phone</p>
                <p className="mt-2">{settings?.contactPhone ?? 'Phone will be updated soon.'}</p>
              </div>
              <div>
                <p className="font-semibold uppercase tracking-[0.2em] text-brand">Email</p>
                <p className="mt-2">{settings?.contactEmail ?? 'Email will be updated soon.'}</p>
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
