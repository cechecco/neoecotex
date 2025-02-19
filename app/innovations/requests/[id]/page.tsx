import RequestSkeleton from '@/components/innovations/requestSkeleton'
import { RequestView } from '@/components/innovations/requestView'
import { Suspense } from 'react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Eye, Pencil, Plus } from 'lucide-react'

interface Props {
  params: Promise<{
    id: string
  }>
}

export default async function InnovationRequestPage(props: Props) {
  const params = await props.params
  return (
    <main>
      <div className='flex flex-col md:flex-row gap-2 justify-between mb-4'>
        <p className='text-3xl font-bold'>Innovation Request</p>
        <div className='flex items-center justify-end gap-2'>
          <Button size='sm'>
            <Link
              href={`/innovations/requests/${params.id}/submissions/new/edit`}
              className='flex items-center gap-2'
            >
              <Plus />
              Submit Solution
            </Link>
          </Button>
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
              href={`/innovations/requests/${params.id}/edit`}
              className='flex items-center gap-2'
            >
              <Pencil /> Edit
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
