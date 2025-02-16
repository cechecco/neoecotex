import { getInnovationRequests } from '@/app/actions/actions'
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
          {innovationRequests.documents.map((request: unknown, index: number) => (
            <RequestCard
              key={index}
              request={request as InnovationRequest}
            />
          ))}
        </div>
      </div>
    )
  }
}
