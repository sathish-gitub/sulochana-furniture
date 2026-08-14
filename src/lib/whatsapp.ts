const FALLBACK_SITE_URL = 'https://sulochanafurniture.com';

function normalizeSiteUrl(url: string) {
  const trimmed = url.trim();
  if (!trimmed) return FALLBACK_SITE_URL;

  const withProtocol = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
  return withProtocol.replace(/\/$/, '');
}

export function normalizeWhatsAppNumber(value?: string | null) {
  const digits = value?.replace(/[^\d]/g, '').trim();
  return digits || '917550350009';
}

export function getSiteUrl() {
  return normalizeSiteUrl(process.env.NEXT_PUBLIC_SITE_URL ?? FALLBACK_SITE_URL);
}

export function buildAbsoluteUrl(pathname: string) {
  const normalizedPath = pathname.startsWith('/') ? pathname : `/${pathname}`;
  return `${getSiteUrl()}${normalizedPath}`;
}

export function buildProductAbsoluteUrl(slug: string) {
  return buildAbsoluteUrl(`/product/${slug}`);
}
