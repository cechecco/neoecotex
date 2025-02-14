'use server'

import { createAdminClient, createDatabaseAdminClient, createSessionClient } from '@/lib/server/appwrite'
import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { OAuthProvider } from 'node-appwrite'
import { cookies } from 'next/headers'
import { ID } from 'node-appwrite'
import { InnovationRequest } from '@/lib/types'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

interface ValidationError {
  validationError: boolean
  errors: Record<string, string[]>
}

const innovationRequestSchema = z.object({
  title: z.string().min(1, 'Title is required').max(64, 'Title must be less than 64 characters'),
  company: z.string().min(1, 'Company is required').max(64, 'Company must be less than 64 characters'),
  briefDescription: z.string().min(1, 'Brief description is required').max(140, 'Brief description must be less than 140 characters'),
  detailedDescription: z.string().min(1, 'Detailed description is required').max(1000, 'Detailed description must be less than 1000 characters'),
  expectedExpertise: z.string().min(1, 'Expected expertise is required').max(140, 'Expected expertise must be less than 140 characters'),
  expectedTimeline: z.string().min(1, 'Expected timeline is required').max(140, 'Expected timeline must be less than 140 characters'),
  budget: z.number().min(100, 'Budget must be greater than 100'),
  concept: z.string().min(1, 'Concept is required').max(140, 'Concept must be less than 140 characters'),
  field: z.string().min(1, 'Field is required').max(140, 'Field must be less than 140 characters'),
  marketingConsent: z.boolean(),
  ecologyConsent: z.boolean(),
}) as z.ZodType<InnovationRequest>

export async function signUpWithGoogle() {
  const { account } = await createAdminClient()

  const origin = (await headers()).get('origin')

  const redirectUrl = await account.createOAuth2Token(OAuthProvider.Google, `${origin}/oauth`, `${origin}/signup`)

  redirect(redirectUrl)
}

export async function signOut() {
  const { account } = await createSessionClient()

  ;(await cookies()).delete('user-session')
  await account.deleteSession('current')

  redirect('/signup')
}

export async function signUpWithEmail(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const name = formData.get('name') as string

  const { account } = await createAdminClient()

  await account.create(ID.unique(), email, password, name)
  const session = await account.createEmailPasswordSession(email, password)

  ;(await cookies()).set('user-session', session.secret, {
    path: '/',
    httpOnly: true,
    sameSite: 'strict',
    secure: true,
  })

  redirect('/account')
}

export async function getLoggedInUser() {
  try {
    const { account } = await createSessionClient()
    return await account.get()
  } catch {
    return null
  }
}

export async function createInnovationRequest(innovationRequest: InnovationRequest) {
  const { databases } = await createDatabaseAdminClient()
  const promise = databases.createDocument('67aa7414000f83ae7018', '67aa745800179944f652', ID.unique(), innovationRequest)

  return promise.then(
    function (response) {
      revalidatePath(`/innovations/requests`)
      return response
    },
    function (error) {
      return { error: true, message: error.toString() as string }
    }
  )
}

export async function getInnovationRequests() {
  const { databases } = await createDatabaseAdminClient()

  const promise = databases.listDocuments('67aa7414000f83ae7018', '67aa745800179944f652')

  return promise.then(
    function (response) {
      return response as unknown as { documents: InnovationRequest[] }
    },
    function (error) {
      return { error: true, message: error.toString() as string }
    }
  )
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
  const { databases } = await createDatabaseAdminClient()

  const promise = databases.getDocument('67aa7414000f83ae7018', '67aa745800179944f652', id)

  return promise.then(
    function (response) {
      return response
    },
    function (error) {
      return { error: true, message: error.toString() as string }
    }
  )
}

export async function updateInnovationRequest(previousState: InnovationRequest, formData: FormData) {
  const rawRequest = {
    title: formData.get('title'),
    briefDescription: formData.get('briefDescription'),
    detailedDescription: formData.get('detailedDescription'),
    expectedExpertise: formData.get('expectedExpertise'),
    expectedTimeline: formData.get('expectedTimeline'),
    budget: parseInt(formData.get('budget') as string) || 0,
    company: formData.get('company'),
    concept: formData.get('concept'),
    field: formData.get('field'),
    marketingConsent: !!formData.get('marketingConsent'),
    ecologyConsent: !!formData.get('ecologyConsent'),
  } as InnovationRequest

  const validatedFields = innovationRequestSchema.safeParse(rawRequest)

  if (!validatedFields.success) {
    return {
      validationError: true,
      errors: validatedFields.error.flatten().fieldErrors as Record<keyof InnovationRequest, string[]>,
    } as ValidationError
  }

  const request = validatedFields.data
  const { databases } = await createDatabaseAdminClient()

  let promise: Promise<unknown>
  const id = previousState.$id || ID.unique()
  try {
    if ('$id' in previousState && previousState.$id) {
      promise = databases.updateDocument('67aa7414000f83ae7018', '67aa745800179944f652', id, request)

      return (await promise) as unknown as InnovationRequest
    } else {
      await databases.createDocument('67aa7414000f83ae7018', '67aa745800179944f652', id, request)
    }
  } catch (error) {
    return { error: true, message: (error as object).toString() }
  } finally {
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
