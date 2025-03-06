import { Plus } from 'lucide-react'
import Link from 'next/link'
import { Suspense } from 'react'

import Header from '@/components/innovations/requests/header'
import ListServer from '@/components/innovations/requests/listServer'
import Skeleton from '@/components/innovations/requests/skeleton'
import { Button } from '@/components/ui/button'
export default function InnovationRequestDashboardPage() {
  return (
    <main>
      <Header title='My Requests'>
        <Button size='sm'>
          <Link
            href={`/innovations/requests/new/edit`}
            className='flex items-center gap-2'
          >
            <Plus /> Create New Request
          </Link>
        </Button>
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
