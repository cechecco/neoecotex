'use server'

import { headers } from 'next/headers'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { OAuthProvider } from 'node-appwrite'
import { ID } from 'node-appwrite'

import { createAdminClient, createSessionClient } from '@/lib/server/appwrite'

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

export async function signUpWithEmail(formData: FormData) {
  console.log('signUpWithEmail')
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const name = formData.get('name') as string
  const type = formData.get('type') as string
  const { account } = await createAdminClient()

  await account.create(ID.unique(), email, password, name)
  const session = await account.createEmailPasswordSession(email, password)

  ;(await cookies()).set('user-session', session.secret, {
    path: '/',
    httpOnly: true,
    sameSite: 'strict',
    secure: true,
  })

  if (!(await getUser())) await createUser(type as string)

  redirect('/account/edit')
}

export async function getLoggedInUser() {
  try {
    const { account } = await createSessionClient()
    return await account.get()
  } catch {
    return null
  }
}
