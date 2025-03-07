import { Suspense } from 'react'

import Header from '@/components/innovations/requests/header'
import RequestSkeleton from '@/components/innovations/requests/skeleton'
import Form from '@/components/innovations/submissions/form'
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
      <Header title='Submission Editor' />

      <Suspense fallback={<RequestSkeleton />}>
        <Form
          submissionId={submissionId}
          requestId={requestId}
        />
      </Suspense>
    </main>
  )
}
