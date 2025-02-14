import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Plus } from 'lucide-react'
export default function InnovationRequestDashboardPage() {
  return (
    <main>
      <div className='flex justify-between items-center mb-4'>
        <p className='text-3xl font-bold'>My Innovation Dashboard</p>
        <div className='flex items-center justify-end gap-2'>
          <Button size='sm'>
            <Link href={`/innovations/requests/new/edit`}>
              <Plus /> New Request
            </Link>
          </Button>
        </div>
      </div>
    </main>
  )
}
