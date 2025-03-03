'use client'

import { House } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect, useRef } from 'react'

import { getOneRequest, getOneSubmission } from '@/app/actions/innovations'
import { Breadcrumb as BreadcrumbComponent, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb'
import { Skeleton } from '@/components/ui/skeleton'

export default function Breadcrumb() {
  const pathname = usePathname()
  const [requestTitle, setRequestTitle] = useState('')
  const [submissionTitle, setSubmissionTitle] = useState('')
  const [isLoadingRequest, setIsLoadingRequest] = useState(false)
  const [isLoadingSubmission, setIsLoadingSubmission] = useState(false)

  // Store previous IDs to avoid unnecessary fetches
  const prevRequestId = useRef<string | null>(null)
  const prevSubmissionId = useRef<string | null>(null)

  useEffect(() => {
    // Extract IDs from pathname inside the useEffect
    const id = pathname?.match(/\/innovations\/requests\/([^\/]+)/)?.[1]
    const submissionId = pathname?.match(/\/innovations\/requests\/([^\/]+)\/submissions\/([^\/]+)/)?.[2]

    // Fetch request data if ID is available and changed
    if (id && id !== prevRequestId.current) {
      setIsLoadingRequest(true)
      prevRequestId.current = id

      const fetchRequest = async () => {
        try {
          const request = await getOneRequest(id)
          if (request && !('error' in request)) {
            setRequestTitle(request.title)
          }
        } catch (error) {
          console.error('Error fetching request:', error)
        } finally {
          setIsLoadingRequest(false)
        }
      }
      fetchRequest()
    } else if (!id) {
      // Reset if no ID
      setRequestTitle('')
      prevRequestId.current = null
    }

    // Fetch submission data if ID is available and changed
    if (submissionId && submissionId !== prevSubmissionId.current) {
      setIsLoadingSubmission(true)
      prevSubmissionId.current = submissionId

      const fetchSubmission = async () => {
        try {
          const submission = await getOneSubmission(submissionId)
          if (submission && !('error' in submission)) {
            setSubmissionTitle(submission.title)
          }
        } catch (error) {
          console.error('Error fetching submission:', error)
        } finally {
          setIsLoadingSubmission(false)
        }
      }
      fetchSubmission()
    } else if (!submissionId) {
      // Reset if no ID
      setSubmissionTitle('')
      prevSubmissionId.current = null
    }
  }, [pathname])

  // Extract IDs for rendering conditions
  const id = pathname?.match(/\/innovations\/requests\/([^\/]+)/)?.[1]
  const dashboard = pathname?.match(/\/innovations\/requests\/dashboard/)
  const submissionId = pathname?.match(/\/innovations\/requests\/([^\/]+)\/submissions\/([^\/]+)/)?.[2]

  return (
    <BreadcrumbComponent>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link
              href='/innovations/requests'
              className='flex items-center gap-1'
            >
              <House className='w-3 h-3 text-foreground' />
              <span className='text-foreground'>Innovation Hub</span>
            </Link>
          </BreadcrumbLink>
        </BreadcrumbItem>

        {id && !dashboard && (
          <>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link
                  href={`/innovations/requests/${id}`}
                  className='flex items-center gap-1'
                >
                  {isLoadingRequest ? <Skeleton className='h-4 w-[120px] md:w-[150px]' /> : <span className='hidden md:inline text-foreground max-w-[150px] truncate'>{requestTitle}</span>}
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
          </>
        )}

        {submissionId && (
          <>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className='flex items-center gap-1'>
                {isLoadingSubmission ? <Skeleton className='h-4 w-[120px] md:w-[150px]' /> : <span className='hidden md:inline text-foreground max-w-[150px] truncate'>{submissionTitle}</span>}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </>
        )}

        {dashboard && (
          <>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className='flex items-center'>Dashboard</BreadcrumbPage>
            </BreadcrumbItem>
          </>
        )}
      </BreadcrumbList>
    </BreadcrumbComponent>
  )
}
