'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { requireAdmin } from '@/lib/admin-auth';
import { prisma } from '@/lib/prisma';

export type JobFormState = {
  error?: string;
};

const JOB_TYPES = ['Full-time', 'Part-time', 'Contract', 'Internship'] as const;

type ParsedJobFields =
  | { error: string }
  | {
      title: string;
      jobType: string;
      location: string;
      salary: string | null;
      description: string;
      active: boolean;
    };

function parseCommonFields(formData: FormData): ParsedJobFields {
  const title = String(formData.get('title') ?? '').trim();
  const jobType = String(formData.get('jobType') ?? '').trim();
  const location = String(formData.get('location') ?? '').trim();
  const salary = String(formData.get('salary') ?? '').trim() || null;
  const description = String(formData.get('description') ?? '').trim();
  const active = String(formData.get('active') ?? '') === 'on';

  if (!title) {
    return { error: 'Job title is required' };
  }
  if (title.length > 120) {
    return { error: 'Job title must be 120 characters or fewer' };
  }

  if (!(JOB_TYPES as readonly string[]).includes(jobType)) {
    return { error: 'Please select a valid job type' };
  }

  if (!location) {
    return { error: 'Location is required' };
  }
  if (location.length > 120) {
    return { error: 'Location must be 120 characters or fewer' };
  }

  if (salary && salary.length > 80) {
    return { error: 'Salary must be 80 characters or fewer' };
  }

  if (!description) {
    return { error: 'Job description is required' };
  }
  if (description.length > 3000) {
    return { error: 'Job description must be 3000 characters or fewer' };
  }

  return { title, jobType, location, salary, description, active };
}

export async function createJob(
  prevState: JobFormState,
  formData: FormData
): Promise<JobFormState> {
  await requireAdmin();

  const parsed = parseCommonFields(formData);
  if ('error' in parsed) {
    return { error: parsed.error };
  }

  await prisma.jobPosting.create({
    data: {
      title: parsed.title,
      jobType: parsed.jobType,
      location: parsed.location,
      salary: parsed.salary,
      description: parsed.description,
      active: parsed.active,
    },
  });

  revalidatePath('/', 'layout');
  redirect('/admin/careers');
}

export async function updateJob(
  prevState: JobFormState,
  formData: FormData
): Promise<JobFormState> {
  await requireAdmin();

  const id = String(formData.get('id') ?? '');
  if (!id) {
    return { error: 'Missing job posting id' };
  }

  const existing = await prisma.jobPosting.findUnique({ where: { id } });
  if (!existing) {
    return { error: 'Job posting not found' };
  }

  const parsed = parseCommonFields(formData);
  if ('error' in parsed) {
    return { error: parsed.error };
  }

  await prisma.jobPosting.update({
    where: { id },
    data: {
      title: parsed.title,
      jobType: parsed.jobType,
      location: parsed.location,
      salary: parsed.salary,
      description: parsed.description,
      active: parsed.active,
    },
  });

  revalidatePath('/', 'layout');
  redirect('/admin/careers');
}

export async function deleteJob(formData: FormData): Promise<void> {
  await requireAdmin();

  const id = String(formData.get('id') ?? '');

  const job = await prisma.jobPosting.findUnique({ where: { id } });

  if (!job) {
    redirect('/admin/careers');
  }

  await prisma.jobPosting.delete({ where: { id } });

  revalidatePath('/', 'layout');
  redirect('/admin/careers');
}

export async function toggleJobActive(formData: FormData): Promise<void> {
  await requireAdmin();

  const id = String(formData.get('id') ?? '');

  const job = await prisma.jobPosting.findUnique({ where: { id } });
  if (!job) {
    redirect('/admin/careers');
  }

  await prisma.jobPosting.update({
    where: { id },
    data: { active: !job.active },
  });

  revalidatePath('/', 'layout');
  redirect('/admin/careers');
}
