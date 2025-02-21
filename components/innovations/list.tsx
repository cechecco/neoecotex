import RequestCard from './requestCard'
import { InnovationRequest } from '@/lib/types'
export default function List({ innovationRequests }: { innovationRequests: InnovationRequest[] }) {
  return (
    <>
      {innovationRequests.map((request: InnovationRequest, index: number) => (
        <RequestCard
          key={index}
          request={request as InnovationRequest}
        />
      ))}
    </>
  )
}
