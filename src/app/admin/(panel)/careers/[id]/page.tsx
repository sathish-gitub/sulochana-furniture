import { notFound } from 'next/navigation';
import { requireAdmin } from '@/lib/admin-auth';
import { prisma } from '@/lib/prisma';
import JobForm from '@/components/admin/JobForm';
import { updateJob } from '../actions';

export default async function EditJobPage({ params }: { params: { id: string } }) {
  await requireAdmin();

  const job = await prisma.jobPosting.findUnique({ where: { id: params.id } });

  if (!job) {
    notFound();
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold text-stone-800">Edit job posting</h1>
      <div className="mt-6">
        <JobForm
          mode="edit"
          action={updateJob}
          initialValues={{
            id: job.id,
            title: job.title,
            jobType: job.jobType,
            location: job.location,
            salary: job.salary,
            description: job.description,
            active: job.active,
          }}
        />
      </div>
    </div>
  );
}
