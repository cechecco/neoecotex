import { Suspense } from 'react'

import Header from '@/components/innovations/requests/header'
import ListServer from '@/components/innovations/requests/listServer'
import Skeleton from '@/components/innovations/requests/skeleton'

export const dynamic = 'force-dynamic'

export default function RequestsPage() {
  return (
    <main>
      <Header title='Requests' />

      <Suspense fallback={<Skeleton />}>
        <ListServer
          filterField='winner'
          filterValue={false}
        />
      </Suspense>
    </main>
  )
}
