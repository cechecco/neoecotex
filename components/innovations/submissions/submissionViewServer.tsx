import { notFound } from 'next/navigation'
import { getOneSubmission, getRequestCheck } from '@/app/actions/actions'
import { SubmissionViewClient } from './submissionViewClient'

interface SubmissionViewServerProps {
  submissionId: string
}

export default async function SubmissionViewServer({ submissionId }: SubmissionViewServerProps) {
  try {
    const submission = await getOneSubmission(submissionId)
    if ('error' in submission) {
      return notFound()
    }

    const check = await getRequestCheck(submission.requestId)

    return (
      <div>
        <SubmissionViewClient
          submission={submission}
          check={check}
        />
      </div>
    )
  } catch (error) {
    console.error(error)
    return notFound()
  }
}
