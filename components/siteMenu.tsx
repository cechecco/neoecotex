'use client'
import Link from 'next/link'
import * as React from 'react'

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
  return (
    <div>
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
