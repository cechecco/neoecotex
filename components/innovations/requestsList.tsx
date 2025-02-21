import { getInnovationRequests } from '@/app/actions/actions'
import { InnovationRequest } from '@/lib/types'
import RequestListClient from './requestListClient'

export default async function RequestsList() {
  const innovationRequests = await getInnovationRequests({ page: 1, limit: 6 })
  if ('error' in innovationRequests) {
    return (
      <div>
        <h1>Error {innovationRequests.message}</h1>
      </div>
    )
  } else {
    return <RequestListClient innovationRequests={innovationRequests.documents as unknown as InnovationRequest[]} />
  }
}
