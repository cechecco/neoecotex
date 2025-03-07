'use client'

import LoadingLink from '@/components/innovations/LoadingLink'
import { Button } from '@/components/ui/button'

export default function OpenButton({ submissionId, requestId }: { submissionId: string; requestId: string }) {
  return (
    <LoadingLink href={`/innovations/requests/${requestId}/submissions/${submissionId}`}>
      <Button size='sm'>Open</Button>
    </LoadingLink>
  )
}
