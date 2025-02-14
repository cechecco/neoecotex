import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Plus } from 'lucide-react'
export default async function InnovationRequestDashboardPage() {
  return (
    <main>
      <div className='flex justify-between items-center mb-4'>
        <p className='text-3xl font-bold text-white'>My Innovation Dashboard</p>
        <div className='flex items-center justify-end gap-2'>
          <Link href={`/innovations/requests/new/edit`}>
            <Button size='sm'>
              <Plus /> New Request
            </Button>
          </Link>
        </div>
      </div>
    </main>
  )
}
