import { Button } from '@/components/ui/button'
import { RequestCheck } from '@/lib/types'
import { Pencil } from 'lucide-react'
import Link from 'next/link'

interface EditRequestButtonProps {
  requestId: string
  check: RequestCheck
}

export default function EditButton({ requestId, check }: EditRequestButtonProps) {
  return (
    <Button
      size='sm'
      disabled={check.thereIsWinner}
    >
      <Link
        href={`/innovations/requests/${requestId}/edit`}
        className='flex items-center gap-2'
      >
        <Pencil />
        Edit
      </Link>
    </Button>
  )
}
