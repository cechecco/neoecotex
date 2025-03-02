'use client'

import Link from 'next/link'
import { useState } from 'react'

import { listRequests, getRequestsChecks } from '@/app/actions/innovations'
import Card from '@/components/innovations/requests/card'
import Loader from '@/components/loader'
import { Pagination, PaginationContent, PaginationItem, PaginationNext, PaginationPrevious } from '@/components/ui/pagination'
import { useStore } from '@/contexts/store'

export default function ListView() {
  const { requestsPages, checksPages, setRequestsPages, setChecksPages, currentPage, setCurrentPage } = useStore()

  const [isLoading, setIsLoading] = useState(false)
  const itemsPerPage = 3

  const currentRequests = requestsPages[currentPage] || []
  const currentChecks = checksPages[currentPage] || {}

  async function handlePageChange(nextPage: number) {
    if (nextPage < 1) return
    setIsLoading(true)
    try {
      if (requestsPages[nextPage]) {
        setCurrentPage(nextPage)
        return
      }

      const res = await listRequests(nextPage, itemsPerPage)
      if ('error' in res) {
        throw new Error(res.message)
      }
      const { documents } = res
      if (!documents) return

      const ids = documents.map((d) => d.$id)
      const newChecks = await getRequestsChecks(ids)

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
    <div className='w-full h-full flex flex-col gap-4'>
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
              className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
            />
          </PaginationItem>
          <PaginationItem>
            <span className='p-2'>{currentPage}</span>
          </PaginationItem>
          <PaginationItem>
            <PaginationNext
              onClick={() => handlePageChange(currentPage + 1)}
              className={currentRequests.length < itemsPerPage ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>

      {isLoading && <Loader />}

      <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-4'>
        {currentRequests.map((req) => {
          const check = currentChecks[req.$id] || {}
          return (
            <Link
              key={req.$id}
              href={`requests/${req.$id}`}
              className='cursor-pointer'
            >
              <Card
                request={req}
                check={check}
              />
            </Link>
          )
        })}
      </div>
    </div>
  )
}
