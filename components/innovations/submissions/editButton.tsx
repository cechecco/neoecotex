import { Pencil } from 'lucide-react'

import LoadingLink from '@/components/innovations/LoadingLink'
import { Button } from '@/components/ui/button'
import { RequestCheck } from '@/lib/types'
interface Props {
  requestId: string
  submissionId: string
  check: RequestCheck
}

export default function EditButton({ requestId, submissionId, check }: Props) {
  return check.iAmOwner ? (
    <LoadingLink
      href={`/innovations/requests/${requestId}/submissions/${submissionId}/edit`}
      className='flex items-center gap-2'
    >
      <Button size='sm'>
        <Pencil />
        Edit
      </Button>
    </LoadingLink>
  ) : null
}
