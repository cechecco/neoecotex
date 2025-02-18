import { getInnovationRequest } from '@/app/actions/actions'
import { RequestViewClient } from './requestViewClient'
import { notFound } from 'next/navigation'

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
      <RequestViewClient request={request} />
    </div>
  )
}
