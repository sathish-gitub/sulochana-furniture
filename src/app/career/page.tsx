import Link from 'next/link';
import { MessageCircle } from 'lucide-react';
import { prisma, safePrismaQuery } from '@/lib/prisma';
import { normalizeWhatsAppNumber } from '@/lib/whatsapp';
import FadeInSection from '@/components/FadeInSection';
import SectionHeading from '@/components/SectionHeading';

export const dynamic = 'force-dynamic';

export default async function CareerPage() {
  const [settings, jobs] = await Promise.all([
    safePrismaQuery(() => prisma.siteSetting.findUnique({ where: { id: 'singleton' } }), null),
    safePrismaQuery(() => prisma.jobPosting.findMany({ where: { active: true }, orderBy: { createdAt: 'desc' } }), []),
  ]);

  const normalizedPhone = normalizeWhatsAppNumber(settings?.whatsappNumber);
  const message = encodeURIComponent('Hello! I am interested in joining the Sulochana Furniture team.');
  const href = `https://wa.me/${normalizedPhone}?text=${message}`;

  const hasJobs = jobs.length > 0;

  return (
    <div className="bg-white">
      {hasJobs ? (
        <FadeInSection className="mx-auto max-w-7xl px-6 pt-24 lg:px-8">
          <SectionHeading eyebrow="Careers" title="Current openings" centered={false} />
          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            {jobs.map((job) => {
              const applyMessage = encodeURIComponent(
                `Hello, I would like to apply for the position: ${job.title} (${job.location})`
              );
              const applyHref = `https://wa.me/${normalizedPhone}?text=${applyMessage}`;

              return (
                <article
                  key={job.id}
                  className="flex flex-col rounded-[1.75rem] border border-stone-200 bg-white p-6 shadow-sm lg:p-8"
                >
                  <div className="flex flex-wrap items-center gap-3">
                    <h3 className="font-display text-2xl text-stone-900">{job.title}</h3>
                    <span className="inline-flex rounded-full bg-brandBg/10 px-3 py-1 text-xs font-semibold text-brandBg">
                      {job.jobType}
                    </span>
                  </div>
                  <p className="mt-2 text-sm font-medium text-stone-600">{job.location}</p>
                  <p className="mt-1 text-sm text-stone-600">{job.salary || 'Not disclosed'}</p>
                  <p className="mt-4 whitespace-pre-line text-sm leading-7 text-stone-700">{job.description}</p>
                  <Link
                    href={applyHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-6 inline-flex w-fit items-center gap-2 rounded-full bg-[#25D366] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#1ea952]"
                  >
                    <MessageCircle className="h-4 w-4" />
                    <span>Apply via WhatsApp</span>
                  </Link>
                </article>
              );
            })}
          </div>
        </FadeInSection>
      ) : null}

      <section className={`mx-auto flex ${hasJobs ? '' : 'min-h-[70vh] items-center'} max-w-7xl px-6 py-24 lg:px-8`}>
        <div className="w-full rounded-[2rem] border border-stone-200 bg-white p-10 shadow-sm lg:p-16">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-brand">Careers</p>
          <h1 className="mt-4 font-display text-4xl text-stone-900 sm:text-5xl">Careers at Sulochana Furniture</h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-stone-700">
            {hasJobs
              ? 'Interested in joining our team? Send us a message on WhatsApp and we will get back to you.'
              : "We don't have any open positions right now, but check back soon or reach out via WhatsApp if you're interested in joining our team."}
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
