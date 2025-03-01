import RequestSkeleton from '@/components/innovations/requestSkeleton'
import SubmissionViewServer from '@/components/innovations/submissions/submissionViewServer'
import { Suspense } from 'react'
import Header from '@/components/innovations/Header'
import ViewSubmissionsButton from '@/components/innovations/submissions/ViewSubmissionsButton'
import EditSubmissionButton from '@/components/innovations/submissions/EditSubmissionButton'

interface Props {
  params: Promise<{
    id: string
    submissionId: string
  }>
}

export default async function SubmissionPage(props: Props) {
  const params = await props.params
  const requestId = params.id
  const submissionId = params.submissionId
  return (
    <main>
      <Header title='Submission'>
        <ViewSubmissionsButton requestId={requestId} />
        <EditSubmissionButton
          requestId={requestId}
          submissionId={submissionId}
        />
      </Header>
      <Suspense fallback={<RequestSkeleton />}>
        <SubmissionViewServer submissionId={submissionId} />
      </Suspense>
    </main>
  )
}
