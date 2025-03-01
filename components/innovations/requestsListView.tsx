'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { listRequests, getRequestsChecks } from '@/app/actions/actions'
import { useStore } from '@/contexts/store'
import Loader from '@/components/loader'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import { RequestCard } from '@/components/innovations/requestCard'
import Link from 'next/link'

export default function RequestsListView() {
  const {
    requestsPages,
    checksPages,
    setRequestsPages,
    setChecksPages,
    currentPage,
    setCurrentPage,
  } = useStore()

  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const itemsPerPage = 3

  const currentRequests = requestsPages[currentPage] || []
  const currentChecks = checksPages[currentPage] || {}

  async function handlePageChange(nextPage: number) {
    if (nextPage < 1) return
    setIsLoading(true)
    try {
      // Se abbiamo già la pagina in cache, basta settare la currentPage
      if (requestsPages[nextPage]) {
        setCurrentPage(nextPage)
        return
      }

      // Se non c'è in cache, facciamo fetch
      const res = await listRequests(nextPage, itemsPerPage)
      if ('error' in res) {
        throw new Error(res.message)
      }
      const { documents } = res
      if (!documents) return

      const ids = documents.map((d: any) => d.$id)
      const newChecks = await getRequestsChecks(ids)

      // Aggiorniamo la cache
      setRequestsPages((prev) => ({
        ...prev,
        [nextPage]: documents,
      }))
      setChecksPages((prev) => ({
        ...prev,
        [nextPage]: newChecks,
      }))

      setCurrentPage(nextPage)
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full h-full flex flex-col gap-4">
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
              className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
            />
          </PaginationItem>
          <PaginationItem>
            <span className="p-2">{currentPage}</span>
          </PaginationItem>
          <PaginationItem>
            <PaginationNext
              onClick={() => handlePageChange(currentPage + 1)}
              className={
                currentRequests.length < itemsPerPage
                  ? 'pointer-events-none opacity-50'
                  : 'cursor-pointer'
              }
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>

      {isLoading && <Loader />}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {currentRequests.map((req) => {
          const check = currentChecks[req.$id] || {}
          return (
            <Link
              key={req.$id}
              href={`requests/${req.$id}`}
              className="cursor-pointer"
            >
              <RequestCard request={req} check={check} />
            </Link>
          )
        })}
      </div>
    </div>
  )
}
