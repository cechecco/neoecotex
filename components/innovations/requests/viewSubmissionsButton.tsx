import { Button } from '@/components/ui/button'
import { Eye } from 'lucide-react'
import Link from 'next/link'

interface ViewSubmissionsButtonProps {
  requestId: string
}

export default function ViewSubmissionsButton({ requestId }: ViewSubmissionsButtonProps) {
  return (
    <Button size='sm'>
      <Link
        href={`/innovations/requests/${requestId}/submissions`}
        className='flex items-center gap-2'
      >
        <Eye />
        View Submissions
      </Link>
    </Button>
  )
}
