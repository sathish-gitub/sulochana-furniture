"use client";

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { type ReactNode } from 'react';
import { Play } from 'lucide-react';
import SectionHeading from '@/components/SectionHeading';
import WhatsAppButton from '@/components/WhatsAppButton';
import FadeInSection from '@/components/FadeInSection';
import HomeProductSlider from '@/components/HomeProductSlider';
import { buildProductAbsoluteUrl } from '@/lib/whatsapp';
import WhyChooseUsSection from '@/components/WhyChooseUsSection';
import TestimonialsCarousel from '@/components/TestimonialsCarousel';
import { normalizeWhatsAppNumber } from '@/lib/whatsapp';

type BannerItem = {
  id: string;
  image: string | null;
  title: string | null;
  subtitle: string | null;
  ctaLabel: string | null;
  ctaUrl: string | null;
};

type CategoryItem = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  _count: { products: number };
};

type ProductItem = {
  id: string;
  name: string;
  slug: string;
  images?: Array<{ url: string }> | null;
};

type SettingsItem = {
  whatsappNumber?: string | null;
  storyTitle?: string | null;
  storyContent?: string | null;
  storyImage?: string | null;
};

type TestimonialItem = {
  id: string;
  name: string;
  quote: string;
  rating: number;
  photo?: string | null;
  featured?: boolean | null;
};

type HomePageClientProps = {
  banners: BannerItem[];
  categories: CategoryItem[];
  settings: SettingsItem | null;
  testimonials: TestimonialItem[];
  featuredCategory: CategoryItem | null;
  secondaryCategory: CategoryItem | null;
  featuredProducts: ProductItem[];
  secondaryProducts: ProductItem[];
  comboProducts: ProductItem[];
  featureCards: Array<{ icon: 'shield' | 'leaf' | 'headset' | 'truck'; title: string }>;
  instagramPosts: Array<{ image: string; reel?: boolean }>;
};

function SectionReveal({ children, className }: { children: ReactNode; className?: string }) {
  return <FadeInSection className={className}>{children}</FadeInSection>;
}

