import Link from 'next/link';
import { requireAdmin } from '@/lib/admin-auth';
import { prisma } from '@/lib/prisma';
import DeleteButton from '@/components/admin/DeleteButton';
import ToggleButton from '@/components/admin/ToggleButton';
import { deleteTestimonial, toggleTestimonialFeatured } from './actions';

function truncateQuote(quote: string): string {
  if (quote.length <= 80) {
    return quote;
  }
  return `${quote.slice(0, 80).trimEnd()}…`;
}

export default async function TestimonialsPage({
  searchParams,
}: {
  searchParams: { error?: string };
}) {
  await requireAdmin();

  const testimonials = await prisma.testimonial.findMany({
    orderBy: { createdAt: 'desc' },
    take: 200,
  });

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-stone-800">Testimonials</h1>
        <Link
          href="/admin/testimonials/new"
          className="rounded-md bg-brandBg px-4 py-2 text-sm font-semibold text-white transition hover:bg-brandBg/90"
        >
          New testimonial
        </Link>
      </div>

      {searchParams?.error ? (
        <p className="mt-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">{searchParams.error}</p>
      ) : null}

      <div className="mt-6 overflow-x-auto rounded-lg border border-stone-200 bg-white">
        <table className="min-w-full divide-y divide-stone-200 text-sm">
          <thead className="bg-stone-50">
            <tr>
              <th className="px-4 py-2 text-left font-medium text-stone-600">Name</th>
              <th className="px-4 py-2 text-left font-medium text-stone-600">Quote</th>
              <th className="px-4 py-2 text-left font-medium text-stone-600">Rating</th>
              <th className="px-4 py-2 text-left font-medium text-stone-600">Status</th>
              <th className="px-4 py-2 text-right font-medium text-stone-600">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {testimonials.map((testimonial) => (
              <tr key={testimonial.id}>
                <td className="px-4 py-2 text-stone-800">{testimonial.name}</td>
                <td className="px-4 py-2 text-stone-600">{truncateQuote(testimonial.quote)}</td>
                <td className="px-4 py-2 text-stone-600">{testimonial.rating}/5</td>
                <td className="px-4 py-2">
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                      testimonial.featured ? 'bg-green-100 text-green-700' : 'bg-stone-200 text-stone-700'
                    }`}
                  >
                    {testimonial.featured ? 'Featured' : 'Hidden'}
                  </span>
                </td>
                <td className="px-4 py-2 text-right">
                  <div className="flex items-center justify-end gap-3">
                    <ToggleButton
                      action={toggleTestimonialFeatured}
                      id={testimonial.id}
                      label={testimonial.featured ? 'Hide' : 'Show'}
                    />
                    <Link
                      href={`/admin/testimonials/${testimonial.id}`}
                      className="text-xs font-medium text-brandBg hover:underline"
                    >
                      Edit
                    </Link>
                    <DeleteButton
                      action={deleteTestimonial}
                      id={testimonial.id}
                      confirmMessage="Delete this testimonial?"
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
