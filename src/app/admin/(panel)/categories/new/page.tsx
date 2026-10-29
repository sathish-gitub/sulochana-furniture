import { requireAdmin } from '@/lib/admin-auth';
import { prisma } from '@/lib/prisma';
import CategoryForm from '@/components/admin/CategoryForm';
import { createCategory } from '../actions';

export default async function NewCategoryPage() {
  await requireAdmin();

  const parentOptions = await prisma.category.findMany({
    where: { parentId: null },
    select: { id: true, name: true },
    orderBy: [{ order: 'asc' }, { name: 'asc' }],
  });

  return (
    <div>
      <h1 className="text-2xl font-semibold text-stone-800">New category</h1>
      <div className="mt-6">
        <CategoryForm mode="create" action={createCategory} parentOptions={parentOptions} />
      </div>
    </div>
  );
}
