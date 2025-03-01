import { notFound } from 'next/navigation'
import { getOneRequest, getRequestCheck } from '@/app/actions/actions'
import { RequestViewClient } from './requestViewClient'

interface RequestViewServerProps {
  requestId: string
}

export default async function RequestViewServer({ requestId }: RequestViewServerProps) {
  try {
    const request = await getOneRequest(requestId)
    if ('error' in request) {
      return notFound()
    }

    const check = await getRequestCheck(requestId)

    return (
      <div>
        <RequestViewClient
          request={request}
          check={check}
        />
      </div>
    )
  } catch (error) {
    console.error(error)
    return notFound()
  }
}
