import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Pencil } from 'lucide-react'

interface Props {
  requestId: string
  submissionId: string
}

export default function EditButton({ requestId, submissionId }: Props) {
  return (
    <Button size='sm'>
      <Link
        href={`/innovations/requests/${requestId}/submissions/${submissionId}/edit`}
        className='flex items-center gap-2'
      >
        <Pencil />
        Edit
      </Link>
    </Button>
  )
}
