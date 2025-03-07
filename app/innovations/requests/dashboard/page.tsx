import { Plus } from 'lucide-react'
import { Suspense } from 'react'

import LoadingLink from '@/components/innovations/LoadingLink'
import Header from '@/components/innovations/requests/header'
import ListServer from '@/components/innovations/requests/listServer'
import Skeleton from '@/components/innovations/requests/skeleton'
import { Button } from '@/components/ui/button'

export default function InnovationRequestDashboardPage() {
  return (
    <main>
      <Header title='My Requests'>
        <LoadingLink
          href={`/innovations/requests/new/edit`}
          className='flex items-center gap-2'
        >
          <Button size='sm'>
            <Plus /> Create New Request
          </Button>
        </LoadingLink>
      </Header>

      <Suspense fallback={<Skeleton />}>
        <ListServer
          filterField='owner'
          filterValue={'me'}
        />
      </Suspense>
    </main>
  )
}
