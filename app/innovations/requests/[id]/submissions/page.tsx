import Header from '@/components/innovations/Header'
import SubmissionsListServer from '@/components/innovations/submissions/submissionsListServer'
import SubmissionsListSkeleton from '@/components/innovations/submissions/submissionsListSkeleton'
import { Suspense } from 'react'

interface Props {
  params: Promise<{
    id: string
  }>
}

export default async function SubmissionsPage(props: Props) {
  const params = await props.params
  const requestId = params.id
  return (
    <main>
      <Header title='Submissions'>{requestId}</Header>
      <Suspense fallback={<SubmissionsListSkeleton />}>
        <SubmissionsListServer requestId={requestId} />
      </Suspense>
    </main>
  )
}
