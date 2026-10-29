import { requireAdmin } from '@/lib/admin-auth';
import { prisma } from '@/lib/prisma';
import ProductForm from '@/components/admin/ProductForm';
import { createProduct } from '../actions';
import { buildCategoryOptions } from '../category-options';

export default async function NewProductPage() {
  await requireAdmin();

  const categories = await prisma.category.findMany({
    include: { children: true },
    orderBy: [{ order: 'asc' }, { name: 'asc' }],
  });

  const categoryOptions = buildCategoryOptions(categories);

  return (
    <div>
      <h1 className="text-2xl font-semibold text-stone-800">New product</h1>
      <div className="mt-6">
        <ProductForm mode="create" action={createProduct} categoryOptions={categoryOptions} />
      </div>
    </div>
  );
}
