'use client'

import RequestCard from '@/components/innovations/requestCard'
import { InnovationRequest } from '@/lib/types'
import { useState } from 'react'
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination'
import { getInnovationRequests } from '@/app/actions/actions'

export default function RequestListClient({ innovationRequests }: { innovationRequests: InnovationRequest[] }) {
  const [currentPage, setCurrentPage] = useState(1)
  const [currentItems, setCurrentItems] = useState<InnovationRequest[]>(innovationRequests)
  const itemsPerPage = 6 // 3x3 grid

  const handlePageChange = async (page: number) => {
    const response = await getInnovationRequests({ page, limit: itemsPerPage })
    if ('error' in response) {
      console.error(response.message)
    } else {
      const requests = response.documents as unknown as InnovationRequest[]
      setCurrentItems(requests)
      setCurrentPage(page)
    }
  }

  return (
    <div>
      <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-4'>
        {currentItems.map((request: unknown, index: number) => (
          <RequestCard
            key={index}
            request={request as InnovationRequest}
          />
        ))}
      </div>

      <div className='mt-8'>
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => handlePageChange(currentPage - 1)}
                aria-disabled={currentPage === 1}
              />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink isActive>{currentPage}</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationNext onClick={() => handlePageChange(currentPage + 1)} />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  )
}
