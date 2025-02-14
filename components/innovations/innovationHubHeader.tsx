'use client'

import { Button } from '@/components/ui/button'
import { ChevronRight, House } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

// TODO improve this

export default function InnovationHubHeader() {
  const pathname = usePathname()
  const id = pathname?.match(/\/innovations\/requests\/([^\/]+)/)?.[1]
  const dashboard = pathname?.match(/\/innovations\/requests\/dashboard/)
  return (
    <div className='flex justify-left items-center'>
      <Link
        href='/innovations/requests'
        className='flex items-center'
      >
        <Button
          variant='link'
          size='sm'
        >
          <House className='w-4 h-4' />
          Innovation Hub
        </Button>
      </Link>

      {id && !dashboard ? (
        <p className='text-primary'>
          <ChevronRight />
        </p>
      ) : null}
      {id && !dashboard ? (
        <Button
          variant='link'
          size='sm'
        >
          <Link href={`/innovations/requests/${id}`}>request {id.slice(0, 6)}</Link>
        </Button>
      ) : null}
      {dashboard ? (
        <p>
          <ChevronRight />
        </p>
      ) : null}
      {dashboard ? (
        <Button
          variant='ghost'
          size='sm'
        >
          Dashboard
        </Button>
      ) : null}
    </div>
  )
}
