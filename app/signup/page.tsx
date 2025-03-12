import { redirect } from 'next/navigation'

import { getLoggedInUser } from '@/app/actions/auth'

import SignUpFormClient from './SignUpFormClient'

interface Props {
  searchParams: Promise<{ type: string }>
}

export default async function SignUpPage(props: Props) {
  const user = await getLoggedInUser()
  if (user) redirect('/account')

  const type = (await props.searchParams).type || 'innovator'

  return (
    <div className='flex items-start mt-8 justify-center min-h-screen'>
      <SignUpFormClient type={type} />
    </div>
  )
}
