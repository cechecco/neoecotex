'use client'

import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'

import Loader from '@/components/loader'

interface LoadingLinkProps {
  href: string
  children: React.ReactNode
  className?: string
}

export default function LoadingLink({ href, children, className }: LoadingLinkProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [isLoading, setIsLoading] = useState(false)
  const [navigatingTo, setNavigatingTo] = useState<string | null>(null)

  // Reset loading state when pathname changes
  useEffect(() => {
    if (isLoading && navigatingTo && pathname === navigatingTo) {
      setIsLoading(false)
      setNavigatingTo(null)
    }
  }, [pathname, isLoading, navigatingTo])

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setNavigatingTo(href)
    router.push(href)
  }

  return (
    <>
      {isLoading && <Loader />}
      <Link
        href={href}
        onClick={handleClick}
        className={className}
      >
        {children}
      </Link>
    </>
  )
}
