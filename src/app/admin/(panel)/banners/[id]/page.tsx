import { notFound } from 'next/navigation';
import { requireAdmin } from '@/lib/admin-auth';
import { prisma } from '@/lib/prisma';
import BannerForm from '@/components/admin/BannerForm';
import { updateBanner } from '../actions';

export default async function EditBannerPage({ params }: { params: { id: string } }) {
  await requireAdmin();

  const banner = await prisma.banner.findUnique({ where: { id: params.id } });

  if (!banner) {
    notFound();
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold text-stone-800">Edit banner</h1>
      <div className="mt-6">
        <BannerForm
          mode="edit"
          action={updateBanner}
          initialValues={{
            id: banner.id,
            image: banner.image,
            title: banner.title,
            ctaUrl: banner.ctaUrl,
            order: banner.order,
            active: banner.active,
          }}
        />
      </div>
    </div>
  );
}
