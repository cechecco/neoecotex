'use server'

import { headers } from 'next/headers'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { OAuthProvider } from 'node-appwrite'
import { ID } from 'node-appwrite'

import { createAdminClient, createSessionClient } from '@/lib/server/appwrite'
import { baseUserSchema, loginUserSchema } from '@/lib/types'

import { createUser, getUser } from './users'

export async function signUpWithGoogle(formData: FormData) {
  const { account } = await createAdminClient()

  const origin = (await headers()).get('origin')

  const type = formData.get('type') as string
  const redirectUrl = await account.createOAuth2Token(OAuthProvider.Google, `${origin}/oauth?type=${type}`, `${origin}`)

  redirect(redirectUrl)
}

export async function signOut() {
  const { account } = await createSessionClient()
  ;(await cookies()).delete('user-session')
  await account.deleteSession('current')
  redirect('/')
}

const getUserData = (formData: FormData) => {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const name = formData.get('name') as string
  const type = formData.get('type') as string
  return { email, password, name, type }
}

const validateUser = (userData: { email: string; password: string; name: string; type: string }) => {
  const validatedFields = baseUserSchema.merge(loginUserSchema).safeParse(userData)
  if (!validatedFields.success) {
    return validatedFields.error.flatten().fieldErrors
  }
  return null
}

export async function signUpWithEmail(formData: FormData) {
  console.log('signUpWithEmail')
  const userData = getUserData(formData)
  if (!userData) {
    return { error: true, message: 'User not found' }
  }
  const validationErrors = validateUser(userData)

  if (validationErrors) {
    return {
      validationErrors,
    }
  }

  const { account } = await createAdminClient()

  await account.create(ID.unique(), userData.email, userData.password, userData.name)
  const session = await account.createEmailPasswordSession(userData.email, userData.password)

  ;(await cookies()).set('user-session', session.secret, {
    path: '/',
    httpOnly: true,
    sameSite: 'strict',
    secure: true,
  })

  if (!(await getUser())) await createUser(userData.type as string)

  redirect('/account/edit')
}

const getUserDataLogin = (formData: FormData) => {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  return { email, password }
}

const validateUserLogin = (userData: { email: string; password: string }) => {
  const validatedFields = loginUserSchema.safeParse(userData)
  if (!validatedFields.success) {
    return validatedFields.error.flatten().fieldErrors
  }
  return null
}

export async function signInWithEmail(formData: FormData) {
  const userData = getUserDataLogin(formData)
  const validationErrors = validateUserLogin(userData)

  if (validationErrors) {
    return {
      validationErrors,
    }
  }
  const { account } = await createAdminClient()

  try {
    const session = await account.createEmailPasswordSession(userData.email, userData.password)

    ;(await cookies()).set('user-session', session.secret, {
      path: '/',
      httpOnly: true,
      sameSite: 'strict',
      secure: true,
    })

    redirect('/innovations/requests') // Redirect to dashboard or home page after login
  } catch (error) {
    console.error('Sign in error:', error)
    throw new Error('Failed to sign in. Please check your credentials and try again.')
  }
}

export async function getLoggedInUser() {
  try {
    const { account } = await createSessionClient()
    return await account.get()
  } catch {
    return null
  }
}
