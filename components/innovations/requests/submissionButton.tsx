import { Plus } from 'lucide-react'
import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { RequestCheck } from '@/lib/types'

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
