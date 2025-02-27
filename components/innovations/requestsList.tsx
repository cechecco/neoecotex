import { getInnovationRequests, getRequestsChecks } from '@/app/actions/actions'
import RequestListClient from './requestListClient'

export default async function RequestsList() {
  const innovationRequests = await getInnovationRequests({ page: 1, limit: 3 })
  if ('error' in innovationRequests) {
    return (
      <div>
        <h1>Error {innovationRequests.message}</h1>
      </div>
    )
  }

  // 1) Recuperiamo tutti gli ID
  const requestIds = innovationRequests.documents.map((doc) => doc.$id).filter(Boolean) as string[]

  // 2) Chiediamo i nostri check in un'unica chiamata
  const checks = await getRequestsChecks(requestIds)

  // 3) Passiamo checks al Client component
  return (
    <div>
      <p>Checks</p>
      <RequestListClient
        innovationRequests={innovationRequests.documents}
        checks={checks}
      />
    </div>
  )
}
