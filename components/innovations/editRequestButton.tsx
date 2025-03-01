import { Button } from '@/components/ui/button'
import { RequestCheck } from '@/lib/server/database'
import { Pencil } from 'lucide-react'
import Link from 'next/link'

interface EditRequestButtonProps {
  requestId: string
  check: RequestCheck
}

export default function EditRequestButton({ requestId, check }: EditRequestButtonProps) {
  return (
    <Button
      size='sm'
      disabled={check.thereIsWinner}
    >
      <Link
        href={`/innovations/requests/${requestId}/edit`}
        className='flex items-center gap-2'
      >
        Edit
        <Pencil />
      </Link>
    </Button>
  )
} 