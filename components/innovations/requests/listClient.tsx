'use client'

import { useEffect } from 'react'

import ListView from '@/components/innovations/requests/listView'
import { useStore } from '@/contexts/store'
import { Request, RequestChecksMap } from '@/lib/types'

interface RequestsListClientProps {
  pageNumber: number
  requestsPage: Request[]
  checksPage: RequestChecksMap
  filterField: string
  filterValue: string | number | boolean
}

export default function ListClient({ pageNumber, requestsPage, checksPage, filterField, filterValue }: RequestsListClientProps) {
  const { setRequestsPages, setChecksPages, setCurrentPage } = useStore()

  useEffect(() => {
    setRequestsPages((prev) => ({ ...prev, [pageNumber]: requestsPage }))
    setChecksPages((prev) => ({ ...prev, [pageNumber]: checksPage }))
    setCurrentPage(pageNumber)
  }, [pageNumber, requestsPage, checksPage, setRequestsPages, setChecksPages, setCurrentPage])

  return (
    <ListView
      filterField={filterField}
      filterValue={filterValue}
    />
  )
}
