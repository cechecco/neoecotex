import { Plus } from 'lucide-react'
import { Button } from '../ui/button'
import Link from 'next/link'

export default function SubmissionButton({ requestId, userHasSubmitted }: { requestId: string; userHasSubmitted: boolean }) {
  return (
    <Button
      size='sm'
      disabled={userHasSubmitted}
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
