'use client'

import { getWinnerEmail, iAmWinner, iAmOwner } from '@/app/actions/actions'
import { Copy, Trophy } from 'lucide-react'
import { useState, useEffect } from 'react'

export default function WinnerEmailButton({ requestId, size = 'md' }: { requestId: string; size?: 'sm' | 'md' }) {
  const [email, setEmail] = useState<string | undefined>(undefined)
  const [won, setWon] = useState(false)
  const [owner, setOwner] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      const _email = await getWinnerEmail(requestId)
      const _won = await iAmWinner(requestId)
      const _owner = await iAmOwner(requestId)
      setEmail(_email)
      setWon(_won)
      setOwner(_owner)
    }
    fetchData()
  }, [requestId])

  if (size === 'sm') {
    return (
      <>
        {email ? (
          <div className={`flex flex-row items-left gap-2 p-1 px-2 rounded-md ${won || owner ? 'bg-green-300 text-green-700' : 'bg-slate-300 text-slate-700'}`}>
            <Trophy className='w-4 h-4' />
          </div>
        ) : null}
      </>
    )
  }
  return (
    <>
      {email ? (
        <div className={`flex flex-row items-left gap-2 p-1 px-2 rounded-md ${won || owner ? 'bg-green-300 text-green-700' : 'bg-amber-300 text-amber-700'}`}>
          <div className='flex flex-row items-center gap-2'>
            <p className='text-xs'>Winner</p>
            <Trophy className='w-4 h-4' />
          </div>
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
        </div>
      ) : null}
    </>
  )
}
