import SubmissionsList from '@/components/innovations/submissions/submissionsList'
import SubmissionsListSkeleton from '@/components/innovations/submissions/submissionsListSkeleton'
import { Suspense } from 'react'

export default function SubmissionsPage() {
  return (
    <main>
      <div className='flex justify-between items-center mb-4'>
        <h1 className='text-3xl font-bold'>Submissions for Innovation Request</h1>
      </div>
      <Suspense fallback={<SubmissionsListSkeleton />}>
        <SubmissionsList />
      </Suspense>
    </main>
  )
}
