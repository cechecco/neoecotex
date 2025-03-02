import { Suspense } from 'react'

import OpenListButton from '@/components/innovations/openListButton'
import Header from '@/components/innovations/requests/header'
import RequestSkeleton from '@/components/innovations/requests/skeleton'
import EditButton from '@/components/innovations/submissions/editButton'
import ViewServer from '@/components/innovations/submissions/viewServer'

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
