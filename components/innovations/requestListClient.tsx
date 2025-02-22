'use client'

import RequestCard from '@/components/innovations/requestCard'
import { InnovationRequest } from '@/lib/types'
import { useState } from 'react'
import { Pagination, PaginationContent, PaginationItem, PaginationNext, PaginationPrevious } from '@/components/ui/pagination'
import { getInnovationRequests } from '@/app/actions/actions'
import { useRouter } from 'next/navigation'
import Loader from '../loader'

export default function RequestListClient({ innovationRequests }: { innovationRequests: InnovationRequest[] }) {
  const [currentPage, setCurrentPage] = useState(1)
  const [currentItems, setCurrentItems] = useState<InnovationRequest[]>(innovationRequests)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const itemsPerPage = 6 // 3x3 grid

  const handlePageChange = async (page: number) => {
    setIsLoading(true)
    const response = await getInnovationRequests({ page, limit: itemsPerPage })
    if ('error' in response) {
      console.error(response.message)
    } else {
      const requests = response.documents as unknown as InnovationRequest[]
      setCurrentItems(requests)
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
        {currentItems.map((request: InnovationRequest) => (
          <div
            key={request.$id}
            onClick={() => request.$id && handleCardClick(request.$id)}
            className='cursor-pointer'
          >
            <RequestCard request={request} />
          </div>
        ))}
      </div>
    </div>
  )
}
