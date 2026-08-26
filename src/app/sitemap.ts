import { MetadataRoute } from 'next';
import { prisma } from '@/lib/prisma';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://sulochanafurniture.in';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const [categories, products] = await Promise.all([
    prisma.category.findMany({ select: { slug: true, createdAt: true } }),
    prisma.product.findMany({
      where: { status: 'ACTIVE' },
      select: { slug: true, updatedAt: true },
    }),
  ]);

  const staticPages: MetadataRoute.Sitemap = [
    { url: `${BASE_URL}/`, lastModified: now, priority: 1.0 },
    { url: `${BASE_URL}/about`, lastModified: now, priority: 0.5 },
    { url: `${BASE_URL}/contact`, lastModified: now, priority: 0.5 },
    { url: `${BASE_URL}/career`, lastModified: now, priority: 0.5 },
  ];

  const categoryPages: MetadataRoute.Sitemap = categories.map((c: { slug: string; createdAt: Date }) => ({
    url: `${BASE_URL}/category/${c.slug}`,
    lastModified: c.createdAt ?? now,
    priority: 0.8,
  }));

  const productPages: MetadataRoute.Sitemap = products.map((p: { slug: string; updatedAt: Date }) => ({
    url: `${BASE_URL}/product/${p.slug}`,
    lastModified: p.updatedAt ?? now,
    priority: 0.6,
  }));

  return [...staticPages, ...categoryPages, ...productPages];
}
