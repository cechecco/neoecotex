'use server'

import { redirect } from 'next/navigation'
import { requestsService, submissionsService, computeRequestChecks, RequestCheck } from '@/lib/server/database'
import { Request, RequestCreateInput, RequestData, requestSchema, Submission } from '@/lib/types'
import { getLoggedInUser } from './auth'

export async function listRequests(page: number, limit: number) {
  try {
    const result = await requestsService.list({ page, limit })
    return result // { total, documents: Request[] ... }
  } catch (error) {
    console.error(error)
    return { error: true, message: String(error) }
  }
}

export async function getOneRequest(requestId: string) {
  try {
    return await requestsService.getOne(requestId)
  } catch (error) {
    console.error(error)
    return { error: true, message: String(error) }
  }
}

const validateRequest = (data: Partial<Request>) => {
  const validatedFields = requestSchema.safeParse(data)
  if (!validatedFields.success) {
    return validatedFields.error.flatten().fieldErrors
  }
  return null
}

const getRequestsData = (formData: FormData) => {
  const data: RequestData = {
    title: formData.get('title') as string,
    briefDescription: formData.get('briefDescription') as string, 
    detailedDescription: formData.get('detailedDescription') as string,
    expectedExpertise: formData.get('expectedExpertise') as string,
    expectedTimeline: formData.get('expectedTimeline') as string,
    budget: parseInt(formData.get('budget') as string) || 0,
    company: formData.get('company') as string || '',
    concept: formData.get('concept') as string || '',
    field: formData.get('field') as string || '',
    marketingConsent: !!formData.get('marketingConsent'),
    ecologyConsent: !!formData.get('ecologyConsent'),
  }
  return data
}

// export async function createRequest(formData: FormData) {
//   const request = getRequestsData(formData)
//   const validationErrors = validateRequest(request)
//   if (validationErrors) return { validationErrors }
//   return await requestsService.create(request)
// }

export async function updateRequest(requestId: string | undefined, formData: FormData) {
  const request = getRequestsData(formData)
  const validationErrors = validateRequest(request)
  if (validationErrors) return { validationErrors }
  if (!requestId) {
    let newRequestId: string
    try {
      const created = await requestsService.create(request)
      newRequestId = created.$id
    } catch (error) {
      return { error: (error as Error).message }
    }
    redirect(`/innovations/requests/${newRequestId}`)
  } else {
    return {
      request: await requestsService.update(requestId, request)
    }
  }
}

export async function deleteRequest(requestId: string) {
  try {
    await requestsService.deleteOne(requestId)
    redirect('/requests')
  } catch (error) {
    console.error(error)
    return { error: true, message: String(error) }
  }
}

export async function selectWinner(requestId: string, submissionId: string) {
  try {
    await requestsService.selectWinner(requestId, submissionId)
    redirect(`/requests/${requestId}`)
  } catch (error) {
    console.error(error)
    return { error: true, message: String(error) }
  }
}

export async function listSubmissions(requestId: string) {
  try {
    return await submissionsService.listByRequest(requestId)
  } catch (error) {
    console.error(error)
    return { error: true, message: String(error) }
  }
}

export async function getOneSubmission(submissionId: string) {
  try {
    return await submissionsService.getOne(submissionId)
  } catch (error) {
    console.error(error)
    return { error: true, message: String(error) }
  }
}

export async function createSubmission(data: Omit<Submission, '$id'|'$createdAt'|'$updatedAt'>) {
  try {
    const user = await getLoggedInUser()
    if (!user) {
      return { error: true, message: 'User not found' }
    }
    // Potresti anche forzare data.owner = user.$id, se vuoi
    const created = await submissionsService.create(data)
    // redirect(`/requests/${created.requestId}/submissions/${created.$id}`)
    return created
  } catch (error) {
    console.error(error)
    return { error: true, message: String(error) }
  }
}

export async function updateSubmission(submissionId: string, partialData: Partial<Submission>) {
  try {
    return await submissionsService.update(submissionId, partialData)
  } catch (error) {
    console.error(error)
    return { error: true, message: String(error) }
  }
}

export async function deleteSubmission(submissionId: string, requestId: string) {
  try {
    await submissionsService.deleteOne(submissionId)
    redirect(`/requests/${requestId}/submissions`)
  } catch (error) {
    console.error(error)
    return { error: true, message: String(error) }
  }
}

export async function getRequestsChecks(requestIds: string[]) {
  try {
    return await computeRequestChecks(requestIds)
  } catch (error) {
    console.error(error)
    return {}
  }
}

export async function getRequestCheck(requestId: string) {
  try {
    const checksMap = await getRequestsChecks([requestId])
  return checksMap[requestId]
  } catch (error) {
    console.error(error)
    throw error
  }
}
