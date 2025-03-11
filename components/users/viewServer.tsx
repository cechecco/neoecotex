import { notFound } from 'next/navigation'

import { getUser } from '@/app/actions/users'
import ViewClient from '@/components/users/viewClient'

export default async function ViewServer() {
  const user = await getUser()
  if (!user) {
    return notFound()
  }

  return (
    <div>
      <ViewClient user={user} />
    </div>
  )
}