function CardReveal({ children, index, className }: { children: ReactNode; index: number; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.45, delay: index * 0.05 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default function HomePageClient({ banners, categories, settings, testimonials, featuredCategory, secondaryCategory, featuredProducts, secondaryProducts, comboProducts, featureCards, instagramPosts }: HomePageClientProps) {
  const whatsappNumber = normalizeWhatsAppNumber(settings?.whatsappNumber);

  return (
    <div className="bg-white">
      <div>{/* Home banner slider is rendered by the parent page until we wire it through here */}</div>
      <SectionReveal className="mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-20">
        <SectionHeading eyebrow="Our Products" title="Product Categories" description="Explore thoughtfully curated collections designed for every room." />
        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {categories.map((category, index) => {
            const hasImage = Boolean(category.image && category.image.trim());
            return (
              <CardReveal key={category.id} index={index} className="group overflow-hidden rounded-[1.5rem] border border-stone-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg">
                <Link href={`/category/${category.slug}`} className="block">
                  <div className="relative aspect-[4/3] overflow-hidden bg-stone-100 p-3">
                    {hasImage ? (
                      <Image src={category.image!} alt={category.name} fill className="rounded-[1.25rem] object-cover transition duration-500 group-hover:scale-105" unoptimized />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center rounded-[1.25rem] border border-dashed border-stone-300 bg-stone-200/60 text-sm font-medium text-stone-500">
                        No image
                      </div>
                    )}
                  </div>
                  <div className="space-y-2 p-6">
                    <p className="text-sm font-medium uppercase tracking-[0.24em] text-brand/80">{category._count.products} items</p>
                    <h3 className="font-display text-2xl text-stone-800">{category.name}</h3>
                    {category.description ? <p className="text-sm leading-7 text-stone-600">{category.description}</p> : null}
                  </div>
                </Link>
              </CardReveal>
            );
          })}
        </div>
      </SectionReveal>

      <SectionReveal className="bg-[#8a4b26]">
        <WhyChooseUsSection featureCards={featureCards} />
      </SectionReveal>

      {featuredCategory ? (
        <SectionReveal className="mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-20">
          <SectionHeading eyebrow="Sofas" title="Sofas Collection" description="Browse our most-loved sofa pieces, including products across this category hierarchy." />
          <HomeProductSlider products={featuredProducts} whatsappNumber={whatsappNumber} />
        </SectionReveal>
      ) : null}

      {settings?.storyTitle && settings.storyContent ? (
        <SectionReveal className="mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-20">
          <div className="grid gap-10 rounded-[2rem] border border-stone-200 bg-white p-8 shadow-sm lg:grid-cols-[0.95fr_1.05fr] lg:p-12">
            <div className="relative overflow-hidden rounded-[1.5rem] bg-stone-100 p-3">
              <div className="relative aspect-[1217/1292] h-full w-full">
                <Image src="/images/store_photo.png" alt={settings.storyTitle} fill className="rounded-[1.25rem] object-cover" unoptimized />
              </div>
            </div>
            <div className="flex flex-col justify-center">
              <SectionHeading eyebrow="Why Choose Sulochana Furniture?" title={settings.storyTitle} description={settings.storyContent} centered={false} />
              <Link href="/about" className="mt-8 inline-flex w-fit items-center rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand/90">
                Know More
              </Link>
            </div>
          </div>
        </SectionReveal>
      ) : null}

      <SectionReveal className="mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-20">
        <SectionHeading eyebrow="Combo Offers" title="Our Combo" description="A curated selection of standout pieces that work beautifully together." />
        <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {comboProducts.map((product, index) => {
            const imageUrl = product.images?.[0]?.url ?? 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80';
            return (
              <CardReveal key={product.id} index={index} className="group overflow-hidden rounded-[1.5rem] border border-stone-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
                <Link href={`/product/${product.slug}`} className="block">
                  <div className="relative aspect-[4/3] overflow-hidden bg-stone-100 p-3">
                    <Image src={imageUrl} alt={product.name} fill className="rounded-[1.25rem] object-cover transition duration-500 group-hover:scale-105" unoptimized />
                  </div>
                </Link>
                <div className="space-y-4 p-6">
                  <Link href={`/product/${product.slug}`} className="block">
                    <h3 className="font-display text-xl text-stone-800">{product.name}</h3>
                  </Link>
                  <WhatsAppButton phone={whatsappNumber} productName={product.name} productUrl={buildProductAbsoluteUrl(product.slug)} className="inline-flex w-full items-center justify-center rounded-full border border-brand/20 bg-white px-4 py-2.5 text-sm font-semibold text-brand transition hover:bg-brand hover:text-white" />
                </div>
              </CardReveal>
            );
          })}
        </div>
        <div className="mt-8 flex justify-center">
          <p className="text-sm text-stone-500">We may later introduce a dedicated combo or bundle model for more structured offers.</p>
        </div>
      </SectionReveal>

      {secondaryCategory ? (
        <SectionReveal className="mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-20">
          <SectionHeading eyebrow={secondaryCategory.name} title={`${secondaryCategory.name} Collection`} description={`Explore standout pieces from our ${secondaryCategory.name.toLowerCase()} selection.`} />
          <HomeProductSlider products={secondaryProducts} whatsappNumber={whatsappNumber} />
        </SectionReveal>
      ) : null}

      <SectionReveal className="mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-20">
        <div className="flex justify-center">
          <Link href="https://www.instagram.com/sulochana_furniture/" target="_blank" rel="noreferrer" className="inline-flex items-center gap-3 rounded-full border border-brand/20 bg-white px-5 py-3 text-sm font-semibold uppercase tracking-[0.28em] text-brand shadow-sm transition hover:border-brand hover:bg-brand hover:text-white">
            <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
              <path d="M7.5 3h9A4.5 4.5 0 0 1 21 7.5v9a4.5 4.5 0 0 1-4.5 4.5h-9A4.5 4.5 0 0 1 3 16.5v-9A4.5 4.5 0 0 1 7.5 3Zm0 1.8A2.7 2.7 0 0 0 4.8 7.5v9a2.7 2.7 0 0 0 2.7 2.7h9a2.7 2.7 0 0 0 2.7-2.7v-9a2.7 2.7 0 0 0-2.7-2.7h-9Zm4.5 2.4a4.8 4.8 0 1 1 0 9.6 4.8 4.8 0 0 1 0-9.6Zm0 1.8a3 3 0 1 0 0 6 3 3 0 0 0 0-6Zm5.1-.9a1.2 1.2 0 1 1 0 2.4 1.2 1.2 0 0 1 0-2.4Z" />
            </svg>
            <span>@sulochana_furniture</span>
          </Link>
        </div>
        <div className="mt-8">
          <Link href="https://www.instagram.com/sulochana_furniture/" target="_blank" rel="noreferrer" className="block">
            <SectionHeading eyebrow="Follow Us on Instagram" title="Bring the showroom home" description="See our latest designs, styling inspiration, and seasonal pieces on Instagram." />
          </Link>
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {instagramPosts.map((post, index) => (
            <CardReveal key={`${post.image}-${index}`} index={index} className="group relative aspect-square overflow-hidden rounded-[1.5rem] border border-stone-200 bg-stone-100 shadow-sm">
              <Link href="https://www.instagram.com/sulochana_furniture/" target="_blank" rel="noreferrer" className="block h-full w-full">
                <Image src={post.image} alt={`Instagram post ${index + 1}`} fill className="object-cover transition duration-500 group-hover:scale-105" unoptimized />
                {post.reel ? (
                  <div className="absolute inset-0 flex items-center justify-center bg-stone-950/20">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/80 text-brand shadow-lg">
                      <Play className="h-5 w-5 fill-current" />
                    </div>
                  </div>
                ) : null}
              </Link>
            </CardReveal>
          ))}
        </div>
      </SectionReveal>

      {testimonials.length > 0 ? (
        <SectionReveal className="mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-20">
          <TestimonialsCarousel testimonials={testimonials} />
        </SectionReveal>
      ) : null}
    </div>
  );
}
