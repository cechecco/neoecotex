import { getOneSubmission } from '@/app/actions/actions'
import SubmissionFormClient from './submissionFormClient'
import { SubmissionData } from '@/lib/types'

interface Props {
  submissionId: string
  requestId: string
}

const getDefaultSubmission = (requestId: string): SubmissionData => {
  return {
    title: '',
    briefDescription: '',
    requestId: requestId,
  }
}

export async function SubmissionForm({ submissionId, requestId }: Props) {
  let submissionData: SubmissionData | undefined
  if (submissionId === 'new') {
    submissionData = getDefaultSubmission(requestId)
  } else {
    const submission = await getOneSubmission(submissionId)
    if (submission && 'error' in submission) {
      return (
        <div className='flex items-center justify-center h-full'>
          <p className='text-red-500'>{submission.message}</p>
        </div>
      )
    }
    submissionData = submission as SubmissionData
  }

  return (
    <div>
      <SubmissionFormClient
        initialSubmission={submissionData}
        submissionId={submissionId === 'new' ? undefined : submissionId}
        requestId={requestId}
      />
    </div>
  )
}
