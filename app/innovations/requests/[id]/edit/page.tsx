import RequestSkeleton from '@/components/innovations/requestSkeleton'
import { RequestForm } from '@/components/innovations/requestForm'
import { Suspense } from 'react'
import Header from '@/components/innovations/Header'

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
      <Header title='Innovation Request Editor'>{requestId}</Header>

      <Suspense fallback={<RequestSkeleton />}>
        <RequestForm id={requestId} />
      </Suspense>
    </main>
  )
}
