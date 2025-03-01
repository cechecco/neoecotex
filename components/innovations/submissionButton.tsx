import { Plus } from 'lucide-react'
import { Button } from '../ui/button'
import Link from 'next/link'
import { RequestCheck } from '@/lib/server/database'

export default function SubmitSolutionButton({ check }: { check: RequestCheck }) {
  return (
    <Button
      size='sm'
      disabled={check.iHaveSubmitted || check.thereIsWinner}
    >
      <Link
        href={`/innovations/requests/${check.requestId}/submissions/new/edit`}
        className='flex items-center gap-2'
      >
        <Plus />
        Submit Solution
      </Link>
    </Button>
  )
}
