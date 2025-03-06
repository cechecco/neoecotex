import { LayoutDashboard } from 'lucide-react'
import Link from 'next/link'

import Breadcrumb from '@/components/innovations/requests/breadcrumb'
import { Button } from '@/components/ui/button'
export default function InnovationsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <div className='main flex justify-between items-center border-b border-white pb-2 mb-2'>
        <Breadcrumb />
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
      {children}
    </div>
  )
}
