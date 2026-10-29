'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { requireAdmin } from '@/lib/admin-auth';
import { prisma } from '@/lib/prisma';
import { deleteBlobIfOwned } from '@/lib/blob';

export type CategoryFormState = {
  error?: string;
};

const SLUG_PATTERN = /^[a-z0-9-]+$/;

function parseOrder(value: FormDataEntryValue | null): number {
  const parsed = Number.parseInt(String(value ?? '0'), 10);
  return Number.isFinite(parsed) ? parsed : 0;
}

function readParentId(formData: FormData): string | null {
  const value = String(formData.get('parentId') ?? '');
  return value === '' ? null : value;
}

export async function createCategory(
  prevState: CategoryFormState,
  formData: FormData
): Promise<CategoryFormState> {
  await requireAdmin();

  const name = String(formData.get('name') ?? '').trim();
  const slug = String(formData.get('slug') ?? '').trim();
  const parentId = readParentId(formData);
  const description = String(formData.get('description') ?? '').trim() || null;
  const order = parseOrder(formData.get('order'));
  const image = String(formData.get('image') ?? '').trim() || null;

  if (!name) {
    return { error: 'Name is required' };
  }

  if (!SLUG_PATTERN.test(slug)) {
    return { error: 'Slug must contain only lowercase letters, numbers and hyphens' };
  }

  if (parentId) {
    const parent = await prisma.category.findUnique({ where: { id: parentId } });
    if (!parent || parent.parentId !== null) {
      return { error: 'A subcategory can only be two levels deep' };
    }
  }

  try {
    await prisma.category.create({
      data: { name, slug, parentId, description, order, image },
    });
  } catch (error) {
    if (isUniqueConstraintError(error)) {
      return { error: 'That slug is already in use' };
    }
    throw error;
  }

  revalidatePath('/', 'layout');
  redirect('/admin/categories');
}

export async function updateCategory(
  prevState: CategoryFormState,
  formData: FormData
): Promise<CategoryFormState> {
  await requireAdmin();

  const id = String(formData.get('id') ?? '');
  const name = String(formData.get('name') ?? '').trim();
  const parentId = readParentId(formData);
  const description = String(formData.get('description') ?? '').trim() || null;
  const order = parseOrder(formData.get('order'));
  const image = String(formData.get('image') ?? '').trim() || null;

  if (!id) {
    return { error: 'Missing category id' };
  }

  if (!name) {
    return { error: 'Name is required' };
  }

  const existing = await prisma.category.findUnique({
    where: { id },
    include: { children: true },
  });

  if (!existing) {
    return { error: 'Category not found' };
  }

  if (existing.children.length > 0 && parentId) {
    return { error: 'A category with subcategories must stay top-level' };
  }

  if (parentId) {
    if (parentId === id) {
      return { error: 'A category cannot be its own parent' };
    }
    const parent = await prisma.category.findUnique({ where: { id: parentId } });
    if (!parent || parent.parentId !== null) {
      return { error: 'A subcategory can only be two levels deep' };
    }
  }

  try {
    await prisma.category.update({
      where: { id },
      data: { name, parentId, description, order, image },
    });
  } catch (error) {
    if (isUniqueConstraintError(error)) {
      return { error: 'That slug is already in use' };
    }
    throw error;
  }

  if (image !== existing.image) {
    await deleteBlobIfOwned(existing.image);
  }

  revalidatePath('/', 'layout');
  redirect('/admin/categories');
}

export async function deleteCategory(formData: FormData): Promise<void> {
  await requireAdmin();

  const id = String(formData.get('id') ?? '');

  const category = await prisma.category.findUnique({
    where: { id },
    include: { _count: { select: { products: true, children: true } } },
  });

  if (!category) {
    redirect('/admin/categories');
  }

  if (category._count.products > 0 || category._count.children > 0) {
    redirect(
      `/admin/categories?error=${encodeURIComponent('Move or delete the products/subcategories first')}`
    );
  }

  await prisma.category.delete({ where: { id } });
  await deleteBlobIfOwned(category.image);

  revalidatePath('/', 'layout');
  redirect('/admin/categories');
}

function isUniqueConstraintError(error: unknown): boolean {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    (error as { code?: string }).code === 'P2002'
  );
}
