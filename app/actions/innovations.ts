'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { requestsService, submissionsService, computeRequestChecks } from '@/lib/server/database'
import { imageSchema, RequestData, requestSchema, Submission, SubmissionData, submissionSchema } from '@/lib/types'

export async function listRequests(page: number, limit: number, filterField: string, filterValue: string | number | boolean) {
  try {
    const result = await requestsService.list({ page, limit }, filterField, filterValue)
    return result
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

const validateRequest = (data: RequestData) => {
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
    company: (formData.get('company') as string) || '',
    concept: (formData.get('concept') as string) || '',
    field: (formData.get('field') as string) || '',
    marketingConsent: !!formData.get('marketingConsent'),
    ecologyConsent: !!formData.get('ecologyConsent'),
    imagesIds: formData.getAll('imagesIds').map((entry) => entry.toString()),
  }

  return data
}

const getImages = (formData: FormData) => {
  const images = formData.getAll('images').filter((image) => (image as File).size > 0) as File[]
  return images
}

const validateImages = (images: File[]) => {
  const validatedFields = imageSchema.safeParse({ images })
  if (!validatedFields.success) {
    return validatedFields.error.flatten().fieldErrors
  }
  return null
}

// export async function createRequest(formData: FormData) {
//   const request = getRequestsData(formData)
//   const validationErrors = validateRequest(request)
//   if (validationErrors) return { validationErrors }
//   return await requestsService.create(request)
// }

export async function updateRequest(requestId: string | undefined, formData: FormData) {
  const data = getRequestsData(formData)
  const images = getImages(formData)
  const validationErrors = validateRequest(data)
  const imagesValidationErrors = validateImages(images)
  if (validationErrors || imagesValidationErrors) {
    return {
      validationErrors,
      imagesValidationErrors,
    }
  }
  if (!requestId) {
    let newRequestId: string = ''
    try {
      const created = await requestsService.create({ data, images })
      newRequestId = created.$id
      return {
        request: created,
      }
    } catch (error) {
      return { error: (error as Error).message }
    } finally {
      revalidatePath('/innovations/requests')
      redirect(`/innovations/requests/${newRequestId}`)
    }
  } else {
    try {
      const updated = await requestsService.update(requestId, { data, images })
      return {
        request: updated,
      }
    } catch (error) {
      return { error: (error as Error).message }
    } finally {
      revalidatePath('/innovations/requests')
      redirect(`/innovations/requests/${requestId}`)
    }
  }
}

export async function deleteRequest(requestId: string) {
  try {
    await requestsService.deleteOne(requestId)
  } catch (error) {
    console.error(error)
    return { error: true, message: String(error) }
  } finally {
    revalidatePath('/innovations/requests')
    redirect('/innovations/requests')
  }
}

export async function selectWinner(requestId: string, submissionId: string) {
  try {
    await requestsService.selectWinner(requestId, submissionId)
    redirect(`/innovations/requests/${requestId}/submissions/${submissionId}`)
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

const validateSubmission = (data: Partial<Submission>) => {
  const validatedFields = submissionSchema.safeParse(data)
  if (!validatedFields.success) {
    return validatedFields.error.flatten().fieldErrors
  }
  return null
}

const getSubmissionData = (formData: FormData) => {
  const data: SubmissionData = {
    title: formData.get('title') as string,
    briefDescription: formData.get('briefDescription') as string,
    requestId: formData.get('requestId') as string,
  }
  return data
}

export async function updateSubmission(submissionId: string | undefined, formData: FormData) {
  const data = getSubmissionData(formData)
  const validationErrors = validateSubmission(data)
  if (validationErrors) return { validationErrors }

  if (!submissionId) {
    let newSubmissionId: string
    try {
      const created = await submissionsService.create(data)
      newSubmissionId = created.$id
    } catch (error) {
      return { error: (error as Error).message }
    }
    redirect(`/innovations/requests/${data.requestId}/submissions/${newSubmissionId}`)
  } else {
    return {
      submission: await submissionsService.update(submissionId, data),
    }
  }
}

export async function deleteSubmission(submissionId: string, requestId: string) {
  try {
    await submissionsService.deleteOne(submissionId)
  } catch (error) {
    console.error(error)
    return { error: true, message: String(error) }
  } finally {
    revalidatePath(`/innovations/requests`)
    redirect(`/innovations/requests/${requestId}`)
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
