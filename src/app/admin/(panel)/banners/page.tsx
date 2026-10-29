import Link from 'next/link';
import { requireAdmin } from '@/lib/admin-auth';
import { prisma } from '@/lib/prisma';
import DeleteButton from '@/components/admin/DeleteButton';
import ToggleButton from '@/components/admin/ToggleButton';
import { deleteBanner, toggleBannerActive } from './actions';

export default async function BannersPage({
  searchParams,
}: {
  searchParams: { error?: string };
}) {
  await requireAdmin();

  const banners = await prisma.banner.findMany({
    orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
  });

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-stone-800">Banners</h1>
        <Link
          href="/admin/banners/new"
          className="rounded-md bg-brandBg px-4 py-2 text-sm font-semibold text-white transition hover:bg-brandBg/90"
        >
          New banner
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
              <th className="px-4 py-2 text-left font-medium text-stone-600">Label</th>
              <th className="px-4 py-2 text-left font-medium text-stone-600">Link</th>
              <th className="px-4 py-2 text-left font-medium text-stone-600">Order</th>
              <th className="px-4 py-2 text-left font-medium text-stone-600">Status</th>
              <th className="px-4 py-2 text-right font-medium text-stone-600">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {banners.map((banner) => (
              <tr key={banner.id}>
                <td className="px-4 py-2">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={banner.image} alt="" className="h-12 w-28 rounded object-cover" />
                </td>
                <td className="px-4 py-2 text-stone-800">{banner.title || '(no label)'}</td>
                <td className="px-4 py-2 text-stone-600">{banner.ctaUrl || '—'}</td>
                <td className="px-4 py-2 text-stone-600">{banner.order}</td>
                <td className="px-4 py-2">
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                      banner.active ? 'bg-green-100 text-green-700' : 'bg-stone-200 text-stone-700'
                    }`}
                  >
                    {banner.active ? 'Active' : 'Hidden'}
                  </span>
                </td>
                <td className="px-4 py-2 text-right">
                  <div className="flex items-center justify-end gap-3">
                    <ToggleButton
                      action={toggleBannerActive}
                      id={banner.id}
                      label={banner.active ? 'Hide' : 'Show'}
                    />
                    <Link
                      href={`/admin/banners/${banner.id}`}
                      className="text-xs font-medium text-brandBg hover:underline"
                    >
                      Edit
                    </Link>
                    <DeleteButton
                      action={deleteBanner}
                      id={banner.id}
                      confirmMessage="Delete this banner?"
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
