import { Suspense } from 'react'

import { getRequestCheck } from '@/app/actions/innovations'
import Header from '@/components/innovations/requests/header'
import ListServer from '@/components/innovations/submissions/listServer'
import ListSkeleton from '@/components/innovations/submissions/listSkeleton'

interface Props {
  params: Promise<{
    id: string
  }>
}

export default async function SubmissionsPage(props: Props) {
  const params = await props.params
  const requestId = params.id
  const check = await getRequestCheck(requestId) // TODO: handle error
  return (
    <main>
      <Header
        title={`Submissions - ${check?.requestTitle}`}
        requestId={requestId}
      />
      <Suspense fallback={<ListSkeleton />}>
        <ListServer requestId={requestId} />
      </Suspense>
    </main>
  )
}
