'use client'

import { useEffect } from 'react'
import { Request, RequestChecksMap } from '@/lib/types'
import { useStore } from '@/contexts/store'
import RequestsListView from './requestsListView'

interface RequestsListClientProps {
  pageNumber: number
  requestsPage: Request[]
  checksPage: RequestChecksMap
}

export default function RequestsListClient({ pageNumber, requestsPage, checksPage }: RequestsListClientProps) {
  const { setRequestsPages, setChecksPages, setCurrentPage } = useStore()

  useEffect(() => {
    setRequestsPages((prev) => ({ ...prev, [pageNumber]: requestsPage }))
    setChecksPages((prev) => ({ ...prev, [pageNumber]: checksPage }))
    setCurrentPage(pageNumber)
  }, [pageNumber, requestsPage, checksPage, setRequestsPages, setChecksPages, setCurrentPage])

  return <RequestsListView />
}
