import RequestSkeleton from '@/components/innovations/requests/skeleton'
import ViewServer from '@/components/innovations/submissions/viewServer'
import { Suspense } from 'react'
import Header from '@/components/innovations/requests/header'
import OpenListButton from '@/components/innovations/openListButton'
import EditButton from '@/components/innovations/submissions/editButton'

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
        <OpenListButton requestId={requestId} />
        <EditButton
          requestId={requestId}
          submissionId={submissionId}
        />
      </Header>
      <Suspense fallback={<RequestSkeleton />}>
        <ViewServer submissionId={submissionId} />
      </Suspense>
    </main>
  )
}
