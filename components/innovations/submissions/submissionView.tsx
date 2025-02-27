import { getSubmissionData } from '@/app/actions/actions'
import { SubmissionViewClient } from './submissionViewClient'
import { notFound } from 'next/navigation'
import { Submission } from '@/lib/types'
import WinnerEmailButton from '../winnerEmailButton'
import { computeRequestChecks } from '@/lib/server/database'
interface Props {
  submissionId: string
  requestId: string
}

export async function SubmissionView({ submissionId, requestId }: Props) {
  const submission = (await getSubmissionData(submissionId, requestId)) as Submission
  const checks = await computeRequestChecks([requestId])
  // if ('error' in submission) {
  //   return notFound()
  // }
  return (
    <div>
      {JSON.stringify(submission, null, 2)}
      <SubmissionViewClient submission={submission}>
        <WinnerEmailButton check={checks[requestId]} />
      </SubmissionViewClient>
    </div>
  )
}
