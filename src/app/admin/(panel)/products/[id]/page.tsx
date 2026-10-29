import { notFound } from 'next/navigation';
import { requireAdmin } from '@/lib/admin-auth';
import { prisma } from '@/lib/prisma';
import ProductForm from '@/components/admin/ProductForm';
import { updateProduct } from '../actions';
import { buildCategoryOptions } from '../category-options';

export default async function EditProductPage({ params }: { params: { id: string } }) {
  await requireAdmin();

  const product = await prisma.product.findUnique({
    where: { id: params.id },
    include: {
      images: { orderBy: { order: 'asc' } },
      attributes: true,
    },
  });

  if (!product) {
    notFound();
  }

  const categories = await prisma.category.findMany({
    include: { children: true },
    orderBy: [{ order: 'asc' }, { name: 'asc' }],
  });

  const categoryOptions = buildCategoryOptions(categories);

  const images: string[] = [];
  for (const image of product.images) {
    images[image.order] = image.url;
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold text-stone-800">Edit product</h1>
      <div className="mt-6">
        <ProductForm
          mode="edit"
          action={updateProduct}
          categoryOptions={categoryOptions}
          initialValues={{
            id: product.id,
            name: product.name,
            slug: product.slug,
            categoryId: product.categoryId,
            sku: product.sku,
            brand: product.brand,
            description: product.description,
            tags: product.tags,
            status: product.status,
            images,
            attributes: product.attributes.map((attribute) => ({
              label: attribute.label,
              value: attribute.value,
            })),
          }}
        />
      </div>
    </div>
  );
}
