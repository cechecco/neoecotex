'use client'
import Link from 'next/link'
import * as React from 'react'
import { useEffect, useState } from 'react'

import { Button } from '@/components/ui/button'
import { Drawer, DrawerClose, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer'
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger, navigationMenuTriggerStyle } from '@/components/ui/navigation-menu'
import { cn } from '@/lib/utils'

const menuItems = [
  {
    label: 'Services',
    type: 'dropdown',
    items: [
      {
        label: 'Blog',
        href: '/blog',
        description: 'Read our latest articles and updates',
      },
      {
        label: 'Innovation Hub',
        href: '/innovations/requests',
        description: 'Submit and track your innovation ideas',
      },
      {
        label: 'Generative AI',
        href: '/ai',
        description: 'Explore our cutting-edge AI solutions',
      },
    ],
  },
  { label: 'Pricing', href: '/pricing' },
  { label: 'About us', href: '/about' },
]

export default function SiteMenu() {
  const [isMobile, setIsMobile] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)

  useEffect(() => {
    // Function to check if viewport is mobile sized
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768) // 768px is a common mobile breakpoint
    }

    // Check on initial render
    checkIfMobile()

    // Add event listener for window resize
    window.addEventListener('resize', checkIfMobile)

    // Clean up
    return () => window.removeEventListener('resize', checkIfMobile)
  }, [])

  return (
    <div>
      {isMobile ? (
        // Mobile view - side drawer
        <Drawer
          open={drawerOpen}
          onOpenChange={setDrawerOpen}
        >
          <DrawerTrigger asChild>
            <Button variant='outline'>MENU</Button>
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>Menu</DrawerTitle>
            </DrawerHeader>
            <div className='p-4'>
              <ul className='space-y-4'>
                {menuItems.map((item) =>
                  item.type === 'dropdown' ? (
                    // For dropdown items, list their subitems
                    <React.Fragment key={item.label}>
                      <li className='font-medium text-sm py-2'>{item.label.toUpperCase()}</li>
                      {item.items.map((subItem) => (
                        <DrawerClose
                          key={subItem.href}
                          asChild
                        >
                          <Link
                            href={subItem.href}
                            className='block p-2 hover:bg-accent rounded-md'
                          >
                            <div className='text-sm font-medium'>{subItem.label}</div>
                            <p className='text-xs text-muted-foreground'>{subItem.description}</p>
                          </Link>
                        </DrawerClose>
                      ))}
                    </React.Fragment>
                  ) : (
                    // For regular items, just list them directly
                    <li key={item.label}>
                      <DrawerClose asChild>
                        <Link
                          href={item.href ?? ''}
                          className='block p-2 hover:bg-accent rounded-md'
                        >
                          {item.label.toUpperCase()}
                        </Link>
                      </DrawerClose>
                    </li>
                  )
                )}
              </ul>
            </div>
          </DrawerContent>
        </Drawer>
      ) : (
        // Desktop view - original menu structure
        <NavigationMenu className='flex flex-row justify-around'>
          <NavigationMenuList className='flex flex-row justify-around gap-4'>
            {menuItems.map((item) =>
              item.type === 'dropdown' ? (
                <NavigationMenuItem key={item.label}>
                  <NavigationMenuTrigger>{item.label.toUpperCase()}</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className='grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]'>
                      {item.items.map((subItem) => (
                        <ListItem
                          key={subItem.href}
                          title={subItem.label}
                          href={subItem.href}
                        >
                          {subItem.description}
                        </ListItem>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              ) : (
                <NavigationMenuItem key={item.label}>
                  <Link
                    href={item.href ?? ''}
                    legacyBehavior
                    passHref
                  >
                    <NavigationMenuLink className={navigationMenuTriggerStyle()}>{item.label.toUpperCase()}</NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              )
            )}
          </NavigationMenuList>
        </NavigationMenu>
      )}
    </div>
  )
}

const ListItem = React.forwardRef<React.ElementRef<'a'>, React.ComponentPropsWithoutRef<'a'> & { title: string }>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            'block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground',
            className
          )}
          {...props}
        >
          <div className='text-sm font-medium leading-none'>{title}</div>
          <p className='line-clamp-2 text-sm leading-snug text-muted-foreground'>{children}</p>
        </a>
      </NavigationMenuLink>
    </li>
  )
})
ListItem.displayName = 'ListItem'
