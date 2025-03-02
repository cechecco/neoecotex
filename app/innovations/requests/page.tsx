import { Suspense } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { LayoutDashboard } from 'lucide-react'
import ListServer from '@/components/innovations/requests/listServer'
import Skeleton from '@/components/innovations/requests/skeleton'
import Header from '@/components/innovations/requests/header'

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

      <Suspense fallback={<Skeleton />}>
        <ListServer />
      </Suspense>
    </main>
  )
}
