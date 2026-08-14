import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import FadeInSection from '@/components/FadeInSection';
import SectionHeading from '@/components/SectionHeading';
import CategoryFilterSidebar from '@/components/CategoryFilterSidebar';
import StaggeredCategoryProductGrid from '@/components/StaggeredCategoryProductGrid';
import { prisma, safePrismaQuery } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

type CategoryPageProps = {
  params: {
    slug: string;
  };
};

function getDescendantCategoryIds(rootId: string, categories: Array<{ id: string; parentId: string | null }>) {
  const childrenByParent = new Map<string, string[]>();

  for (const category of categories) {
    if (!category.parentId) continue;
    const siblings = childrenByParent.get(category.parentId) ?? [];
    siblings.push(category.id);
    childrenByParent.set(category.parentId, siblings);
  }

  const found = new Set<string>();
  const stack = [rootId];

  while (stack.length > 0) {
    const currentId = stack.pop();
    if (!currentId || found.has(currentId)) continue;

    found.add(currentId);
    const children = childrenByParent.get(currentId) ?? [];
    for (const childId of children) {
      stack.push(childId);
    }
  }

  return Array.from(found);
}

function findNearestAncestorWithProducts(
  categoryId: string,
  categories: Array<{ id: string; parentId: string | null }>,
  categoryIdsWithProducts: Set<string>
) {
  const byId = new Map(categories.map((category) => [category.id, category]));
  let current = byId.get(categoryId);

  while (current?.parentId) {
    const parent = byId.get(current.parentId);
    if (!parent) break;

    const parentDescendants = getDescendantCategoryIds(parent.id, categories);
    const parentHasProducts = parentDescendants.some((id) => categoryIdsWithProducts.has(id));
    if (parentHasProducts) {
      return parent.id;
    }

    current = parent;
  }

  return null;
}

