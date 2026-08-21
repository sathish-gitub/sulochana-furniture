import Image from 'next/image';
import Link from 'next/link';
import { unstable_noStore as noStore } from 'next/cache';
import MobileNav from '@/components/MobileNav';
import HeaderSearch from '@/components/HeaderSearch';
import CategoriesMegaMenu from '@/components/CategoriesMegaMenu';
import { prisma, safePrismaQuery } from '@/lib/prisma';

export default async function Header() {
  noStore();
  const [settings, categories] = await Promise.all([
    safePrismaQuery(() => prisma.siteSetting.findUnique({ where: { id: 'singleton' } }), null),
    safePrismaQuery(
      () =>
        prisma.category.findMany({
          where: {
            parentId: null,
            OR: [
              { products: { some: {} } },
              { children: { some: {} } },
            ],
          },
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
  ]);

  const mainNavItems = [
    { id: 'home', label: 'Home', href: '/' },
    { id: 'about', label: 'About Us', href: '/about' },
    { id: 'categories', label: 'Categories', href: '#' },
    { id: 'career', label: 'Career', href: '/career' },
    { id: 'contact', label: 'Contact Us', href: '/contact' },
  ];
  const address = settings?.address?.trim() || '1A2, Udumalai Road, Chinnampalayam, Pollachi';
  const contactPhone = settings?.contactPhone?.trim() || '+91 75503 50009';
  const contactEmail = settings?.contactEmail?.trim() || 'hello@sulochanafurniture.com';

  return (
    <header className="sticky top-0 z-[60] border-b border-stone-200/70 bg-white/95 shadow-[0_8px_30px_rgba(0,0,0,0.04)] backdrop-blur">
      <div className="hidden bg-brandBg lg:block">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-2 text-sm text-white lg:px-8">
          <p className="text-white/90">Crafted interiors, thoughtful details, and timeless comfort.</p>
          <div className="flex flex-wrap items-center gap-5">
            <span>{address}</span>
            <a href={`tel:${contactPhone}`} className="transition hover:text-[#f7efe8]">{contactPhone}</a>
            <a href={`mailto:${contactEmail}`} className="transition hover:text-[#f7efe8]">{contactEmail}</a>
          </div>
        </div>
      </div>

      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
        <Link href="/" className="block">
          <Image
            src="/images/sulo_logo.png"
            alt="Sulochana Furniture"
            width={542}
            height={152}
            className="h-10 w-auto sm:h-11"
            priority
          />
        </Link>

        <nav aria-label="Main navigation" className="hidden items-center gap-6 md:flex">
          {mainNavItems.map((item) => {
            if (item.id === 'categories') {
              return <CategoriesMegaMenu key={item.id} categories={categories.map((category) => ({ id: category.id, name: category.name, slug: category.slug, children: category.children }))} />;
            }

            return (
              <Link key={item.id} href={item.href} className="text-sm font-medium capitalize tracking-normal text-stone-700 transition hover:text-brand">
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <HeaderSearch />
          <MobileNav items={mainNavItems.filter((item) => item.id !== 'categories').map((item) => ({ id: item.id, label: item.label, href: item.href }))} categories={categories.map((category) => ({ id: category.id, name: category.name, slug: category.slug, children: category.children }))} />
        </div>
      </div>
    </header>
  );
}
