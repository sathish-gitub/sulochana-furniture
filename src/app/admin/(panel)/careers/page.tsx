import Link from 'next/link';
import { requireAdmin } from '@/lib/admin-auth';
import { prisma } from '@/lib/prisma';
import DeleteButton from '@/components/admin/DeleteButton';
import ToggleButton from '@/components/admin/ToggleButton';
import { deleteJob, toggleJobActive } from './actions';

export default async function CareersPage({
  searchParams,
}: {
  searchParams: { error?: string };
}) {
  await requireAdmin();

  const jobs = await prisma.jobPosting.findMany({
    orderBy: { createdAt: 'desc' },
    take: 200,
  });

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-stone-800">Careers</h1>
        <Link
          href="/admin/careers/new"
          className="rounded-md bg-brandBg px-4 py-2 text-sm font-semibold text-white transition hover:bg-brandBg/90"
        >
          New job posting
        </Link>
      </div>

      {searchParams?.error ? (
        <p className="mt-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">{searchParams.error}</p>
      ) : null}

      <div className="mt-6 overflow-x-auto rounded-lg border border-stone-200 bg-white">
        <table className="min-w-full divide-y divide-stone-200 text-sm">
          <thead className="bg-stone-50">
            <tr>
              <th className="px-4 py-2 text-left font-medium text-stone-600">Title</th>
              <th className="px-4 py-2 text-left font-medium text-stone-600">Type</th>
              <th className="px-4 py-2 text-left font-medium text-stone-600">Location</th>
              <th className="px-4 py-2 text-left font-medium text-stone-600">Salary</th>
              <th className="px-4 py-2 text-left font-medium text-stone-600">Status</th>
              <th className="px-4 py-2 text-right font-medium text-stone-600">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {jobs.map((job) => (
              <tr key={job.id}>
                <td className="px-4 py-2 text-stone-800">{job.title}</td>
                <td className="px-4 py-2 text-stone-600">{job.jobType}</td>
                <td className="px-4 py-2 text-stone-600">{job.location}</td>
                <td className="px-4 py-2 text-stone-600">{job.salary || 'Not disclosed'}</td>
                <td className="px-4 py-2">
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                      job.active ? 'bg-green-100 text-green-700' : 'bg-stone-200 text-stone-700'
                    }`}
                  >
                    {job.active ? 'Active' : 'Hidden'}
                  </span>
                </td>
                <td className="px-4 py-2 text-right">
                  <div className="flex items-center justify-end gap-3">
                    <ToggleButton
                      action={toggleJobActive}
                      id={job.id}
                      label={job.active ? 'Hide' : 'Show'}
                    />
                    <Link
                      href={`/admin/careers/${job.id}`}
                      className="text-xs font-medium text-brandBg hover:underline"
                    >
                      Edit
                    </Link>
                    <DeleteButton
                      action={deleteJob}
                      id={job.id}
                      confirmMessage="Delete this job posting?"
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
