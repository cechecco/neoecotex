import { Suspense } from 'react'

import { getRequestCheck } from '@/app/actions/innovations'
import OpenListButton from '@/components/innovations/openListButton'
import EditButton from '@/components/innovations/requests/editButton'
import Header from '@/components/innovations/requests/header'
import Skeleton from '@/components/innovations/requests/skeleton'
import SubmitSolutionButton from '@/components/innovations/requests/submissionButton'
import ViewServer from '@/components/innovations/requests/viewServer'

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
      <Header
        title={`Request - ${check?.requestTitle}`}
        requestId={requestId}
      >
        <SubmitSolutionButton check={check} />
        <OpenListButton
          requestId={requestId}
          check={check}
        />
        <EditButton
          requestId={requestId}
          check={check}
        />
      </Header>
      <Suspense fallback={<Skeleton />}>
        <ViewServer requestId={requestId} />
      </Suspense>
    </main>
  )
}
