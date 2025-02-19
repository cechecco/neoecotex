import { getSubmission } from '@/app/actions/actions'
import { SubmissionViewClient } from './submissionViewClient'
import { notFound } from 'next/navigation'
import { Submission } from '@/lib/types'

interface Props {
  submissionId: string
  requestId: string
}

export async function SubmissionView({ submissionId, requestId }: Props) {
  const submission = (await getSubmission({ submissionId, requestId })) as Submission
  if ('error' in submission) {
    return notFound()
  }
  return (
    <div>
      <SubmissionViewClient submission={submission} />
    </div>
  )
}
