import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

import { createAdminClient } from '@/lib/server/appwrite'

import { createUser, getUser } from '../actions/users'

export async function GET(request: NextRequest) {
  const userId = request.nextUrl.searchParams.get('userId')
  const secret = request.nextUrl.searchParams.get('secret')
  const type = request.nextUrl.searchParams.get('type')
  if (!userId || !secret) {
    return NextResponse.redirect(`${request.nextUrl.origin}/404`) // TODO: redirect to 404 page
  }

  const { account } = await createAdminClient()

  const session = await account.createSession(userId, secret)

  ;(await cookies()).set('user-session', session.secret, {
    httpOnly: true,
    sameSite: 'strict',
    secure: true,
  })

  if (!(await getUser())) await createUser(type as string)

  return NextResponse.redirect(`${request.nextUrl.origin}/innovations/requests`)
}
