'use client'

import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Menu } from 'lucide-react'
import SiteMenu from '@/components/siteMenu'
import LogoMenu from '@/components/logoMenu'
import { useMediaQuery } from 'react-responsive'
import { Models } from 'node-appwrite'
import UserMenu from './userMenu'
export default function ClientMenu({ user }: { user: Models.User<Models.Preferences> | null }) {
  const isMobileOrTablet = useMediaQuery({ maxWidth: 768 })
  return (
    <>
      {!isMobileOrTablet ? (
        <div className='sticky top-0 z-10 grid grid-cols-3 items-center p-4 backdrop-blur-xl'>
          <div className='flex justify-start'>
            <LogoMenu />
          </div>
          <div className='flex justify-center'>
            <SiteMenu />
          </div>
          <div className='flex justify-end'>
            <UserMenu user={user} />
          </div>
        </div>
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
              <SheetTitle>Navigation Menu</SheetTitle>
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
