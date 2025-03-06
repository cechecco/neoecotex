import React from 'react'

import { getRequestCheck } from '@/app/actions/innovations'

import StatusBadges from './statusBadges'

interface HeaderProps {
  title?: string
  requestId?: string
  children?: React.ReactNode
}

const Header: React.FC<HeaderProps> = async ({ title, requestId, children }) => {
  const check = requestId ? await getRequestCheck(requestId) : undefined // TODO: handle error
  return (
    <div className='flex flex-col md:flex-row md:justify-between items-center gap-4 mb-4'>
      <div className='flex items-baseline gap-2 min-w-0'>
        <p className='text-3xl font-bold truncate flex-1 min-w-0'>{title}</p>
        {check && (
          <StatusBadges
            check={check}
            flex-shrink-0
          />
        )}
      </div>
      <div className='flex flex-col md:flex-row items-stretch justify-center md:justify-end gap-2 w-full md:w-auto flex-shrink-0'>{children}</div>
    </div>
  )
}

export default Header
