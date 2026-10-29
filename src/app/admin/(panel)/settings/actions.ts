'use server';

import { revalidatePath } from 'next/cache';
import { requireAdmin } from '@/lib/admin-auth';
import { prisma } from '@/lib/prisma';
import { deleteBlobIfOwned, isBlobUrl } from '@/lib/blob';

export type SettingsFormState = {
  error?: string;
  success?: boolean;
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAPS_EMBED_PREFIX = 'https://www.google.com/maps/embed';

function extractMapEmbedUrl(raw: string): string | null {
  // Accepts either a pasted <iframe> embed snippet or a bare URL.
  const iframeMatch = raw.match(/<iframe[^>]*\ssrc=["']([^"']+)["']/i);
  const candidate = (iframeMatch ? iframeMatch[1] : raw).trim();

  if (!candidate.startsWith(MAPS_EMBED_PREFIX)) {
    return null;
  }

  return candidate;
}

function validImageSource(url: string): boolean {
  return url.startsWith('/images/') || isBlobUrl(url);
}

export async function saveSettings(
  prevState: SettingsFormState,
  formData: FormData
): Promise<SettingsFormState> {
  await requireAdmin();

  const contactEmail = String(formData.get('contactEmail') ?? '').trim().toLowerCase();
  const contactPhone = String(formData.get('contactPhone') ?? '').trim();
  const whatsappRaw = String(formData.get('whatsappNumber') ?? '');
  const address = String(formData.get('address') ?? '').trim();
  const mapInput = String(formData.get('mapEmbedUrl') ?? '').trim();
  const storyTitle = String(formData.get('storyTitle') ?? '').trim();
  const storyContent = String(formData.get('storyContent') ?? '').trim();
  const storyImage = String(formData.get('storyImage') ?? '').trim();
  const aboutBanner = String(formData.get('aboutBanner') ?? '').trim();

  const existing = await prisma.siteSetting.findUnique({ where: { id: 'singleton' } });

  if (!contactEmail) {
    return { error: 'Contact email is required' };
  }
  if (contactEmail.length > 120 || !EMAIL_REGEX.test(contactEmail)) {
    return { error: 'Please enter a valid contact email' };
  }

  if (!contactPhone) {
    return { error: 'Phone is required' };
  }
  if (contactPhone.length > 30) {
    return { error: 'Phone must be 30 characters or fewer' };
  }
  const phoneDigitCount = (contactPhone.match(/\d/g) ?? []).length;
  if (phoneDigitCount < 10) {
    return { error: 'Phone must contain at least 10 digits' };
  }

  const whatsappDigits = whatsappRaw.replace(/\D/g, '');
  if (!whatsappDigits) {
    return { error: 'WhatsApp number is required' };
  }
  if (whatsappDigits.length < 10 || whatsappDigits.length > 15) {
    return { error: 'WhatsApp number must be 10 to 15 digits' };
  }

  if (address.length > 300) {
    return { error: 'Address must be 300 characters or fewer' };
  }

  let mapEmbedUrl: string | null = null;
  if (mapInput) {
    const extracted = extractMapEmbedUrl(mapInput);
    if (!extracted) {
      return { error: 'Please paste the Google Maps embed code' };
    }
    mapEmbedUrl = extracted;
  }

  if (storyTitle.length > 150) {
    return { error: 'Story title must be 150 characters or fewer' };
  }
  if (storyContent.length > 1500) {
    return { error: 'Story text must be 1500 characters or fewer' };
  }

  if (storyImage && storyImage !== existing?.storyImage && !validImageSource(storyImage)) {
    return { error: 'Invalid image source: Story image' };
  }
  if (aboutBanner && aboutBanner !== existing?.aboutBanner && !validImageSource(aboutBanner)) {
    return { error: 'Invalid image source: About page banner' };
  }

  const data = {
    contactEmail,
    contactPhone,
    whatsappNumber: whatsappDigits,
    address: address || null,
    mapEmbedUrl,
    storyTitle: storyTitle || null,
    storyContent: storyContent || null,
    storyImage: storyImage || null,
    aboutBanner: aboutBanner || null,
  };

  await prisma.siteSetting.upsert({
    where: { id: 'singleton' },
    create: { id: 'singleton', ...data },
    update: data,
  });

  if (existing?.storyImage && existing.storyImage !== storyImage && isBlobUrl(existing.storyImage)) {
    await deleteBlobIfOwned(existing.storyImage);
  }
  if (existing?.aboutBanner && existing.aboutBanner !== aboutBanner && isBlobUrl(existing.aboutBanner)) {
    await deleteBlobIfOwned(existing.aboutBanner);
  }

  revalidatePath('/', 'layout');

  return { success: true };
}
