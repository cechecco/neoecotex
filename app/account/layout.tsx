import { LayoutDashboard } from 'lucide-react'

import LoadingLink from '@/components/innovations/LoadingLink'
import Breadcrumb from '@/components/innovations/requests/breadcrumb'
import { Button } from '@/components/ui/button'

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <div className='main flex justify-between items-center border-b border-white pb-2 mb-2'>
        <Breadcrumb />
        <LoadingLink
          href='/innovations/requests/dashboard'
          className='flex items-center gap-2'
        >
          <Button size='sm'>
            <LayoutDashboard />
            Dashboard
          </Button>
        </LoadingLink>
      </div>
      {children}
    </div>
  )
}
