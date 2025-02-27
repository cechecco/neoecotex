import { getRequestsChecks } from '@/app/actions/actions'

export default async function OwnerCheck({ requestId }: { requestId: string }) {
  const checks = await getRequestsChecks([requestId])
  if (checks[requestId].iAmOwner) {
    return <p>Owner</p>
  }
  return null
}
