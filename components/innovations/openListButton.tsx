import { Eye } from 'lucide-react'

import LoadingLink from '@/components/innovations/LoadingLink'
import { Button } from '@/components/ui/button'

interface Props {
  requestId: string
}

export default function OpenListButton({ requestId }: Props) {
  return (
    <LoadingLink
      href={`/innovations/requests/${requestId}/submissions`}
      className='flex items-center gap-2'
    >
      <Button size='sm'>
        <Eye />
        View Submissions
      </Button>
    </LoadingLink>
  )
}
