import RequestSkeleton from '@/components/innovations/requestSkeleton'
import { RequestForm } from '@/components/innovations/requestServer'
import { Suspense } from 'react'

interface Props {
  params: Promise<{
    id: string
  }>
}

export default async function InnovationRequestPage(props: Props) {
  const params = await props.params
  return (
    <main>
      <div className='flex justify-between items-center mb-4'>
        <p className='text-3xl font-bold text-white'>Innovation Request editor</p>
        <div className='flex items-center justify-end gap-2'>{/* ... */}</div>
      </div>

      <Suspense fallback={<RequestSkeleton />}>
        <RequestForm id={params.id} />
      </Suspense>
    </main>
  )
}
