// Questa pagina mostra i dettagli di un utente con ID corrispondente
// e utilizza un componente server per recuperare i dati e un client component per mostrarli.

import { Suspense } from 'react'

import Header from '@/components/innovations/requests/header' // Riutilizzato a scopo di esempio
import Skeleton from '@/components/innovations/requests/skeleton' // Riutilizzato a scopo di esempio
import ViewServer from '@/components/users/viewServer'

type Props = {
  searchParams: Promise<{ type: string }>
}

export default async function UserPage(props: Props) {
  const type = (await props.searchParams).type

  return (
    <main>
      <Header title='User Details' />
      <Suspense fallback={<Skeleton />}>
        <ViewServer type={type} />
      </Suspense>
    </main>
  )
}
