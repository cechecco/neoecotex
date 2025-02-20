'use client'

import { Button } from '../ui/button'
import { selectWinner } from '@/app/actions/actions'
import { useRouter } from 'next/navigation'

export default function WinButton({ submissionId, requestId, winner }: { submissionId: string; requestId: string; winner: boolean }) {
  const router = useRouter()

  return (
    <Button
      size='sm'
      disabled={winner}
      onClick={async () => {
        await selectWinner(requestId, submissionId)
        router.refresh()
      }}
    >
      <p>Select Winner</p>
    </Button>
  )
}
