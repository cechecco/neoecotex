import { Suspense } from 'react'

import Header from '@/components/innovations/requests/header' // TODO: change position
import Skeleton from '@/components/innovations/requests/skeleton'
import ViewServer from '@/components/users/viewServer'

export default async function UserPage() {
  return (
    <main>
      <Header title='User Details' />
      <Suspense fallback={<Skeleton />}>
        <ViewServer />
      </Suspense>
    </main>
  )
}
