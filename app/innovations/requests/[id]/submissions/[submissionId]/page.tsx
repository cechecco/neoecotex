import { Suspense } from 'react'

import { getRequestCheck } from '@/app/actions/innovations'
import OpenListButton from '@/components/innovations/openListButton'
import Header from '@/components/innovations/requests/header'
import RequestSkeleton from '@/components/innovations/requests/skeleton'
import EditButton from '@/components/innovations/submissions/editButton'
import SelectWinnerButton from '@/components/innovations/submissions/selectWinnerButton'
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
  const check = await getRequestCheck(requestId)
  return (
    <main>
      <Header
        title={`Submission - ${check?.submissionsTitles[submissionId]}`}
        requestId={requestId}
      >
        <OpenListButton
          requestId={requestId}
          check={check}
        />
        <SelectWinnerButton
          submissionId={submissionId}
          check={check}
        />
        <EditButton
          requestId={requestId}
          submissionId={submissionId}
          check={check}
        />
      </Header>
      <Suspense fallback={<RequestSkeleton />}>
        <ViewServer submissionId={submissionId} />
      </Suspense>
    </main>
  )
}
