import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { FacebookIcon, InstagramIcon, YoutubeIcon } from '@/components/BrandIcons';

export default async function Footer() {
  const [settings, footerItems] = await Promise.all([
    prisma.siteSetting.findUnique({ where: { id: 'singleton' } }),
    prisma.menuItem.findMany({ where: { location: 'FOOTER' }, orderBy: { order: 'asc' } }),
  ]);

  const socialLinks = [
    { label: 'Facebook', href: '#', icon: FacebookIcon },
    { label: 'Instagram', href: 'https://www.instagram.com/sulochana_furniture/', icon: InstagramIcon },
    { label: 'YouTube', href: '#', icon: YoutubeIcon },
  ];

  return (
    <footer className="border-t border-stone-200 bg-stone-900 text-stone-200">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-16 lg:grid-cols-4 lg:px-8">
        <div className="space-y-4">
          <p className="font-display text-2xl font-semibold text-white">Sulochana Furniture</p>
          <p className="max-w-xs text-sm leading-7 text-stone-400">
            Thoughtful furniture for serene homes, built with timeless textures and refined craftsmanship.
          </p>
          <div className="flex items-center gap-3">
            {socialLinks.map((social) => (
              <a key={social.label} href={social.href} target={social.href.startsWith('http') ? '_blank' : undefined} rel={social.href.startsWith('http') ? 'noreferrer' : undefined} aria-label={social.label} className="flex h-10 w-10 items-center justify-center rounded-full border border-stone-700 text-stone-300 transition hover:border-brand hover:text-brand">
                <social.icon className="h-5 w-5" />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h3 className="mb-5 text-sm font-semibold uppercase tracking-[0.24em] text-stone-400">Quick Links</h3>
          <ul className="space-y-2 text-sm text-stone-300">
            {footerItems.map((item) => {
              const href = item.url ?? '/';
              return (
                <li key={item.id}>
                  <Link href={href} className="transition hover:text-white">
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        <div>
          <h3 className="mb-5 text-sm font-semibold uppercase tracking-[0.24em] text-stone-400">Contact</h3>
          <div className="space-y-3 text-sm leading-7 text-stone-300">
            {settings?.contactPhone ? <p>{settings.contactPhone}</p> : null}
            {settings?.contactEmail ? <p>{settings.contactEmail}</p> : null}
            {settings?.address ? <p>{settings.address}</p> : null}
          </div>
        </div>

        <div>
          <h3 className="mb-5 text-sm font-semibold uppercase tracking-[0.24em] text-stone-400">Find Us</h3>
          {settings?.mapEmbedUrl ? (
            <div className="overflow-hidden rounded-2xl border border-stone-800">
              <iframe src={settings.mapEmbedUrl} className="h-48 w-full" loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
            </div>
          ) : (
            <p className="text-sm text-stone-400">Map details will appear here once configured.</p>
          )}
        </div>
      </div>

      <div className="border-t border-stone-800 px-6 py-4 text-center text-sm text-stone-500 lg:px-8">
        © 2026 Sulochana Furniture. All rights reserved.
      </div>
    </footer>
  );
}
