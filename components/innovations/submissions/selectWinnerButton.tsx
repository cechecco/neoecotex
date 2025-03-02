'use client'

import { Button } from '@/components/ui/button'
import { selectWinner } from '@/app/actions/actions'
import { useRouter } from 'next/navigation'
import { RequestCheck } from '@/lib/types'
export default function SelectWinnerButton({ submissionId, check }: { submissionId: string; check: RequestCheck }) {
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
