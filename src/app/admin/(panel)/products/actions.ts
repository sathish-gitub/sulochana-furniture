'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { requireAdmin } from '@/lib/admin-auth';
import { prisma } from '@/lib/prisma';
import { deleteBlobIfOwned, isBlobUrl } from '@/lib/blob';
import { ProductStatus } from '@prisma/client';

export type ProductFormState = {
  error?: string;
};

const SLUG_PATTERN = /^[a-z0-9-]+$/;
const IMAGE_SLOT_COUNT = 6;
const MAX_ATTRIBUTE_ROWS = 30;
const STATUS_VALUES = Object.values(ProductStatus);

type ParsedFields =
  | { error: string }
  | {
      name: string;
      categoryId: string;
      sku: string | null;
      brand: string | null;
      description: string | null;
      tags: string | null;
      status: ProductStatus;
      images: { url: string; order: number }[];
      attributes: { label: string; value: string }[];
    };

async function parseCommonFields(formData: FormData): Promise<ParsedFields> {
  const name = String(formData.get('name') ?? '').trim();
  const categoryId = String(formData.get('categoryId') ?? '').trim();
  const sku = String(formData.get('sku') ?? '').trim() || null;
  const brand = String(formData.get('brand') ?? '').trim() || null;
  const description = String(formData.get('description') ?? '').trim() || null;
  const tags = String(formData.get('tags') ?? '').trim() || null;
  const status = String(formData.get('status') ?? '').trim();

  if (!name) {
    return { error: 'Name is required' };
  }
  if (name.length > 150) {
    return { error: 'Name must be 150 characters or fewer' };
  }

  if (!categoryId) {
    return { error: 'Category is required' };
  }
  const category = await prisma.category.findUnique({ where: { id: categoryId } });
  if (!category) {
    return { error: 'Category not found' };
  }

  if (!STATUS_VALUES.includes(status as ProductStatus)) {
    return { error: 'Invalid status' };
  }

  if (description && description.length > 5000) {
    return { error: 'Description must be 5000 characters or fewer' };
  }

  if (tags && tags.length > 300) {
    return { error: 'Tags must be 300 characters or fewer' };
  }

  const images: { url: string; order: number }[] = [];
  for (let i = 1; i <= IMAGE_SLOT_COUNT; i += 1) {
    const url = String(formData.get(`image${i}`) ?? '').trim();
    if (!url) {
      continue;
    }
    if (!(url.startsWith('/images/') || isBlobUrl(url))) {
      return { error: 'Invalid image source' };
    }
    images.push({ url, order: i - 1 });
  }

  if (images.length === 0) {
    return { error: 'At least one image is required' };
  }

  const labels = formData.getAll('attr_label');
  const values = formData.getAll('attr_value');
  const attributes: { label: string; value: string }[] = [];
  for (let i = 0; i < labels.length && attributes.length < MAX_ATTRIBUTE_ROWS; i += 1) {
    const label = String(labels[i] ?? '').trim();
    const value = String(values[i] ?? '').trim();
    if (!label) {
      continue;
    }
    attributes.push({ label, value });
  }

  return {
    name,
    categoryId,
    sku,
    brand,
    description,
    tags,
    status: status as ProductStatus,
    images,
    attributes,
  };
}

export async function createProduct(
  prevState: ProductFormState,
  formData: FormData
): Promise<ProductFormState> {
  await requireAdmin();

  const slug = String(formData.get('slug') ?? '').trim();
  if (!SLUG_PATTERN.test(slug)) {
    return { error: 'Slug must contain only lowercase letters, numbers and hyphens' };
  }

  const parsed = await parseCommonFields(formData);
  if ('error' in parsed) {
    return { error: parsed.error };
  }

  try {
    await prisma.product.create({
      data: {
        name: parsed.name,
        slug,
        sku: parsed.sku,
        brand: parsed.brand,
        description: parsed.description,
        tags: parsed.tags,
        status: parsed.status,
        categoryId: parsed.categoryId,
        images: { create: parsed.images },
        attributes: { create: parsed.attributes },
      },
    });
  } catch (error) {
    if (isUniqueConstraintError(error)) {
      return { error: 'That slug is already in use' };
    }
    throw error;
  }

  revalidatePath('/', 'layout');
  redirect('/admin/products');
}

export async function updateProduct(
  prevState: ProductFormState,
  formData: FormData
): Promise<ProductFormState> {
  await requireAdmin();

  const id = String(formData.get('id') ?? '');
  if (!id) {
    return { error: 'Missing product id' };
  }

  const existing = await prisma.product.findUnique({
    where: { id },
    include: { images: true },
  });
  if (!existing) {
    return { error: 'Product not found' };
  }

  const parsed = await parseCommonFields(formData);
  if ('error' in parsed) {
    return { error: parsed.error };
  }

  try {
    await prisma.product.update({
      where: { id },
      data: {
        name: parsed.name,
        sku: parsed.sku,
        brand: parsed.brand,
        description: parsed.description,
        tags: parsed.tags,
        status: parsed.status,
        categoryId: parsed.categoryId,
        images: { deleteMany: {}, create: parsed.images },
        attributes: { deleteMany: {}, create: parsed.attributes },
      },
    });
  } catch (error) {
    if (isUniqueConstraintError(error)) {
      return { error: 'That slug is already in use' };
    }
    throw error;
  }

  const newUrls = new Set(parsed.images.map((image) => image.url));
  const removedUrls = existing.images
    .map((image) => image.url)
    .filter((url) => !newUrls.has(url));
  for (const url of removedUrls) {
    await deleteBlobIfOwned(url);
  }

  revalidatePath('/', 'layout');
  redirect('/admin/products');
}

export async function deleteProduct(formData: FormData): Promise<void> {
  await requireAdmin();

  const id = String(formData.get('id') ?? '');

  const product = await prisma.product.findUnique({
    where: { id },
    include: { images: true },
  });

  if (!product) {
    redirect('/admin/products');
  }

  await prisma.product.delete({ where: { id } });

  for (const image of product.images) {
    await deleteBlobIfOwned(image.url);
  }

  revalidatePath('/', 'layout');
  redirect('/admin/products');
}

function isUniqueConstraintError(error: unknown): boolean {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    (error as { code?: string }).code === 'P2002'
  );
}
