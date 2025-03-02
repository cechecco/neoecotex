import { Plus } from 'lucide-react'
import Link from 'next/link'

import Header from '@/components/innovations/requests/header'
import { Button } from '@/components/ui/button'
export default function InnovationRequestDashboardPage() {
  return (
    <main>
      <Header title='My Dashboard'>
        <Button size='sm'>
          <Link
            href={`/innovations/requests/new/edit`}
            className='flex items-center gap-2'
          >
            <Plus /> New Request
          </Link>
        </Button>
      </Header>
    </main>
  )
}
