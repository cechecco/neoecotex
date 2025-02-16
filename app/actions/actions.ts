'use server'

import { createDatabaseAdminClient } from '@/lib/server/appwrite'
import { redirect } from 'next/navigation'
import { ID } from 'node-appwrite'
import { InnovationRequest } from '@/lib/types'
import { DatabaseError } from './types'
import { innovations } from '../../lib/server/database'
import { getRawRequest, validationErrors } from '../../lib/server/validation'

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

  return await innovations.get(id)
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
