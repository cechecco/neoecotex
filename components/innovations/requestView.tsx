import { getInnovationRequest } from '@/app/actions/actions'
import { RequestViewClient } from './requestViewClient'
import { notFound } from 'next/navigation'
import WinnerEmailButton from './winnerEmailButton'
import { computeRequestChecks } from '@/lib/server/database'
interface Props {
  id: string
}

export async function RequestView({ id }: Props) {
  const request = await getInnovationRequest(id)
  const checks = await computeRequestChecks([id])
  if ('error' in request) {
    return notFound()
  }
  return (
    <div>
      <RequestViewClient request={request}>
        <WinnerEmailButton check={checks[id]} />
      </RequestViewClient>
    </div>
  )
}
