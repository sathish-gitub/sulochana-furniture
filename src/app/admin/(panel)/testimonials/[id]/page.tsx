import { notFound } from 'next/navigation';
import { requireAdmin } from '@/lib/admin-auth';
import { prisma } from '@/lib/prisma';
import TestimonialForm from '@/components/admin/TestimonialForm';
import { updateTestimonial } from '../actions';

export default async function EditTestimonialPage({ params }: { params: { id: string } }) {
  await requireAdmin();

  const testimonial = await prisma.testimonial.findUnique({ where: { id: params.id } });

  if (!testimonial) {
    notFound();
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold text-stone-800">Edit testimonial</h1>
      <div className="mt-6">
        <TestimonialForm
          mode="edit"
          action={updateTestimonial}
          initialValues={{
            id: testimonial.id,
            name: testimonial.name,
            quote: testimonial.quote,
            rating: testimonial.rating,
            featured: testimonial.featured,
          }}
        />
      </div>
    </div>
  );
}
