import { prisma, safePrismaQuery } from '@/lib/prisma';
import HomeBannerSlider from '@/components/HomeBannerSlider';
import HomePageClient from '@/components/HomePageClient';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const [banners, categories, allCategories, settings, testimonials, sofasCategory] = await Promise.all([
    safePrismaQuery(() => prisma.banner.findMany({ where: { active: true }, orderBy: { order: 'asc' } }), []),
    safePrismaQuery(
      () =>
        prisma.category.findMany({
          where: { parentId: null },
          orderBy: { order: 'asc' },
          include: { _count: { select: { products: true } } },
        }),
      []
    ),
    safePrismaQuery(
      () =>
        prisma.category.findMany({
          select: {
            id: true,
            parentId: true,
          },
        }),
      []
    ),
    safePrismaQuery(() => prisma.siteSetting.findUnique({ where: { id: 'singleton' } }), null),
    safePrismaQuery(() => prisma.testimonial.findMany({ where: { featured: true }, orderBy: { createdAt: 'desc' }, take: 12 }), []),
    safePrismaQuery(
      () =>
        prisma.category.findUnique({
          where: { slug: 'sofas' },
          include: { _count: { select: { products: true } } },
        }),
      null
    ),
  ]);

  const collections = categories.filter((category) => category._count.products > 0);

  const featuredCategory = sofasCategory ?? collections[0] ?? null;
  const secondaryCategory = collections.find((category) => category.slug === 'office-furniture' && category.slug !== featuredCategory?.slug) ?? null;

  const featuredCategoryIds = (() => {
    if (!featuredCategory) return [];

    const directChildrenByParent = new Map<string, string[]>();
    for (const category of allCategories) {
      if (!category.parentId) continue;
      const currentChildren = directChildrenByParent.get(category.parentId) ?? [];
      currentChildren.push(category.id);
      directChildrenByParent.set(category.parentId, currentChildren);
    }

    const ids = new Set<string>();
    const stack = [featuredCategory.id];

    while (stack.length > 0) {
      const currentId = stack.pop();
      if (!currentId || ids.has(currentId)) continue;
      ids.add(currentId);
      const children = directChildrenByParent.get(currentId) ?? [];
      for (const childId of children) {
        stack.push(childId);
      }
    }

    return Array.from(ids);
  })();

  const featuredProducts = featuredCategoryIds.length > 0
    ? await safePrismaQuery(
        () =>
          prisma.product.findMany({
            where: { categoryId: { in: featuredCategoryIds }, status: 'ACTIVE' },
            orderBy: { createdAt: 'desc' },
            take: 12,
            include: { images: { orderBy: { order: 'asc' } } },
          }),
        []
      )
    : [];

  const secondaryProducts = secondaryCategory
    ? await safePrismaQuery(
        () =>
          prisma.product.findMany({
            where: { categoryId: secondaryCategory.id, status: 'ACTIVE' },
            orderBy: { createdAt: 'desc' },
            take: 12,
            include: { images: { orderBy: { order: 'asc' } } },
          }),
        []
      )
    : [];

  const comboProducts = await safePrismaQuery(
    () =>
      prisma.product.findMany({
        where: { status: 'ACTIVE' },
        orderBy: { createdAt: 'desc' },
        take: 6,
        include: { images: { orderBy: { order: 'asc' } } },
      }),
    []
  );

  const featureCards: Array<{ icon: 'shield' | 'leaf' | 'headset' | 'truck'; title: string }> = [
    { icon: 'shield', title: 'Premium Quality' },
    { icon: 'leaf', title: 'Sustainable Materials' },
    { icon: 'headset', title: 'Customer Support' },
    { icon: 'truck', title: 'Swift Delivery' },
  ];

  const instagramPosts = [
    { image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=800&q=80', reel: true },
    { image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80' },
    { image: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=800&q=80' },
    { image: 'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=800&q=80' },
    { image: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=800&q=80' },
    { image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80', reel: true },
    { image: 'https://images.unsplash.com/photo-1519947486511-46149fa0a254?auto=format&fit=crop&w=800&q=80' },
    { image: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=800&q=80' },
  ];

  return (
    <div className="bg-cream">
      <HomeBannerSlider banners={banners.map((banner) => ({ id: banner.id, image: banner.image, title: banner.title, subtitle: banner.subtitle, ctaLabel: banner.ctaLabel, ctaUrl: banner.ctaUrl }))} />
      <HomePageClient
        banners={banners}
        categories={collections}
        settings={settings}
        testimonials={testimonials}
        featuredCategory={featuredCategory}
        secondaryCategory={secondaryCategory}
        featuredProducts={featuredProducts.map((product) => ({ id: product.id, name: product.name, slug: product.slug, images: product.images }))}
        secondaryProducts={secondaryProducts.map((product) => ({ id: product.id, name: product.name, slug: product.slug, images: product.images }))}
        comboProducts={comboProducts.map((product) => ({ id: product.id, name: product.name, slug: product.slug, images: product.images }))}
        featureCards={featureCards}
        instagramPosts={instagramPosts}
      />
    </div>
  );
}
