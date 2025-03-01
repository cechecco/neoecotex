import { getOneRequest } from '@/app/actions/actions'
import RequestFormClient from './requestFormClient'

interface Props {
  id: string
}

export async function RequestForm({ id }: Props) {
  const request = id === 'new' ? undefined : await getOneRequest(id)

  if (request && 'error' in request) {
    return (
      <div className='flex items-center justify-center h-full'>
        <p className='text-red-500'>{request.message}</p>
      </div>
    )
  }
  return (
    <div>
      <RequestFormClient initialRequest={request} />
    </div>
  )
}
