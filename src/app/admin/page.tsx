import Link from 'next/link';
import { getAdmin } from '@/lib/admin-auth';
import { prisma } from '@/lib/prisma';
import LoginForm from '@/components/admin/LoginForm';
import AdminShell from '@/components/admin/AdminShell';

const DASHBOARD_CARDS = [
  { key: 'products', label: 'Products', href: '/admin/products' },
  { key: 'categories', label: 'Categories', href: '/admin/categories' },
  { key: 'banners', label: 'Banners', href: '/admin/banners' },
  { key: 'testimonials', label: 'Testimonials', href: '/admin/testimonials' },
] as const;

export default async function AdminPage() {
  const isAdmin = await getAdmin();

  if (!isAdmin) {
    return <LoginForm />;
  }

  const [productCount, categoryCount, bannerCount, testimonialCount] = await Promise.all([
    prisma.product.count(),
    prisma.category.count(),
    prisma.banner.count(),
    prisma.testimonial.count(),
  ]);

  const counts: Record<(typeof DASHBOARD_CARDS)[number]['key'], number> = {
    products: productCount,
    categories: categoryCount,
    banners: bannerCount,
    testimonials: testimonialCount,
  };

  return (
    <AdminShell>
      <h1 className="text-2xl font-semibold text-stone-800">Dashboard</h1>
      <p className="mt-1 text-sm text-stone-500">Overview of your store content.</p>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {DASHBOARD_CARDS.map((card) => (
          <Link
            key={card.key}
            href={card.href}
            className="rounded-lg border border-stone-200 bg-white p-5 shadow-sm transition hover:border-brandBg hover:shadow-md"
          >
            <p className="text-sm font-medium text-stone-500">{card.label}</p>
            <p className="mt-2 text-3xl font-semibold text-brandBg">{counts[card.key]}</p>
          </Link>
        ))}
      </div>
    </AdminShell>
  );
}
