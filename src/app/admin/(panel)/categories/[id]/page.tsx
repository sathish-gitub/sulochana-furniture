import { notFound } from 'next/navigation';
import { requireAdmin } from '@/lib/admin-auth';
import { prisma } from '@/lib/prisma';
import CategoryForm from '@/components/admin/CategoryForm';
import { updateCategory } from '../actions';

export default async function EditCategoryPage({ params }: { params: { id: string } }) {
  await requireAdmin();

  const category = await prisma.category.findUnique({
    where: { id: params.id },
    include: { children: { select: { id: true } } },
  });

  if (!category) {
    notFound();
  }

  const parentOptions = await prisma.category.findMany({
    where: { parentId: null },
    select: { id: true, name: true },
    orderBy: [{ order: 'asc' }, { name: 'asc' }],
  });

  return (
    <div>
      <h1 className="text-2xl font-semibold text-stone-800">Edit category</h1>
      <div className="mt-6">
        <CategoryForm
          mode="edit"
          action={updateCategory}
          parentOptions={parentOptions}
          initialValues={{
            id: category.id,
            name: category.name,
            slug: category.slug,
            parentId: category.parentId,
            description: category.description,
            order: category.order,
            image: category.image,
            hasChildren: category.children.length > 0,
          }}
        />
      </div>
    </div>
  );
}
