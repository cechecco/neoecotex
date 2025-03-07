import { Pencil } from 'lucide-react'

import LoadingLink from '@/components/innovations/LoadingLink'
import { Button } from '@/components/ui/button'

interface Props {
  requestId: string
  submissionId: string
}

export default function EditButton({ requestId, submissionId }: Props) {
  return (
    <LoadingLink
      href={`/innovations/requests/${requestId}/submissions/${submissionId}/edit`}
      className='flex items-center gap-2'
    >
      <Button size='sm'>
        <Pencil />
        Edit
      </Button>
    </LoadingLink>
  )
}
