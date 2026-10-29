'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { requireAdmin } from '@/lib/admin-auth';
import { prisma } from '@/lib/prisma';

export type TestimonialFormState = {
  error?: string;
};

type ParsedTestimonialFields =
  | { error: string }
  | {
      name: string;
      quote: string;
      rating: number;
      featured: boolean;
    };

function parseCommonFields(formData: FormData): ParsedTestimonialFields {
  const name = String(formData.get('name') ?? '').trim();
  const quote = String(formData.get('quote') ?? '').trim();
  const ratingRaw = String(formData.get('rating') ?? '').trim();
  const featured = String(formData.get('featured') ?? '') === 'on';

  if (!name) {
    return { error: 'Name is required' };
  }
  if (name.length > 100) {
    return { error: 'Name must be 100 characters or fewer' };
  }

  if (!quote) {
    return { error: 'Quote is required' };
  }
  if (quote.length > 600) {
    return { error: 'Quote must be 600 characters or fewer' };
  }

  const rating = Number.parseInt(ratingRaw, 10);
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    return { error: 'Rating must be a whole number from 1 to 5' };
  }

  return { name, quote, rating, featured };
}

export async function createTestimonial(
  prevState: TestimonialFormState,
  formData: FormData
): Promise<TestimonialFormState> {
  await requireAdmin();

  const parsed = parseCommonFields(formData);
  if ('error' in parsed) {
    return { error: parsed.error };
  }

  await prisma.testimonial.create({
    data: {
      name: parsed.name,
      quote: parsed.quote,
      rating: parsed.rating,
      featured: parsed.featured,
    },
  });

  revalidatePath('/', 'layout');
  redirect('/admin/testimonials');
}

export async function updateTestimonial(
  prevState: TestimonialFormState,
  formData: FormData
): Promise<TestimonialFormState> {
  await requireAdmin();

  const id = String(formData.get('id') ?? '');
  if (!id) {
    return { error: 'Missing testimonial id' };
  }

  const existing = await prisma.testimonial.findUnique({ where: { id } });
  if (!existing) {
    return { error: 'Testimonial not found' };
  }

  const parsed = parseCommonFields(formData);
  if ('error' in parsed) {
    return { error: parsed.error };
  }

  await prisma.testimonial.update({
    where: { id },
    data: {
      name: parsed.name,
      quote: parsed.quote,
      rating: parsed.rating,
      featured: parsed.featured,
    },
  });

  revalidatePath('/', 'layout');
  redirect('/admin/testimonials');
}

export async function deleteTestimonial(formData: FormData): Promise<void> {
  await requireAdmin();

  const id = String(formData.get('id') ?? '');

  const testimonial = await prisma.testimonial.findUnique({ where: { id } });

  if (!testimonial) {
    redirect('/admin/testimonials');
  }

  await prisma.testimonial.delete({ where: { id } });

  revalidatePath('/', 'layout');
  redirect('/admin/testimonials');
}

export async function toggleTestimonialFeatured(formData: FormData): Promise<void> {
  await requireAdmin();

  const id = String(formData.get('id') ?? '');

  const testimonial = await prisma.testimonial.findUnique({ where: { id } });
  if (!testimonial) {
    redirect('/admin/testimonials');
  }

  await prisma.testimonial.update({
    where: { id },
    data: { featured: !testimonial.featured },
  });

  revalidatePath('/', 'layout');
  redirect('/admin/testimonials');
}