function findTopLevelSlug(categoryId: string, categories: Array<{ id: string; parentId: string | null; slug: string }>) {
  const byId = new Map(categories.map((category) => [category.id, category]));
  let current = byId.get(categoryId);

  while (current?.parentId) {
    current = byId.get(current.parentId);
  }

  return current?.slug;
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const category = await safePrismaQuery(
    () =>
      prisma.category.findUnique({
        where: { slug: params.slug },
        select: { name: true },
      }),
    null
  );

  if (!category) {
    return {
      title: 'Category Not Found | Sulochana Furniture',
    };
  }

  return {
    title: `${category.name} | Sulochana Furniture`,
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const [category, topLevelCategories, allCategories, settings, productCategoryRows] = await Promise.all([
    safePrismaQuery(
      () =>
        prisma.category.findUnique({
          where: { slug: params.slug },
          include: {
            parent: { select: { id: true, name: true, slug: true } },
            children: {
              select: { id: true, name: true, slug: true },
              orderBy: { order: 'asc' },
            },
          },
        }),
      null
    ),
    safePrismaQuery(
      () =>
        prisma.category.findMany({
          where: { parentId: null },
          include: {
            children: {
              select: { id: true, name: true, slug: true },
              orderBy: { order: 'asc' },
            },
          },
          orderBy: { order: 'asc' },
        }),
      []
    ),
    safePrismaQuery(
      () =>
        prisma.category.findMany({
          select: { id: true, parentId: true, slug: true },
        }),
      []
    ),
    safePrismaQuery(() => prisma.siteSetting.findUnique({ where: { id: 'singleton' } }), null),
    safePrismaQuery(
      () =>
        prisma.product.findMany({
          where: { status: { not: 'DRAFT' } },
          select: { categoryId: true },
        }),
      []
    ),
  ]);

  if (!category) {
    notFound();
  }

  const descendantCategoryIds = getDescendantCategoryIds(category.id, allCategories);
  const currentTopLevelSlug = findTopLevelSlug(category.id, allCategories) ?? category.slug;
  const categoryIdsWithProducts = new Set(productCategoryRows.map((row) => row.categoryId));
  const hasProductsInSubtree = (categoryId: string) => getDescendantCategoryIds(categoryId, allCategories).some((id) => categoryIdsWithProducts.has(id));
  const sidebarCategories = topLevelCategories.filter((item) => hasProductsInSubtree(item.id));

  const getProductsForCategoryIds = async (categoryIds: string[]) =>
    safePrismaQuery(
      () =>
        prisma.product.findMany({
          where: {
            categoryId: { in: categoryIds },
            status: { not: 'DRAFT' },
          },
          include: {
            images: { select: { url: true }, orderBy: { order: 'asc' } },
          },
          orderBy: { createdAt: 'desc' },
        }),
      []
    );

  let products = await getProductsForCategoryIds(descendantCategoryIds);

  if (products.length === 0) {
    const fallbackCategoryId = findNearestAncestorWithProducts(category.id, allCategories, categoryIdsWithProducts);

    if (fallbackCategoryId) {
      const fallbackCategoryIds = getDescendantCategoryIds(fallbackCategoryId, allCategories);
      products = await getProductsForCategoryIds(fallbackCategoryIds);
    }
  }

  const hasHeroImage = Boolean(category.image && category.image.trim());

  return (
    <div className="bg-white pb-16">
      <section className="relative isolate overflow-hidden">
        <div className="absolute inset-0 bg-stone-900" />
        {hasHeroImage ? <Image src={category.image!} alt={category.name} fill className="object-cover opacity-60" unoptimized priority /> : null}
        <div className="absolute inset-0 bg-gradient-to-b from-stone-900/60 via-stone-900/50 to-stone-900/75" />

        <div className="relative mx-auto max-w-7xl px-6 py-20 text-white lg:px-8 lg:py-24">
          <p className="text-sm font-semibold uppercase tracking-[0.33em] text-white/80">Category</p>
          <h1 className="mt-4 font-display text-4xl sm:text-5xl lg:text-6xl">{category.name}</h1>
          <nav aria-label="Breadcrumb" className="mt-6 text-sm text-white/85">
            <ol className="flex items-center gap-2">
              <li>
                <Link href="/" className="transition hover:text-white">Home</Link>
              </li>
              <li>/</li>
              <li className="font-medium text-white">{category.name}</li>
            </ol>
          </nav>
        </div>
      </section>

      {category.children.length > 0 ? (
        <section className="border-b border-stone-200 bg-white">
          <div className="mx-auto flex max-w-7xl gap-3 overflow-x-auto px-6 py-5 lg:px-8">
            {category.children.map((child) => (
              <Link
                key={child.id}
                href={`/category/${child.slug}`}
                className="shrink-0 rounded-full border border-stone-300 bg-white px-4 py-2 text-sm font-medium text-stone-700 transition hover:border-brand hover:text-brand"
              >
                {child.name}
              </Link>
            ))}
          </div>
        </section>
      ) : null}

      <section className="mx-auto mt-10 max-w-7xl px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,3fr)]">
          <FadeInSection>
            <CategoryFilterSidebar categories={sidebarCategories} currentCategorySlug={category.slug} currentTopLevelSlug={currentTopLevelSlug} />
          </FadeInSection>

          <div>
            <FadeInSection>
              <SectionHeading
                eyebrow="Collection"
                title={category.name}
                description={category.description ?? 'Handpicked pieces crafted with comfort, quality, and timeless style in mind.'}
                centered={false}
              />
            </FadeInSection>

            <p className="mt-6 text-sm font-medium uppercase tracking-[0.18em] text-stone-600">Showing {products.length} products</p>

            <FadeInSection className="mt-6">
              {products.length > 0 ? (
                <StaggeredCategoryProductGrid
                  products={products.map((product) => ({ id: product.id, name: product.name, slug: product.slug, images: product.images }))}
                  whatsappNumber={settings?.whatsappNumber}
                />
              ) : (
                <div className="rounded-[1.5rem] border border-dashed border-stone-300 bg-white p-10 text-center">
                  <h3 className="font-display text-2xl text-stone-900">No products here yet</h3>
                  <p className="mt-3 text-stone-600">We are updating this category right now. Please check back soon for new arrivals.</p>
                </div>
              )}
            </FadeInSection>
          </div>
        </div>
      </section>
    </div>
  );
}
