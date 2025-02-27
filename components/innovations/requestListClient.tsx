'use client'

import RequestCard from '@/components/innovations/requestCard'
import { InnovationRequest } from '@/lib/types'
import { useState } from 'react'
import { Pagination, PaginationContent, PaginationItem, PaginationNext, PaginationPrevious } from '@/components/ui/pagination'
import { getInnovationRequests } from '@/app/actions/actions'
import { useRouter } from 'next/navigation'
import Loader from '../loader'
import { getRequestsChecks } from '@/app/actions/actions'
import { RequestChecksMap } from '@/lib/server/database'

interface Props {
  innovationRequests: InnovationRequest[]
  checks: RequestChecksMap
}

export default function RequestListClient({ innovationRequests, checks }: Props) {
  const [currentPage, setCurrentPage] = useState(1)
  const [currentItems, setCurrentItems] = useState(innovationRequests)
  const [currentChecks, setCurrentChecks] = useState(checks)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const itemsPerPage = 3 // 3x3 grid

  const handlePageChange = async (page: number) => {
    setIsLoading(true)
    const response = await getInnovationRequests({ page, limit: itemsPerPage })
    if ('error' in response) {
      console.error(response.message)
    } else {
      const requests = response.documents as unknown as InnovationRequest[]
      // Get the IDs and fetch the checks
      const requestIds = requests.map((doc) => doc.$id!).filter(Boolean)
      const newChecks = await getRequestsChecks(requestIds)
      setCurrentItems(requests)
      setCurrentChecks(newChecks)
      setCurrentPage(page)
    }
    setIsLoading(false)
  }

  const handleCardClick = async (requestId: string) => {
    setIsLoading(true)
    router.push(`/innovations/requests/${requestId}`)
  }

  return (
    <div className='w-full h-full flex flex-col gap-4'>
      <div>
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
                className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                aria-disabled={currentPage === 1}
              />
            </PaginationItem>
            <PaginationItem className='p-4'>{currentPage}</PaginationItem>
            <PaginationItem>
              <PaginationNext
                onClick={() => handlePageChange(currentPage + 1)}
                className={currentItems.length < itemsPerPage ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                aria-disabled={currentItems.length < itemsPerPage}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
      {isLoading && <Loader />}
      <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-4'>
        {currentItems.map((req) => {
          const requestId = req.$id!
          const check = currentChecks[requestId]
          return (
            <div
              key={req.$id}
              onClick={() => requestId && handleCardClick(requestId)}
              className='cursor-pointer'
            >
              <RequestCard request={req} check={check} />
            </div>
          )
        })}
      </div>
    </div>
  )
}
