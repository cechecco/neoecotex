'use server'

import { redirect } from 'next/navigation'
import { ID } from 'node-appwrite'
import { InnovationRequest, Submission, SubmissionWithMetadata } from '@/lib/types'
import { DatabaseError } from '@/lib/types'
import { computeRequestChecks, innovations } from '@/lib/server/database'
import { submissions } from '@/lib/server/database'
import { getLoggedInUser } from '../actions'

export async function getInnovationRequests(pagination: { page: number; limit: number }) {
  const response = await innovations.list(pagination)
  if ('error' in response) {
    return response
  }

  const typedDocs: InnovationRequest[] = response.documents as unknown as InnovationRequest[]

  return {
    documents: typedDocs
  }
}

export async function getInnovationRequest(id: string) {
  return (await innovations.get(id)) as InnovationRequest | DatabaseError
}

export async function updateInnovationRequest(previousState: InnovationRequest, formData: FormData) {
  const data = innovations.getRequestData(formData)
  const errors = innovations.validationErrors(data)

  if (errors) {
    return {
      validationError: true,
      errors,
    }
  }

  if ('$id' in previousState && previousState.$id) {
    const id = previousState.$id
    return (await innovations.update(data, id)) as DatabaseError | InnovationRequest
  } else {
    const id = await innovations.create(data)
    redirect(`/innovations/requests/${id}`)
  }
}

export async function deleteInnovationRequest(id: string) {
  await innovations.delete(id)
  redirect(`/innovations/requests`)
}

export async function getSubmissions(requestId: string) {
  return await submissions.list(requestId)
}

export async function getSubmissionData(submissionId: string, requestId: string) {
  const user = await getLoggedInUser()

  if (!user) {
    console.error('User not found')
    return {
      error: true,
      message: 'User not found'
    }
  }

  if (submissionId === 'new') {
    const submission: SubmissionWithMetadata = {
      title: '',
      briefDescription: '',
      requestId: requestId,
      owner: user?.$id
    }
    return submission
  }
  return (await submissions.get(submissionId)) as Submission | DatabaseError
}

export async function updateSubmission(previousState: Submission, formData: FormData) {
  const submission = submissions.getRawSubmission(formData)

  const errors = submissions.validationErrors(submission)

  if (errors) {
    return {
      validationError: true,
      errors,
    }
  }

  const id = previousState.$id || ID.unique()

  if ('$id' in previousState && previousState.$id) {
    try {
      ;(await submissions.update(id, submission)) as DatabaseError | Submission //
    } catch (error) {
      console.error(error)
      return {
        error: true,
        message: 'Error updating submission',
      }
    } finally {
      redirect(`/innovations/requests/${previousState.requestId}/submissions/${id}`)
    }
  } else {
    try {
      const user = await getLoggedInUser()
      if (!user) {
        console.error('User not found')
        return {
          error: true,
          message: 'User not found' 
        }
      }
      await submissions.create({ ...submission, owner: user.$id })
    } catch (error) {
      console.error(error)
      return {
        error: true,
        message: 'Error creating submission',
      }
    } finally {
      redirect(`/innovations/requests/${previousState.requestId}/submissions/${id}`)
    }
  }
}

export async function deleteSubmission(id: string, requestId: string) {
  await submissions.delete(id)
  redirect(`/innovations/requests/${requestId}/submissions`)
}

export async function selectWinner(requestId: string, submissionId: string) {
  await innovations.selectWinner(requestId, submissionId)
  // redirect(`/innovations/requests/${requestId}/submissions`)
}

export async function getRequestsChecks(requestIds: string[]) {
  console.log('getRequestsChecks', requestIds)
  return await computeRequestChecks(requestIds)
}
