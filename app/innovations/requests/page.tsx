import RequestsList from '@/components/innovations/requestsList'
import RequestsListSkeleton from '@/components/innovations/requestsListSkeleton'
import { Button } from '@/components/ui/button'
import { LayoutDashboard } from 'lucide-react'
import { Suspense } from 'react'
import Link from 'next/link'
export const experimental_ppr = true

export default function InnovationsPage() {
  return (
    <main>
      <div className='flex flex-col md:flex-row gap-2 justify-between mb-4'>
        <p className='text-3xl font-bold'>Innovation Requests</p>
        <div className='flex items-center justify-end gap-2'>
          <Button size='sm'>
            <Link
              href='/innovations/requests/dashboard'
              className='flex items-center gap-2'
            >
              <LayoutDashboard />
              Dashboard
            </Link>
          </Button>
        </div>
      </div>
      <Suspense fallback={<RequestsListSkeleton />}>
        <RequestsList />
      </Suspense>
    </main>
  )
}
