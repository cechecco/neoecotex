import { Plus } from 'lucide-react'
import { Suspense } from 'react'

import { getUser } from '@/app/actions/users'
import LoadingLink from '@/components/innovations/LoadingLink'
import Header from '@/components/innovations/requests/header'
import ListServerRequests from '@/components/innovations/requests/listServer'
import Skeleton from '@/components/innovations/requests/skeleton'
import ListServerSubmissions from '@/components/innovations/submissions/listServer'
import ListSkeleton from '@/components/innovations/submissions/listSkeleton'
import { Button } from '@/components/ui/button'

export default async function InnovationRequestDashboardPage() {
  const user = await getUser()

  if (!user) {
    return <div>User not found</div>
  }

  if (user.type === 'innovator') {
    return (
      <main>
        <Header title={`My Submissions`} />
        <Suspense fallback={<ListSkeleton />}>
          <ListServerSubmissions requestId={undefined} />
        </Suspense>
      </main>
    )
  }

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
        <ListServerRequests
          filterField='owner'
          filterValue={'me'}
        />
      </Suspense>
    </main>
  )
}
