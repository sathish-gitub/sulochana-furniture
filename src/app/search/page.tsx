import type { Metadata } from 'next';
import Link from 'next/link';
import PageHero from '@/components/PageHero';
import FadeInSection from '@/components/FadeInSection';
import ProductCard from '@/components/ProductCard';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Search | Sulochana Furniture',
};

type SearchPageProps = {
  searchParams: { q?: string };
};

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const query = searchParams.q?.trim() ?? '';

  let products: Awaited<ReturnType<typeof prisma.product.findMany<{
    include: { images: true; category: { select: { name: true } } };
  }>>> = [];
  let queryError = false;

  if (query) {
    try {
      products = await prisma.product.findMany({
        where: {
          status: 'ACTIVE',
          OR: [
            { name: { contains: query, mode: 'insensitive' } },
            { category: { name: { contains: query, mode: 'insensitive' } } },
            // nullable fields — only add when non-empty to avoid engine issues
            ...(query.length > 0
              ? [
                  { description: { contains: query, mode: 'insensitive' as const } },
                  { tags: { contains: query, mode: 'insensitive' as const } },
                ]
              : []),
          ],
        },
        include: {
          images: { orderBy: { order: 'asc' }, take: 1 },
          category: { select: { name: true } },
        },
        orderBy: { name: 'asc' },
      });
    } catch (err) {
      console.error('[search] Prisma query failed:', err);
      queryError = true;
    }
  }

  return (
    <div className="bg-white pb-16">
      <PageHero
        title={query ? `Search results for "${query}"` : 'Search'}
        currentLabel="Search"
        eyebrow="Search"
      />

      <FadeInSection className="mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-20">
        {!query ? (
          <p className="text-center text-stone-500">Enter a search term above to find products.</p>
        ) : queryError ? (
          <p className="text-center text-stone-500">Something went wrong. Please try again.</p>
        ) : products.length === 0 ? (
          <div className="py-16 text-center">
            <p className="mb-4 text-lg text-stone-600">
              No products found for <span className="font-semibold text-stone-800">&ldquo;{query}&rdquo;</span>.
            </p>
            <p className="mb-8 text-stone-500">Try a different term, or browse our collections.</p>
            <Link
              href="/"
              className="inline-block rounded-full bg-stone-900 px-8 py-3 text-sm font-medium text-white transition hover:bg-stone-700"
            >
              Browse All Categories
            </Link>
          </div>
        ) : (
          <>
            <p className="mb-8 text-sm text-stone-500">
              <span className="font-semibold text-stone-800">{products.length}</span>{' '}
              {products.length === 1 ? 'result' : 'results'} for{' '}
              <span className="font-semibold text-stone-800">&ldquo;{query}&rdquo;</span>
            </p>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  categoryName={product.category?.name}
                />
              ))}
            </div>
          </>
        )}
      </FadeInSection>
    </div>
  );
}
