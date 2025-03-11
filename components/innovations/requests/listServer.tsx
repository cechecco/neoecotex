import { listRequests, getRequestsChecks } from '@/app/actions/innovations'
import ListClient from '@/components/innovations/requests/listClient'

export default async function ListServer({ filterField, filterValue }: { filterField: string; filterValue: string | number | boolean }) {
  try {
    const result = await listRequests(1, 6, filterField, filterValue)
    if ('error' in result) {
      throw new Error(result.message)
    }

    const { documents } = result
    if (!documents || !documents.length) {
      return <div className='text-sm text-muted-foreground'>No requests found.</div>
    }

    const requestIds = documents.map((r) => r.$id)
    const checks = await getRequestsChecks(requestIds)

    return (
      <ListClient
        pageNumber={1}
        requestsPage={documents}
        checksPage={checks}
        filterField={filterField}
        filterValue={filterValue}
      />
    )
  } catch (error) {
    return (
      <div className='text-red-500'>
        <h1>Errore durante il caricamento</h1>
        <p>{String(error)}</p>
      </div>
    )
  }
}
