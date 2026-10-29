'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { requireAdmin } from '@/lib/admin-auth';
import { prisma } from '@/lib/prisma';
import { deleteBlobIfOwned, isBlobUrl } from '@/lib/blob';

export type BannerFormState = {
  error?: string;
};

type ParsedBannerFields =
  | { error: string }
  | {
      image: string;
      title: string | null;
      ctaUrl: string | null;
      order: number;
      active: boolean;
    };

function parseOrder(value: FormDataEntryValue | null): number {
  const parsed = Number.parseInt(String(value ?? '0'), 10);
  return Number.isFinite(parsed) ? parsed : 0;
}

function parseCommonFields(formData: FormData): ParsedBannerFields {
  const image = String(formData.get('image') ?? '').trim();
  const title = String(formData.get('title') ?? '').trim() || null;
  const ctaUrl = String(formData.get('ctaUrl') ?? '').trim() || null;
  const order = parseOrder(formData.get('order'));
  const active = String(formData.get('active') ?? '') === 'on';

  if (!image) {
    return { error: 'Image is required' };
  }
  if (!(image.startsWith('/images/') || isBlobUrl(image))) {
    return { error: 'Invalid image source' };
  }

  if (title && title.length > 150) {
    return { error: 'Label must be 150 characters or fewer' };
  }

  if (ctaUrl) {
    if (ctaUrl.length > 300) {
      return { error: 'Link must be 300 characters or fewer' };
    }
    if (!(ctaUrl.startsWith('/') || ctaUrl.startsWith('https://'))) {
      return { error: 'Link must start with "/" or "https://"' };
    }
  }

  return { image, title, ctaUrl, order, active };
}

export async function createBanner(
  prevState: BannerFormState,
  formData: FormData
): Promise<BannerFormState> {
  await requireAdmin();

  const parsed = parseCommonFields(formData);
  if ('error' in parsed) {
    return { error: parsed.error };
  }

  await prisma.banner.create({
    data: {
      image: parsed.image,
      title: parsed.title,
      ctaUrl: parsed.ctaUrl,
      order: parsed.order,
      active: parsed.active,
    },
  });

  revalidatePath('/', 'layout');
  redirect('/admin/banners');
}

export async function updateBanner(
  prevState: BannerFormState,
  formData: FormData
): Promise<BannerFormState> {
  await requireAdmin();

  const id = String(formData.get('id') ?? '');
  if (!id) {
    return { error: 'Missing banner id' };
  }

  const existing = await prisma.banner.findUnique({ where: { id } });
  if (!existing) {
    return { error: 'Banner not found' };
  }

  const parsed = parseCommonFields(formData);
  if ('error' in parsed) {
    return { error: parsed.error };
  }

  await prisma.banner.update({
    where: { id },
    data: {
      image: parsed.image,
      title: parsed.title,
      ctaUrl: parsed.ctaUrl,
      order: parsed.order,
      active: parsed.active,
    },
  });

  if (parsed.image !== existing.image) {
    await deleteBlobIfOwned(existing.image);
  }

  revalidatePath('/', 'layout');
  redirect('/admin/banners');
}

export async function deleteBanner(formData: FormData): Promise<void> {
  await requireAdmin();

  const id = String(formData.get('id') ?? '');

  const banner = await prisma.banner.findUnique({ where: { id } });

  if (!banner) {
    redirect('/admin/banners');
  }

  await prisma.banner.delete({ where: { id } });
  await deleteBlobIfOwned(banner.image);

  revalidatePath('/', 'layout');
  redirect('/admin/banners');
}

export async function toggleBannerActive(formData: FormData): Promise<void> {
  await requireAdmin();

  const id = String(formData.get('id') ?? '');

  const banner = await prisma.banner.findUnique({ where: { id } });
  if (!banner) {
    redirect('/admin/banners');
  }

  await prisma.banner.update({
    where: { id },
    data: { active: !banner.active },
  });

  revalidatePath('/', 'layout');
  redirect('/admin/banners');
}
