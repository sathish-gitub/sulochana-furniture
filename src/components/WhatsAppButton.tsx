'use client';

import { FaWhatsapp } from 'react-icons/fa';

type WhatsAppButtonProps = {
  phone: string;
  productName: string;
  productUrl: string;
  className?: string;
};

export default function WhatsAppButton({ phone, productName, productUrl, className }: WhatsAppButtonProps) {
  const message = encodeURIComponent(`Hello! I’m interested in ${productName}. I found it here: ${productUrl}`);
  const href = `https://wa.me/${phone}?text=${message}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      onClick={(event) => event.stopPropagation()}
      className={className ?? 'inline-flex items-center justify-center gap-2 rounded-full bg-[#25D366] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#1ea952]'}
    >
      <FaWhatsapp className="h-5 w-5 shrink-0 !text-white" style={{ color: '#fff' }} aria-hidden="true" />
      <span>Buy via WhatsApp</span>
    </a>
  );
}
