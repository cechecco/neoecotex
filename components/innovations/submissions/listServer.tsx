import React from 'react'

import { listSubmissions, getRequestsChecks } from '@/app/actions/innovations'
import ListClient from '@/components/innovations/submissions/listClient'

interface Props {
  requestId: string
}

export default async function ListServer({ requestId }: Props) {
  try {
    const result = await listSubmissions(requestId)
    if ('error' in result) {
      throw new Error(result.message)
    }

    const { documents } = result
    if (!documents?.length) {
      return <div className='text-sm text-muted-foreground'>No submissions found.</div>
    }

    const checks = await getRequestsChecks([requestId])

    return (
      <ListClient
        requestId={requestId}
        submissions={documents}
        checks={checks}
      />
    )
  } catch (error) {
    return (
      <div className='text-red-500'>
        <h1>Errore durante il caricamento</h1>
        <p>{String(error)}</p>
      </div>
    )
  }
}
