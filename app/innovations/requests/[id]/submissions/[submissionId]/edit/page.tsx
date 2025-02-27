import RequestSkeleton from '@/components/innovations/requestSkeleton'
import { Suspense } from 'react'
import { SubmissionForm } from '@/components/innovations/submissions/submissionForm'
interface Props {
  params: Promise<{
    id: string
    submissionId: string
  }>
}

export default async function SubmissionEditorPage(props: Props) {
  const params = await props.params
  const requestId = params.id
  const submissionId = params.submissionId // could be 'new'
  return (
    <main>
      <div className='flex flex-col md:flex-row gap-2 justify-between mb-4'>
        <p className='text-3xl font-bold'>Submission editor</p>
      </div>

      <Suspense fallback={<RequestSkeleton />}>
        <SubmissionForm
          submissionId={submissionId}
          requestId={requestId}
        />
      </Suspense>
    </main>
  )
}
