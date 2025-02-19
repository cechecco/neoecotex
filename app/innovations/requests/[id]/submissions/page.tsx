import SubmissionsList from '@/components/innovations/submissions/submissionsList'
import SubmissionsListSkeleton from '@/components/innovations/submissions/submissionsListSkeleton'
import { Suspense } from 'react'

interface Props {
  params: Promise<{
    id: string
  }>
}

export default async function SubmissionsPage(props: Props) {
  const params = await props.params
  const requestId = params.id
  return (
    <main>
      <div className='flex flex-col md:flex-row gap-2 justify-between mb-4'>
        <p className='text-3xl font-bold'>Submissions</p>
        <p>{requestId}</p>
      </div>
      <Suspense fallback={<SubmissionsListSkeleton />}>
        <SubmissionsList requestId={requestId} />
      </Suspense>
    </main>
  )
}
