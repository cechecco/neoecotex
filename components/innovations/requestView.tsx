import { getInnovationRequest } from '@/app/actions/innovations/requests/actions'
import { RequestViewClient } from './requestViewClient'
import { notFound } from 'next/navigation'
import { InnovationRequest } from '@/lib/types'
import { InnovationRequestProvider } from '@/contexts/innovationRequestContext'

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
