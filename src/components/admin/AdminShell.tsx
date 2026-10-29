import Link from 'next/link';
import { logoutAction } from '@/app/admin/actions';
import MobileSidebarToggle from '@/components/admin/MobileSidebarToggle';

const NAV_ITEMS = [
  { href: '/admin', label: 'Dashboard' },
  { href: '/admin/categories', label: 'Categories' },
  { href: '/admin/products', label: 'Products' },
  { href: '/admin/banners', label: 'Banners' },
  { href: '/admin/testimonials', label: 'Testimonials' },
  { href: '/admin/careers', label: 'Careers' },
  { href: '/admin/settings', label: 'Site Settings' },
];

function NavLinks() {
  return (
    <nav className="flex flex-1 flex-col gap-1 p-4">
      {NAV_ITEMS.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className="rounded-md px-3 py-2 text-sm font-medium text-stone-700 transition hover:bg-brandBg/10 hover:text-brandBg"
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}

function LogoutButton() {
  return (
    <form action={logoutAction} className="border-t border-stone-200 p-4">
      <button
        type="submit"
        className="w-full rounded-md border border-stone-300 px-3 py-2 text-sm font-medium text-stone-600 transition hover:bg-stone-100"
      >
        Log out
      </button>
    </form>
  );
}

export default function AdminShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-stone-50">
      <aside className="hidden w-64 flex-col border-r border-stone-200 bg-white md:flex">
        <div className="border-b border-stone-200 px-4 py-5">
          <span className="text-lg font-semibold text-brandBg">Sulochana Admin</span>
        </div>
        <NavLinks />
        <LogoutButton />
      </aside>

      <div className="flex min-h-screen flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-stone-200 bg-white px-4 py-3 md:hidden">
          <span className="text-base font-semibold text-brandBg">Sulochana Admin</span>
          <MobileSidebarToggle>
            <div className="flex h-full flex-col">
              <div className="border-b border-stone-200 px-4 py-5">
                <span className="text-lg font-semibold text-brandBg">Sulochana Admin</span>
              </div>
              <NavLinks />
              <LogoutButton />
            </div>
          </MobileSidebarToggle>
        </header>

        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
