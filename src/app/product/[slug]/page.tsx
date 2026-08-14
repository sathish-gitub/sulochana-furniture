import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import FadeInSection from '@/components/FadeInSection';
import ProductImageGallery from '@/components/ProductImageGallery';
import RelatedProductsRail from '@/components/RelatedProductsRail';
import SectionHeading from '@/components/SectionHeading';
import WhatsAppButton from '@/components/WhatsAppButton';
import { prisma, safePrismaQuery } from '@/lib/prisma';
import { buildProductAbsoluteUrl } from '@/lib/whatsapp';

export const dynamic = 'force-dynamic';

type ProductPageProps = {
  params: {
    slug: string;
  };
};

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const product = await safePrismaQuery(
    () =>
      prisma.product.findUnique({
        where: { slug: params.slug },
        select: { name: true },
      }),
    null
  );

  if (!product) {
    return {
      title: 'Product Not Found | Sulochana Furniture',
    };
  }

  return {
    title: `${product.name} | Sulochana Furniture`,
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const [product, settings] = await Promise.all([
    safePrismaQuery(
      () =>
        prisma.product.findUnique({
          where: { slug: params.slug },
          include: {
            category: {
              select: {
                id: true,
                name: true,
                slug: true,
              },
            },
            images: {
              select: {
                id: true,
                url: true,
              },
              orderBy: { order: 'asc' },
            },
            attributes: {
              select: {
                id: true,
                label: true,
                value: true,
              },
            },
          },
        }),
      null
    ),
    safePrismaQuery(() => prisma.siteSetting.findUnique({ where: { id: 'singleton' } }), null),
  ]);

  if (!product) {
    notFound();
  }

  const relatedProducts = await safePrismaQuery(
    () =>
      prisma.product.findMany({
        where: {
          categoryId: product.category.id,
          id: { not: product.id },
          status: 'ACTIVE',
        },
        include: {
          images: { select: { url: true }, orderBy: { order: 'asc' } },
        },
        orderBy: { createdAt: 'desc' },
        take: 12,
      }),
    []
  );

  const stockLabel = product.status === 'OUT_OF_STOCK' ? 'Out of Stock' : product.status === 'ACTIVE' ? 'In Stock' : 'Unavailable';
  const stockClasses = product.status === 'OUT_OF_STOCK' ? 'bg-rose-100 text-rose-700' : product.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-700' : 'bg-stone-200 text-stone-700';
  const tags = product.tags?.split(',').map((tag) => tag.trim()).filter(Boolean) ?? [];

  return (
    <div className="bg-white pb-16">
      <div className="mx-auto max-w-7xl px-6 pt-10 lg:px-8">
        <nav aria-label="Breadcrumb" className="text-sm text-stone-600">
          <ol className="flex items-center gap-2">
            <li>
              <Link href="/" className="transition hover:text-brand">Home</Link>
            </li>
            <li>/</li>
            <li>
              <Link href={`/category/${product.category.slug}`} className="transition hover:text-brand">{product.category.name}</Link>
            </li>
            <li>/</li>
            <li className="font-medium text-stone-800">{product.name}</li>
          </ol>
        </nav>
      </div>

      <FadeInSection className="mx-auto mt-6 max-w-7xl px-6 lg:px-8">
        <section className="grid grid-cols-1 gap-10 rounded-[2rem] border border-stone-200 bg-white p-6 shadow-sm lg:grid-cols-[1.05fr_0.95fr] lg:p-10">
          <ProductImageGallery key={product.id} productName={product.name} images={product.images} />

          <div className="space-y-6">
            <div className="space-y-3">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-brand">Product Detail</p>
              <h1 className="font-display text-4xl text-stone-900 sm:text-5xl">{product.name}</h1>
              <span className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${stockClasses}`}>{stockLabel}</span>
            </div>

            {product.description ? <p className="text-base leading-8 text-stone-700">{product.description}</p> : null}

            {settings?.whatsappNumber ? (
              <WhatsAppButton
                phone={settings.whatsappNumber}
                productName={product.name}
                productUrl={buildProductAbsoluteUrl(product.slug)}
                className="inline-flex w-full items-center justify-center rounded-full bg-[#25D366] px-6 py-3.5 text-base font-semibold text-white shadow-sm transition hover:bg-[#1ea952]"
              />
            ) : null}

            <div className="rounded-[1.25rem] border border-stone-200 bg-white p-5">
              <h2 className="font-display text-xl text-stone-900">Product Info</h2>
              <ul className="mt-4 space-y-3 text-sm text-stone-700">
                {product.sku ? (
                  <li className="flex gap-2">
                    <span className="w-24 font-semibold text-stone-900">SKU</span>
                    <span>{product.sku}</span>
                  </li>
                ) : null}
                <li className="flex gap-2">
                  <span className="w-24 font-semibold text-stone-900">Category</span>
                  <Link href={`/category/${product.category.slug}`} className="text-brand transition hover:text-brand/80">
                    {product.category.name}
                  </Link>
                </li>
                {product.brand ? (
                  <li className="flex gap-2">
                    <span className="w-24 font-semibold text-stone-900">Brand</span>
                    <span>{product.brand}</span>
                  </li>
                ) : null}
                {tags.length > 0 ? (
                  <li className="flex flex-wrap items-start gap-2">
                    <span className="w-24 pt-1 font-semibold text-stone-900">Tags</span>
                    <div className="flex flex-wrap gap-2">
                      {tags.map((tag) => (
                        <span key={tag} className="rounded-full border border-stone-200 bg-stone-100 px-2.5 py-1 text-xs font-medium text-stone-700">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </li>
                ) : null}
              </ul>
            </div>

            {product.attributes.length > 0 ? (
              <div className="rounded-[1.25rem] border border-stone-200 bg-white p-5">
                <h2 className="font-display text-xl text-stone-900">Specifications</h2>
                <div className="mt-4 divide-y divide-stone-200">
                  {product.attributes.map((attribute) => (
                    <div key={attribute.id} className="grid grid-cols-[0.42fr_0.58fr] gap-4 py-3 text-sm">
                      <p className="font-semibold text-stone-900">{attribute.label}</p>
                      <p className="text-stone-700">{attribute.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </section>
      </FadeInSection>

      {relatedProducts.length > 0 ? (
        <FadeInSection className="mx-auto mt-14 max-w-7xl px-6 lg:px-8">
          <section>
            <SectionHeading eyebrow="More To Explore" title="Related Products" description="Discover more pieces from the same collection." />
            <div className="mt-8">
              <RelatedProductsRail products={relatedProducts.map((item) => ({ id: item.id, name: item.name, slug: item.slug, images: item.images }))} />
            </div>
          </section>
        </FadeInSection>
      ) : null}
    </div>
  );
}
