import { getWinnerEmail } from '@/app/actions/actions'
import { Trophy } from 'lucide-react'
import WinnerEmailButtonClient from './winnerEmailButtonClient'
import { innovations } from '@/lib/server/database'

export default async function WinnerEmailButton({ requestId, size = 'md' }: { requestId: string; size?: 'sm' | 'md' }) {
  const email = await getWinnerEmail(requestId)
  const iAmWinner = await innovations.iAmWinner(requestId)
  const iAmOwner = await innovations.iAmOwner(requestId)
  if (size === 'sm') {
    return (
      <>
        {email ? (
          <div className={`flex flex-row items-left gap-2 p-1 px-2 rounded-md ${iAmWinner || iAmOwner ? 'bg-green-300 text-green-700' : 'bg-slate-300 text-slate-700'}`}>
            <Trophy className='w-4 h-4' />
          </div>
        ) : null}
      </>
    )
  }
  return (
    <>
      {email ? (
        <div className={`flex flex-row items-left gap-2 p-1 px-2 rounded-md ${iAmWinner || iAmOwner ? 'bg-green-300 text-green-700' : 'bg-amber-300 text-amber-700'}`}>
          <div className='flex flex-row items-center gap-2'>
            <p className='text-xs'>Winner</p>
            <Trophy className='w-4 h-4' />
          </div>
          <WinnerEmailButtonClient email={email} />
        </div>
      ) : null}
    </>
  )
}
