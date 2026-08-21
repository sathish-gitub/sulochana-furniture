'use client';

import { motion } from 'framer-motion';
import ProductCard from '@/components/ProductCard';
import WhatsAppButton from '@/components/WhatsAppButton';
import { buildProductAbsoluteUrl, normalizeWhatsAppNumber } from '@/lib/whatsapp';

type GridProduct = {
  id: string;
  name: string;
  slug: string;
  images?: Array<{ url: string }>;
};

type StaggeredCategoryProductGridProps = {
  products: GridProduct[];
  whatsappNumber?: string | null;
  categoryName?: string;
};

export default function StaggeredCategoryProductGrid({ products, whatsappNumber, categoryName }: StaggeredCategoryProductGridProps) {
  const normalizedWhatsAppNumber = normalizeWhatsAppNumber(whatsappNumber);

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
      {products.map((product, index) => (
        <motion.div
          key={product.id}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.4, delay: index * 0.06 }}
          className="space-y-3"
        >
          <ProductCard product={product} categoryName={categoryName} />
          <WhatsAppButton
            phone={normalizedWhatsAppNumber}
            productName={product.name}
            productUrl={buildProductAbsoluteUrl(product.slug)}
            className="inline-flex w-full items-center justify-center rounded-full border border-brand/20 bg-white px-4 py-2.5 text-sm font-semibold text-brand transition hover:bg-brandBg hover:text-white"
          />
        </motion.div>
      ))}
    </div>
  );
}
