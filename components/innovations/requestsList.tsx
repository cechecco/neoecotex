import { getInnovationRequests } from '@/app/innovations/actions/requests/actions'
import RequestCard from './requestCard'
import { InnovationRequest } from '@/lib/types'

export default async function RequestsList() {
  const innovationRequests = await getInnovationRequests()
  if ('error' in innovationRequests) {
    return (
      <div>
        <h1>Error {innovationRequests.message}</h1>
      </div>
    )
  } else {
    return (
      <div>
        <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-4'>
          {innovationRequests.documents.map((request) => (
            <RequestCard
              key={request.$id}
              request={request as unknown as InnovationRequest}
            />
          ))}
        </div>
      </div>
    )
  }
}
