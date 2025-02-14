import { getInnovationRequest } from '@/app/innovations/actions/requests/actions'
import RequestFormClient from './requestFormClient'
import { RequestViewClient } from './requestViewClient'
import { notFound } from 'next/navigation'
import { InnovationRequest } from '@/lib/types'
import { InnovationRequestProvider } from '@/contexts/InnovationRequestContext'

interface Props {
  id: string
}

export async function RequestView({ id }: Props) {
  const request = await getInnovationRequest(id)
  if ('error' in request) {
    return notFound()
  }
  return (
    <div>
      <InnovationRequestProvider initialRequest={request as unknown as InnovationRequest}>
        <RequestViewClient />
      </InnovationRequestProvider>
    </div>
  )
}

export async function RequestForm({ id }: Props) {
  const request = await getInnovationRequest(id)
  if ('error' in request) {
    return (
      <div className='flex items-center justify-center h-full'>
        <p className='text-red-500'>{request.message}</p>
      </div>
    )
  }
  return (
    <div>
      <InnovationRequestProvider initialRequest={request as unknown as InnovationRequest}>
        <RequestFormClient />
      </InnovationRequestProvider>
    </div>
  )
}
