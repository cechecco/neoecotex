import { getInnovationRequest } from '@/app/actions/innovations/requests/actions'
import RequestFormClient from './requestFormClient'
import { InnovationRequestProvider } from '@/contexts/innovationRequestContext'
import { InnovationRequest } from '@/lib/types'

interface Props {
  id: string
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
