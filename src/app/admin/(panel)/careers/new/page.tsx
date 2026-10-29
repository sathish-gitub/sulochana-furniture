import { requireAdmin } from '@/lib/admin-auth';
import JobForm from '@/components/admin/JobForm';
import { createJob } from '../actions';

export default async function NewJobPage() {
  await requireAdmin();

  return (
    <div>
      <h1 className="text-2xl font-semibold text-stone-800">New job posting</h1>
      <div className="mt-6">
        <JobForm mode="create" action={createJob} />
      </div>
    </div>
  );
}
