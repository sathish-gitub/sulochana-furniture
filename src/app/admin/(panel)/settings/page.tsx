import { requireAdmin } from '@/lib/admin-auth';
import { prisma } from '@/lib/prisma';
import SettingsForm from '@/components/admin/SettingsForm';
import { saveSettings } from './actions';

export default async function SettingsPage() {
  await requireAdmin();

  const settings = await prisma.siteSetting.findUnique({ where: { id: 'singleton' } });

  return (
    <div>
      <h1 className="text-2xl font-semibold text-stone-800">Site Settings</h1>
      <div className="mt-6">
        <SettingsForm
          action={saveSettings}
          initialValues={{
            contactEmail: settings?.contactEmail ?? '',
            contactPhone: settings?.contactPhone ?? '',
            whatsappNumber: settings?.whatsappNumber ?? '',
            address: settings?.address ?? '',
            mapEmbedUrl: settings?.mapEmbedUrl ?? '',
            storyTitle: settings?.storyTitle ?? '',
            storyContent: settings?.storyContent ?? '',
            storyImage: settings?.storyImage ?? '',
            aboutBanner: settings?.aboutBanner ?? '',
          }}
        />
      </div>
    </div>
  );
}
