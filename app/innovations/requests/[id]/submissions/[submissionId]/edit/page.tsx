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
  const submissionId = params.submissionId
  return (
    <main>
      <div className='flex justify-between items-center mb-4'>
        <p className='text-3xl font-bold'>Submission editor {submissionId}</p>
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
