import { Playfair_Display, Inter } from 'next/font/google';
import type { Metadata } from 'next';
import '../app/globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WhatsAppFloatingButton from '@/components/WhatsAppFloatingButton';
import PageTransitionProvider from '@/components/PageTransitionProvider';
import { prisma, safePrismaQuery } from '@/lib/prisma';
import { normalizeWhatsAppNumber } from '@/lib/whatsapp';

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  variable: '--font-display',
});

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-body',
});

export const metadata: Metadata = {
  title: 'Sulochana Furniture',
  description: 'A premium furniture shop experience with curated collections and a warm, modern feel.',
};

export const dynamic = 'force-dynamic';

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const settings = await safePrismaQuery(() => prisma.siteSetting.findUnique({ where: { id: 'singleton' } }), null);
  const whatsappNumber = normalizeWhatsAppNumber(settings?.whatsappNumber);

  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable}`}>
      <body className="min-h-screen bg-white font-body text-stone-800 antialiased">
        <div className="flex min-h-screen flex-col">
          <Header />
          <PageTransitionProvider>
            <main className="flex-1">{children}</main>
          </PageTransitionProvider>
          <Footer />
          <WhatsAppFloatingButton phone={whatsappNumber} />
        </div>
      </body>
    </html>
  );
}
