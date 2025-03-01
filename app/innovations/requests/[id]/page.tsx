import RequestSkeleton from '@/components/innovations/requestSkeleton'
import RequestViewServer from '@/components/innovations/requestView'
import { Suspense } from 'react'
import SubmitSolutionButton from '@/components/innovations/submissionButton'
import { getRequestCheck } from '@/app/actions/actions'
import SubmissionStatusBadge from '@/components/innovations/userSubmissionCheck'
import RequestOwnerBadge from '@/components/innovations/ownerCheck'
import ViewSubmissionsButton from '@/components/innovations/viewSubmissionsButton'
import EditRequestButton from '@/components/innovations/editRequestButton'

export const dynamic = 'force-dynamic'

interface Props {
  params: Promise<{
    id: string
  }>
}

export default async function InnovationRequestPage(props: Props) {
  const params = await props.params
  const check = await getRequestCheck(params.id) // TODO: handle error

  return (
    <main>
      <div className='flex flex-col md:flex-row gap-2 justify-between mb-4'>
        <p className='text-3xl font-bold'>Innovation Request</p>
        <div className='flex items-center justify-end gap-2'>
          <RequestOwnerBadge check={check} />
          <SubmissionStatusBadge check={check} />
          <SubmitSolutionButton check={check} />
          <ViewSubmissionsButton requestId={params.id} />
          <EditRequestButton requestId={params.id} check={check} />
        </div>
      </div>
      <Suspense fallback={<RequestSkeleton />}>
        <RequestViewServer id={params.id} />
      </Suspense>
    </main>
  )
}
