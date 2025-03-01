import { Suspense } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { LayoutDashboard } from 'lucide-react'
import RequestsListServer from '@/components/innovations/requestsListServer'
import RequestsListSkeleton from '@/components/innovations/requestsListSkeleton'

export const dynamic = 'force-dynamic'

export default function RequestsPage() {
  return (
    <main className="p-4">
      <div className="flex flex-col md:flex-row gap-2 justify-between mb-4">
        <h1 className="text-3xl font-bold">Requests</h1>
        <div className="flex items-center justify-end gap-2">
          <Button size="sm">
            <Link href="requests/dashboard" className="flex items-center gap-2">
              <LayoutDashboard />
              Dashboard
            </Link>
          </Button>
        </div>
      </div>

      <Suspense fallback={<RequestsListSkeleton />}>
        <RequestsListServer />
      </Suspense>
    </main>
  )
}
