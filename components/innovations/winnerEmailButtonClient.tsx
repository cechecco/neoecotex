'use client'

import { Copy } from 'lucide-react'

export default function WinnerEmailButtonClient({ email }: { email: string | undefined }) {
  return (
    <div className='flex flex-row items-center gap-2'>
      <p
        className='cursor-pointer text-lg font-bold'
        onClick={() => navigator.clipboard.writeText(email ?? '')}
      >
        {email ?? '-'}
      </p>
      <Copy
        className='w-4 h-4 cursor-pointer'
        onClick={() => navigator.clipboard.writeText(email ?? '')}
      />
    </div>
  )
}
