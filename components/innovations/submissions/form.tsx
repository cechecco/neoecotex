import { getOneSubmission } from '@/app/actions/innovations'
import FormClient from '@/components/innovations/submissions/formClient'
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
    imagesIds: [],
  }
}

export default async function Form({ submissionId, requestId }: Props) {
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
      <FormClient
        initialSubmission={submissionData}
        submissionId={submissionId === 'new' ? undefined : submissionId}
        requestId={requestId}
      />
    </div>
  )
}
