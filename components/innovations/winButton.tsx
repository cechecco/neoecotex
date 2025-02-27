'use client'

import { Button } from '../ui/button'
import { selectWinner } from '@/app/actions/actions'
import { useRouter } from 'next/navigation'
import { RequestChecks } from '@/lib/server/database'
export default function WinButton({ submissionId, check }: { submissionId: string, check: RequestChecks }) {
  const router = useRouter()

  return (
    <Button
      size='sm'
      disabled={check.thereIsWinner}
      onClick={async () => {
        await selectWinner(check.requestId, submissionId)
        router.refresh()
      }}
    >
      <p>Select Winner</p>
    </Button>
  )
}
