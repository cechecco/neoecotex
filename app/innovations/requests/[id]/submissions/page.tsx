import { Suspense } from 'react'

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
  return (
    <main>
      <Header title='Submissions'>{requestId}</Header>
      <Suspense fallback={<ListSkeleton />}>
        <ListServer requestId={requestId} />
      </Suspense>
    </main>
  )
}
