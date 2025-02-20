'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
export default function OpenButton({ submissionId, requestId }: { submissionId: string; requestId: string }) {
  return (
    <Button size='sm'>
      <Link href={`/innovations/requests/${requestId}/submissions/${submissionId}`}>Open</Link>
    </Button>
  )
}
