'use client';

import Link from 'next/link';
import { FaWhatsapp } from 'react-icons/fa';

type WhatsAppFloatingButtonProps = {
  phone: string;
  label?: string;
};

export default function WhatsAppFloatingButton({ phone, label = 'Contact us' }: WhatsAppFloatingButtonProps) {
  const href = `https://wa.me/${phone}`;

  return (
    <Link
      href={href}
      target="_blank"
      rel="noreferrer"
      className="fixed bottom-5 right-5 z-50 inline-flex items-center gap-2 rounded-full bg-[#25D366] px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-[#25D366]/30 transition hover:bg-[#1ea952]"
    >
      <FaWhatsapp className="h-6 w-6 shrink-0 !text-white" style={{ color: '#fff' }} aria-hidden="true" />
      <span>{label}</span>
    </Link>
  );
}
