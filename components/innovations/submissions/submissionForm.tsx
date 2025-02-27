import { getSubmissionData } from '@/app/actions/actions'
import SubmissionFormClient from './submissionFormClient'
import { Submission } from '@/lib/types'
import { SubmissionProvider } from '@/contexts/submissionContext'

interface Props {
  submissionId: string
  requestId: string
}

export async function SubmissionForm({ submissionId, requestId }: Props) {
  const submission = await getSubmissionData(submissionId, requestId)
  if ('error' in submission) {
    return (
      <div className='flex items-center justify-center h-full'>
        <p className='text-red-500'>{submission.message}</p>
      </div>
    )
  }
  return (
    <div>
      {JSON.stringify(submission)}
      
      <SubmissionProvider initialSubmission={submission as unknown as Submission}>
        aa
        <SubmissionFormClient />
      </SubmissionProvider>
    </div>
  )
}
