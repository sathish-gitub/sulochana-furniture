import Link from 'next/link';
import { MessageCircle } from 'lucide-react';
import { prisma, safePrismaQuery } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export default async function CareerPage() {
  const settings = await safePrismaQuery(() => prisma.siteSetting.findUnique({ where: { id: 'singleton' } }), null);
  const message = encodeURIComponent('Hello! I am interested in joining the Sulochana Furniture team.');
  const href = `https://wa.me/${settings?.whatsappNumber ?? '917550350009'}?text=${message}`;

  return (
    <div className="bg-white">
      <section className="mx-auto flex min-h-[70vh] max-w-7xl items-center px-6 py-24 lg:px-8">
        <div className="w-full rounded-[2rem] border border-stone-200 bg-white p-10 shadow-sm lg:p-16">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-brand">Careers</p>
          <h1 className="mt-4 font-display text-4xl text-stone-900 sm:text-5xl">Careers at Sulochana Furniture</h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-stone-700">
            We don't have any open positions right now, but check back soon or reach out via WhatsApp if you're interested in joining our team.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link href={href} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full bg-[#25D366] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#1ea952]">
              <MessageCircle className="h-4 w-4" />
              <span>Contact via WhatsApp</span>
            </Link>
            <Link href="/" className="inline-flex items-center rounded-full border border-stone-300 px-5 py-3 text-sm font-semibold text-stone-700 transition hover:border-brand hover:text-brand">
              Back to home
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
