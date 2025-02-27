import { Plus } from 'lucide-react'
import { Button } from '../ui/button'
import Link from 'next/link'
import { RequestChecks } from '@/lib/server/database'

export default async function SubmissionButton({ checks }: { checks: RequestChecks }) {

  return (
    <Button
      size='sm'
      disabled={checks.iHaveSubmitted || checks.thereIsWinner}
    >
      <Link
        href={`/innovations/requests/${checks.requestId}/submissions/new/edit`}
        className='flex items-center gap-2'
      >
        <Plus />
        Submit Solution
      </Link>
    </Button>
  )
}
