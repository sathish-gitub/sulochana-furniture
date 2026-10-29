import { requireAdmin } from '@/lib/admin-auth';
import TestimonialForm from '@/components/admin/TestimonialForm';
import { createTestimonial } from '../actions';

export default async function NewTestimonialPage() {
  await requireAdmin();

  return (
    <div>
      <h1 className="text-2xl font-semibold text-stone-800">New testimonial</h1>
      <div className="mt-6">
        <TestimonialForm mode="create" action={createTestimonial} />
      </div>
    </div>
  );
}
