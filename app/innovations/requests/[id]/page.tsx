import Skeleton from '@/components/innovations/requests/skeleton'
import ViewServer from '@/components/innovations/requests/viewServer'
import { Suspense } from 'react'
import SubmitSolutionButton from '@/components/innovations/requests/submissionButton'
import { getRequestCheck } from '@/app/actions/actions'
import OpenListButton from '@/components/innovations/openListButton'
import EditButton from '@/components/innovations/requests/editButton'
import Header from '@/components/innovations/requests/header'

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
        <OpenListButton requestId={requestId} />
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
