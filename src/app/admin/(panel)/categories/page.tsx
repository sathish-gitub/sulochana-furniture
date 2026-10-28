import { requireAdmin } from '@/lib/admin-auth';

export default async function CategoriesPage() {
  await requireAdmin();

  return (
    <div>
      <h1 className="text-2xl font-semibold text-stone-800">Categories</h1>
      <p className="mt-2 text-sm text-stone-500">Coming soon.</p>
    </div>
  );
}
