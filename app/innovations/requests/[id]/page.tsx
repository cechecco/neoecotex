import RequestSkeleton from '@/components/innovations/requestSkeleton'
import { RequestView } from '@/components/innovations/requestView'
import { Suspense } from 'react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Eye, Pencil } from 'lucide-react'
import { innovations } from '@/lib/server/database'
import UserSubmissionCheck from '@/components/innovations/userSubmissionCheck'
import SubmissionButton from '@/components/innovations/submissionButton'
import OwnerCheck from '@/components/innovations/ownerCheck'

export const dynamic = 'force-dynamic'

interface Props {
  params: Promise<{
    id: string
  }>
}

export default async function InnovationRequestPage(props: Props) {
  const params = await props.params
  const userHasSubmitted = await innovations.userHasSubmitted(params.id)
  const thereIsWinner = await innovations.thereIsWinner(params.id)
  return (
    <main>
      <div className='flex flex-col md:flex-row gap-2 justify-between mb-4'>
        <p className='text-3xl font-bold'>Innovation Request</p>
        <div className='flex items-center justify-end gap-2'>
          <OwnerCheck requestId={params.id} />
          <UserSubmissionCheck userHasSubmitted={userHasSubmitted} />
          <SubmissionButton
            requestId={params.id}
            userHasSubmitted={userHasSubmitted}
          />
          <Button size='sm'>
            <Link
              href={`/innovations/requests/${params.id}/submissions`}
              className='flex items-center gap-2'
            >
              <Eye />
              View Submissions
            </Link>
          </Button>
          <Button
            size='sm'
            disabled={thereIsWinner}
          >
            <Link
              href={`/innovations/requests/${params.id}/edit`}
              className='flex items-center gap-2'
            >
              Edit
              <Pencil />
            </Link>
          </Button>
        </div>
      </div>
      <Suspense fallback={<RequestSkeleton />}>
        <RequestView id={params.id} />
      </Suspense>
    </main>
  )
}
