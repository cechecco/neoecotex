import React from 'react'

import { listSubmissions, getRequestsChecks, listSubmissionsByUser } from '@/app/actions/innovations'
import { getUser } from '@/app/actions/users'
import ListClient from '@/components/innovations/submissions/listClient'

interface Props {
  requestId: string | undefined
}

export default async function ListServer({ requestId }: Props) {
  try {
    let result
    if (!requestId) {
      result = await listSubmissionsByUser()
      if ('error' in result) {
        throw new Error(result.message)
      }
    } else {
      result = await listSubmissions(requestId)
      if ('error' in result) {
        throw new Error(result.message)
      }
    }

    const { documents } = result
    if (!documents?.length) {
      return <div className='text-sm text-muted-foreground'>No submissions found.</div>
    }

    const checks = await getRequestsChecks(requestId ? [requestId] : result.documents.map((submission) => submission.requestId))

    const user = await getUser()
    if (!user) {
      return <div className='text-sm text-muted-foreground'>User not found.</div>
    }

    return (
      <ListClient
        submissions={documents}
        checks={checks}
        userType={user.type}
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
