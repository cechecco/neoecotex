import { Plus } from 'lucide-react'
import { Button } from '../ui/button'
import Link from 'next/link'
import { innovations } from '@/lib/server/database'

export default async function SubmissionButton({ requestId, userHasSubmitted }: { requestId: string; userHasSubmitted: boolean }) {
  const thereIsWinner = await innovations.thereIsWinner(requestId)
  return (
    <Button
      size='sm'
      disabled={userHasSubmitted || thereIsWinner}
    >
      <Link
        href={`/innovations/requests/${requestId}/submissions/new/edit`}
        className='flex items-center gap-2'
      >
        <Plus />
        Submit Solution
      </Link>
    </Button>
  )
}
