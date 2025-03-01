import RequestSkeleton from '@/components/innovations/requestSkeleton'
import RequestViewServer from '@/components/innovations/requestViewServer'
import { Suspense } from 'react'
import SubmitSolutionButton from '@/components/innovations/submissionButton'
import { getRequestCheck } from '@/app/actions/actions'
import ViewSubmissionsButton from '@/components/innovations/viewSubmissionsButton'
import EditRequestButton from '@/components/innovations/editRequestButton'
import Header from '@/components/innovations/Header'

export const dynamic = 'force-dynamic'

interface Props {
  params: Promise<{
    id: string
  }>
}

export default async function InnovationRequestPage(props: Props) {
  const params = await props.params
  const requestId = params.id
  const check = await getRequestCheck(requestId) // TODO: handle error

  return (
    <main>
      <Header title='Innovation Request'>
        <SubmitSolutionButton check={check} />
        <ViewSubmissionsButton requestId={requestId} />
        <EditRequestButton
          requestId={requestId}
          check={check}
        />
      </Header>
      <Suspense fallback={<RequestSkeleton />}>
        <RequestViewServer requestId={requestId} />
      </Suspense>
    </main>
  )
}
