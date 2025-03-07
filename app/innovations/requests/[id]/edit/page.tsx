import { Suspense } from 'react'

import Form from '@/components/innovations/requests/form'
import Header from '@/components/innovations/requests/header'
import RequestSkeleton from '@/components/innovations/requests/skeleton'

interface Props {
  params: Promise<{
    id: string
  }>
}

export default async function InnovationRequestPage(props: Props) {
  const params = await props.params
  const requestId = params.id
  return (
    <main>
      <Header title='Innovation Request Editor' />

      <Suspense fallback={<RequestSkeleton />}>
        <Form id={requestId} />
      </Suspense>
    </main>
  )
}
