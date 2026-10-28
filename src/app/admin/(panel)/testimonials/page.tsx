import { requireAdmin } from '@/lib/admin-auth';

export default async function TestimonialsPage() {
  await requireAdmin();

  return (
    <div>
      <h1 className="text-2xl font-semibold text-stone-800">Testimonials</h1>
      <p className="mt-2 text-sm text-stone-500">Coming soon.</p>
    </div>
  );
}
