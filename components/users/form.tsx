import { notFound } from 'next/navigation'

import { getUser } from '@/app/actions/users'
import FormClient from '@/components/users/formClient'

export default async function Form() {
  const user = await getUser()
  if (!user) {
    return notFound()
  }
  return (
    <div>
      <FormClient user={user} />
    </div>
  )
}
