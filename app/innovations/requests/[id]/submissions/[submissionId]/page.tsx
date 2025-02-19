import RequestSkeleton from '@/components/innovations/requestSkeleton'
import { SubmissionView } from '@/components/innovations/submissions/submissionView'
import { Suspense } from 'react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Eye, Pencil } from 'lucide-react'

interface Props {
  params: Promise<{
    id: string
    submissionId: string
  }>
}

export default async function SubmissionPage(props: Props) {
  const params = await props.params
  const requestId = params.id
  const submissionId = params.submissionId
  return (
    <main>
      <div className='flex flex-col md:flex-row gap-2 justify-between mb-4'>
        <p className='text-3xl font-bold'>Submission</p>
        <div className='flex items-center justify-end gap-2'>
          <Button size='sm'>
            <Link
              href={`/innovations/requests/${params.id}/submissions`}
              className='flex items-center gap-2'
            >
              <Eye />
              View Submissions
            </Link>
          </Button>
          <Button size='sm'>
            <Link
              href={`/innovations/requests/${requestId}/submissions/${submissionId}/edit`}
              className='flex items-center gap-2'
            >
              <Pencil /> Edit
            </Link>
          </Button>
        </div>
      </div>
      <Suspense fallback={<RequestSkeleton />}>
        <SubmissionView
          submissionId={submissionId}
          requestId={requestId}
        />
      </Suspense>
    </main>
  )
}
