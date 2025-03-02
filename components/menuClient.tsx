'use client'

import { Menu } from 'lucide-react'
import { Models } from 'node-appwrite'
import React from 'react'
import { useMediaQuery } from 'react-responsive'

import LogoMenu from '@/components/logoMenu'
import SiteMenu from '@/components/siteMenu'
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet'

import UserMenu from './userMenu'

export default function MenuClient({ user }: { user: Models.User<Models.Preferences> | null }) {
  const isMobileOrTablet = useMediaQuery({ maxWidth: 768 })
  const [isMounted, setIsMounted] = React.useState(false)

  React.useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return null
  }

  return (
    <>
      {!isMobileOrTablet ? (
        <>
          <div className='flex justify-start'>
            <LogoMenu />
          </div>
          <div className='flex justify-center'>
            <SiteMenu />
          </div>
          <div className='flex justify-end'>
            <UserMenu user={user} />
          </div>
        </>
      ) : (
        <div className='flex w-full justify-end fixed top-0 right-0 z-10'>
          <Sheet>
            <SheetTrigger asChild>
              <Menu className='h-10 w-10 p-2 bg-white/50 backdrop-blur-xl rounded-lg m-2' />
            </SheetTrigger>
            <SheetContent side='left'>
              <SheetTitle>
                <LogoMenu />
              </SheetTitle>
              <div className='flex flex-col gap-4 mt-8'>
                <SiteMenu />
              </div>
              <UserMenu user={user} />
            </SheetContent>
          </Sheet>
        </div>
      )}
    </>
  )
}
