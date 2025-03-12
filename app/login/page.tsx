import { redirect } from 'next/navigation'

import { getLoggedInUser } from '@/app/actions/auth'

import LoginFormClient from './LoginFormClient'

export default async function LoginPage() {
  const user = await getLoggedInUser()
  if (user) redirect('/innovations/requests')

  return (
    <div className='flex items-start mt-8 justify-center min-h-screen'>
      <LoginFormClient />
    </div>
  )
}
