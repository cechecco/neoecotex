'use server'

import { redirect } from 'next/navigation'
import { ID } from 'node-appwrite'
import { InnovationRequest, Submission, SubmissionWithStringId } from '@/lib/types'
import { DatabaseError } from '@/lib/types'
import { innovations } from '@/lib/server/database'
import { submissions } from '@/lib/server/database'

export async function getInnovationRequests() {
  return await innovations.list()
}

export async function getInnovationRequest(id: string) {
  if (id === 'new') {
    return {
      title: '',
      briefDescription: '',
      detailedDescription: '',
      expectedExpertise: '',
      expectedTimeline: '',
      budget: 0,
      company: '',
      concept: '',
      field: '',
      marketingConsent: false,
      ecologyConsent: false,
    } as InnovationRequest
  }

  return (await innovations.get(id)) as InnovationRequest | DatabaseError
}

export async function updateInnovationRequest(previousState: InnovationRequest, formData: FormData) {
  const request = innovations.getRawRequest(formData)
  const errors = innovations.validationErrors(request)

  if (errors) {
    return {
      validationError: true,
      errors,
    }
  }

  const id = previousState.$id || ID.unique()

  if ('$id' in previousState && previousState.$id) {
    return (await innovations.update(id, request)) as DatabaseError | InnovationRequest
  } else {
    await innovations.create(id, request)
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

export async function getSubmission({ submissionId, requestId }: { submissionId: string; requestId: string }) {
  console.log('submissionId', submissionId)
  console.log('requestId', requestId)
  if (submissionId === 'new') {
    return {
      title: '',
      briefDescription: '',
      requestId: requestId,
    } as SubmissionWithStringId
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
      redirect(`/innovations/requests/${previousState.requestId.$id}/submissions/${id}`)
    }
  } else {
    try {
      await submissions.create(id, submission)
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
