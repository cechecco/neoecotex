import { Eye } from 'lucide-react'

import LoadingLink from '@/components/innovations/LoadingLink'
import { Button } from '@/components/ui/button'
import { RequestCheck } from '@/lib/types'
interface Props {
  requestId: string
  check: RequestCheck
}

export default function OpenListButton({ requestId, check }: Props) {
  return check.iAmOwner ? (
    <LoadingLink
      href={`/innovations/requests/${requestId}/submissions`}
      className='flex items-center gap-2'
    >
      <Button size='sm'>
        <Eye />
        View Submissions
      </Button>
    </LoadingLink>
  ) : null
}
