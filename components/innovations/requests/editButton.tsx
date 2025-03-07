import { Pencil } from 'lucide-react'

import LoadingLink from '@/components/innovations/LoadingLink'
import { Button } from '@/components/ui/button'
import { RequestCheck } from '@/lib/types'

interface EditRequestButtonProps {
  requestId: string
  check: RequestCheck
}

export default function EditButton({ requestId, check }: EditRequestButtonProps) {
  return (
    <LoadingLink
      href={`/innovations/requests/${requestId}/edit`}
      className='flex items-center gap-2'
    >
      <Button
        size='sm'
        disabled={check.thereIsWinner}
      >
        <Pencil />
        Edit
      </Button>
    </LoadingLink>
  )
}
