'use client'

import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Menu } from 'lucide-react'
import SiteMenu from '@/components/siteMenu'
import LogoMenu from '@/components/logoMenu'
import { useMediaQuery } from 'react-responsive'
import { Models } from 'node-appwrite'
import UserMenu from './userMenu'
import React from 'react'

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
        <div className='flex justify-end gap-4'>
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant='ghost'
                size='icon'
              >
                <Menu className='h-5 w-5' />
              </Button>
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
