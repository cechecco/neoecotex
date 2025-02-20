import { innovations } from '@/lib/server/database'

export default async function OwnerCheck({ requestId }: { requestId: string }) {
  const iAmOwner = await innovations.iAmOwner(requestId)
  if (iAmOwner) {
    return <p>Owner</p>
  }
  return null
}
