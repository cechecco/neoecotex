import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Plus } from 'lucide-react'
export default function InnovationRequestDashboardPage() {
  return (
    <main>
      <div className='flex flex-col md:flex-row gap-2 justify-between mb-4'>
        <p className='text-3xl font-bold'>My Dashboard</p>
        <div className='flex items-center justify-end gap-2'>
          <Button size='sm'>
            <Link
              href={`/innovations/requests/new/edit`}
              className='flex items-center gap-2'
            >
              <Plus /> New Request
            </Link>
          </Button>
        </div>
      </div>
    </main>
  )
}
