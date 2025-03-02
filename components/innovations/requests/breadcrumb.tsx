'use client'

import { Button } from '@/components/ui/button'
import { CircleHelpIcon, House, ShieldPlus } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

// TODO improve this

export default function Breadcrumb() {
  const pathname = usePathname()
  const id = pathname?.match(/\/innovations\/requests\/([^\/]+)/)?.[1]
  const dashboard = pathname?.match(/\/innovations\/requests\/dashboard/)
  const submission = pathname?.match(/\/innovations\/requests\/([^\/]+)\/submissions\/([^\/]+)/)?.[2]

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
          <House className='w-4 h-4 text-foreground' />
          <p className='text-foreground'>Innovation Hub</p>
        </Button>
      </Link>

      {id && !dashboard && (
        <>
          <p className='text-primary'>/</p>
          <Button
            variant='link'
            size='sm'
            className='text-foreground'
          >
            <Link
              href={`/innovations/requests/${id}`}
              className='flex items-center gap-2'
            >
              <CircleHelpIcon className='w-4 h-4 text-foreground' />
              <span className='hidden md:block text-foreground'>request {id.slice(0, 6)}</span>
            </Link>
          </Button>
        </>
      )}

      {submission && (
        <>
          <p className='text-primary'>/</p>
          <Button
            variant='link'
            size='sm'
            className='text-foreground'
          >
            <Link
              href={`/innovations/requests/${id}/submissions/${submission}`}
              className='flex items-center gap-2'
            >
              <ShieldPlus className='w-4 h-4 text-foreground' />
              <span className='hidden md:block text-foreground'>submission {submission.slice(0, 6)}</span>
            </Link>
          </Button>
        </>
      )}

      {dashboard && (
        <>
          <p className='text-primary'>/</p>
          <Button
            variant='ghost'
            size='sm'
            className='text-foreground'
          >
            Dashboard
          </Button>
        </>
      )}
    </div>
  )
}
