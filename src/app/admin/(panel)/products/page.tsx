import Link from 'next/link';
import { requireAdmin } from '@/lib/admin-auth';
import { prisma } from '@/lib/prisma';
import DeleteButton from '@/components/admin/DeleteButton';
import { deleteProduct } from './actions';

const STATUS_STYLES: Record<string, string> = {
  ACTIVE: 'bg-green-100 text-green-700',
  DRAFT: 'bg-stone-200 text-stone-700',
  OUT_OF_STOCK: 'bg-red-100 text-red-700',
};

const STATUS_LABELS: Record<string, string> = {
  ACTIVE: 'Active',
  DRAFT: 'Draft',
  OUT_OF_STOCK: 'Out of stock',
};

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: { error?: string; q?: string };
}) {
  await requireAdmin();

  const q = (searchParams?.q ?? '').trim();

  const products = await prisma.product.findMany({
    where: q ? { name: { contains: q, mode: 'insensitive' } } : undefined,
    include: {
      category: { include: { parent: true } },
      images: { orderBy: { order: 'asc' }, take: 1 },
    },
    orderBy: { createdAt: 'desc' },
    take: 200,
  });

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-stone-800">Products</h1>
        <Link
          href="/admin/products/new"
          className="rounded-md bg-brandBg px-4 py-2 text-sm font-semibold text-white transition hover:bg-brandBg/90"
        >
          New product
        </Link>
      </div>

      {searchParams?.error ? (
        <p className="mt-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">{searchParams.error}</p>
      ) : null}

      <form method="get" className="mt-4 flex items-center gap-2">
        <input
          type="text"
          name="q"
          defaultValue={q}
          placeholder="Search by name"
          className="w-full max-w-xs rounded-md border border-stone-300 px-3 py-2 text-sm focus:border-brandBg focus:outline-none focus:ring-1 focus:ring-brandBg"
        />
        <button
          type="submit"
          className="rounded-md border border-stone-300 px-4 py-2 text-sm font-medium text-stone-700 transition hover:bg-stone-100"
        >
          Search
        </button>
      </form>

      <p className="mt-2 text-sm text-stone-500">
        {products.length} product{products.length === 1 ? '' : 's'}
      </p>

      <div className="mt-4 overflow-x-auto rounded-lg border border-stone-200 bg-white">
        <table className="min-w-full divide-y divide-stone-200 text-sm">
          <thead className="bg-stone-50">
            <tr>
              <th className="px-4 py-2 text-left font-medium text-stone-600">Image</th>
              <th className="px-4 py-2 text-left font-medium text-stone-600">Name</th>
              <th className="px-4 py-2 text-left font-medium text-stone-600">Category</th>
              <th className="px-4 py-2 text-left font-medium text-stone-600">Status</th>
              <th className="px-4 py-2 text-right font-medium text-stone-600">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {products.map((product) => {
              const thumbnail = product.images[0]?.url ?? null;
              const categoryLabel = product.category.parent
                ? `${product.category.parent.name} / ${product.category.name}`
                : product.category.name;

              return (
                <tr key={product.id}>
                  <td className="px-4 py-2">
                    {thumbnail ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={thumbnail} alt="" className="h-10 w-10 rounded object-cover" />
                    ) : (
                      <div className="h-10 w-10 rounded bg-stone-100" />
                    )}
                  </td>
                  <td className="px-4 py-2 text-stone-800">{product.name}</td>
                  <td className="px-4 py-2 text-stone-600">{categoryLabel}</td>
                  <td className="px-4 py-2">
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                        STATUS_STYLES[product.status] ?? 'bg-stone-200 text-stone-700'
                      }`}
                    >
                      {STATUS_LABELS[product.status] ?? product.status}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-right">
                    <div className="flex items-center justify-end gap-3">
                      <Link
                        href={`/admin/products/${product.id}`}
                        className="text-xs font-medium text-brandBg hover:underline"
                      >
                        Edit
                      </Link>
                      <DeleteButton
                        action={deleteProduct}
                        id={product.id}
                        confirmMessage="Delete this product?"
                      />
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
