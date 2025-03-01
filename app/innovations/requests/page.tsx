import { Suspense } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { LayoutDashboard } from 'lucide-react'
import RequestsListServer from '@/components/innovations/requestsListServer'
import RequestsListSkeleton from '@/components/innovations/requestsListSkeleton'
import Header from '@/components/innovations/Header'

export const dynamic = 'force-dynamic'

export default function RequestsPage() {
  return (
    <main>
      <Header title='Requests'>
        <Button size='sm'>
          <Link
            href='requests/dashboard'
            className='flex items-center gap-2'
          >
            <LayoutDashboard />
            Dashboard
          </Link>
        </Button>
      </Header>

      <Suspense fallback={<RequestsListSkeleton />}>
        <RequestsListServer />
      </Suspense>
    </main>
  )
}
