import Link from 'next/link';
import { requireAdmin } from '@/lib/admin-auth';
import { prisma } from '@/lib/prisma';
import DeleteButton from '@/components/admin/DeleteButton';
import { deleteCategory } from './actions';

type CategoryRow = {
  id: string;
  name: string;
  slug: string;
  image: string | null;
  order: number;
  parentId: string | null;
  _count: { products: number };
  children?: CategoryRow[];
};

export default async function CategoriesPage({
  searchParams,
}: {
  searchParams: { error?: string };
}) {
  await requireAdmin();

  const categories = await prisma.category.findMany({
    where: { parentId: null },
    include: {
      _count: { select: { products: true } },
      children: {
        include: { _count: { select: { products: true } } },
        orderBy: [{ order: 'asc' }, { name: 'asc' }],
      },
    },
    orderBy: [{ order: 'asc' }, { name: 'asc' }],
  });

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-stone-800">Categories</h1>
        <Link
          href="/admin/categories/new"
          className="rounded-md bg-brandBg px-4 py-2 text-sm font-semibold text-white transition hover:bg-brandBg/90"
        >
          New category
        </Link>
      </div>

      {searchParams?.error ? (
        <p className="mt-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">{searchParams.error}</p>
      ) : null}

      <div className="mt-6 overflow-x-auto rounded-lg border border-stone-200 bg-white">
        <table className="min-w-full divide-y divide-stone-200 text-sm">
          <thead className="bg-stone-50">
            <tr>
              <th className="px-4 py-2 text-left font-medium text-stone-600">Image</th>
              <th className="px-4 py-2 text-left font-medium text-stone-600">Name</th>
              <th className="px-4 py-2 text-left font-medium text-stone-600">Slug</th>
              <th className="px-4 py-2 text-left font-medium text-stone-600">Products</th>
              <th className="px-4 py-2 text-left font-medium text-stone-600">Order</th>
              <th className="px-4 py-2 text-right font-medium text-stone-600">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {categories.map((category) => (
              <CategoryRows key={category.id} category={category} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function CategoryRows({ category }: { category: CategoryRow }) {
  return (
    <>
      <CategoryTableRow category={category} indent={false} />
      {(category.children ?? []).map((child) => (
        <CategoryTableRow key={child.id} category={child} indent />
      ))}
    </>
  );
}

function CategoryTableRow({ category, indent }: { category: CategoryRow; indent: boolean }) {
  return (
    <tr>
      <td className="px-4 py-2">
        {category.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={category.image} alt="" className="h-10 w-10 rounded object-cover" />
        ) : (
          <div className="h-10 w-10 rounded bg-stone-100" />
        )}
      </td>
      <td className={`px-4 py-2 text-stone-800 ${indent ? 'pl-10' : ''}`}>{category.name}</td>
      <td className="px-4 py-2 text-stone-500">{category.slug}</td>
      <td className="px-4 py-2 text-stone-600">{category._count.products}</td>
      <td className="px-4 py-2 text-stone-600">{category.order}</td>
      <td className="px-4 py-2 text-right">
        <div className="flex items-center justify-end gap-3">
          <Link
            href={`/admin/categories/${category.id}`}
            className="text-xs font-medium text-brandBg hover:underline"
          >
            Edit
          </Link>
          <DeleteButton action={deleteCategory} id={category.id} />
        </div>
      </td>
    </tr>
  );
}
