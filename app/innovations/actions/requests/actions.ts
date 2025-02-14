'use server'

import { createDatabaseAdminClient } from '@/lib/server/appwrite'
import { redirect } from 'next/navigation'
import { ID } from 'node-appwrite'
import { InnovationRequest } from '@/lib/types'
import { DatabaseError } from './types'
import { createDocument, getDocument, listDocuments, updateDocument } from './database'
import { getRawRequest, validationErrors } from './validation'

export async function getInnovationRequests() {
  return await listDocuments()
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

  return await getDocument(id)
}

export async function updateInnovationRequest(previousState: InnovationRequest, formData: FormData) {
  const request = getRawRequest(formData)
  const errors = validationErrors(request)

  if (errors) {
    return {
      validationError: true,
      errors,
    }
  }

  const id = previousState.$id || ID.unique()

  if ('$id' in previousState && previousState.$id) {
    return (await updateDocument(id, request)) as DatabaseError | InnovationRequest
  } else {
    await createDocument(id, request)
    redirect(`/innovations/requests/${id}`)
  }
}

export async function deleteInnovationRequest(id: string) {
  const { databases } = await createDatabaseAdminClient()

  const promise = databases.deleteDocument('67aa7414000f83ae7018', '67aa745800179944f652', id)

  return promise.then(
    function () {
      redirect(`/innovations/requests`)
    },
    function (error) {
      return { error: true, message: error.toString() as string }
    }
  )
}
