import { requireAdmin } from '@/lib/admin-auth';
import BannerForm from '@/components/admin/BannerForm';
import { createBanner } from '../actions';

export default async function NewBannerPage() {
  await requireAdmin();

  return (
    <div>
      <h1 className="text-2xl font-semibold text-stone-800">New banner</h1>
      <div className="mt-6">
        <BannerForm mode="create" action={createBanner} />
      </div>
    </div>
  );
}
