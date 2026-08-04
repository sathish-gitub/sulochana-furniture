import Image from 'next/image';
import Link from 'next/link';

type ProductCardProps = {
  product: {
    name: string;
    slug: string;
    images?: Array<{ url: string }>;
  };
  categoryName?: string | null;
};

export default function ProductCard({ product, categoryName }: ProductCardProps) {
  const imageUrl = product.images?.[0]?.url;
  const hasImage = Boolean(imageUrl && imageUrl.trim());

  return (
    <Link href={`/product/${product.slug}`} className="group block overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      <div className="relative aspect-[4/3] overflow-hidden bg-stone-100">
        {hasImage ? (
          <Image src={imageUrl!} alt={product.name} fill className="object-cover transition duration-500 group-hover:scale-105" unoptimized />
        ) : (
          <div className="flex h-full w-full items-center justify-center border border-dashed border-stone-300 bg-stone-200/60 text-sm font-medium text-stone-500">
            No image
          </div>
        )}
      </div>
      <div className="space-y-2 p-6">
        {categoryName ? <p className="text-sm font-medium uppercase tracking-[0.24em] text-brand/80">{categoryName}</p> : null}
        <h3 className="text-xl font-semibold text-stone-800">{product.name}</h3>
      </div>
    </Link>
  );
}
