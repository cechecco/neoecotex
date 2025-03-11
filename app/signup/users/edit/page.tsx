import { Suspense } from 'react'

import Header from '@/components/innovations/requests/header' // Riutilizzato solo come esempio di header
import Skeleton from '@/components/innovations/requests/skeleton' // Riutilizzato solo come esempio di skeleton
import Form from '@/components/users/form'

interface Props {
  params: Promise<{ type: string }>
}

export default async function EditUserPage(props: Props) {
  const type = (await props.params).type
  return (
    <main>
      <Header title='User Editor' />
      <Suspense fallback={<Skeleton />}>
        <Form type={type} />
      </Suspense>
    </main>
  )
}
