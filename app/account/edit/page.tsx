import { Suspense } from 'react'

import Header from '@/components/innovations/requests/header' // TODO: change position
import Skeleton from '@/components/innovations/requests/skeleton' // TODO: change position
import Form from '@/components/users/form'

export default async function EditUserPage() {
  return (
    <main>
      <Header title='User Editor' />
      <Suspense fallback={<Skeleton />}>
        <Form />
      </Suspense>
    </main>
  )
}
