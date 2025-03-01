import RequestSkeleton from '@/components/innovations/requestSkeleton'
import { Suspense } from 'react'
import { SubmissionForm } from '@/components/innovations/submissions/submissionForm'
import Header from '@/components/innovations/Header'
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
      <Header title='Submission Editor'>{submissionId}</Header>

      <Suspense fallback={<RequestSkeleton />}>
        <SubmissionForm
          submissionId={submissionId}
          requestId={requestId}
        />
      </Suspense>
    </main>
  )
}
