import { notFound } from 'next/navigation'
import { getOneRequest, getRequestCheck, getRequestsChecks } from '@/app/actions/actions'
import { RequestViewClient } from './requestViewClient'

interface RequestViewServerProps {
  id: string
}

export default async function RequestViewServer({ id }: RequestViewServerProps) {
  try {
    const request = await getOneRequest(id)
    if ('error' in request) {
      return notFound()
    }

    const check = await getRequestCheck(id)

    return (
      <div>
        <RequestViewClient request={request} check={check} />
      </div>
    )
  } catch (error) {
    console.error(error)
    return notFound()
  }
}
