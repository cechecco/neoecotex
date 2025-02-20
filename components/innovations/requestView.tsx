import { getInnovationRequest } from '@/app/actions/actions'
import { RequestViewClient } from './requestViewClient'
import { notFound } from 'next/navigation'
import WinnerEmailButton from './winnerEmailButton'
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
      <RequestViewClient request={request}>
        <WinnerEmailButton requestId={id} />
      </RequestViewClient>
    </div>
  )
}
