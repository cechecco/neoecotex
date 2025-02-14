'use client'

import { DropdownMenuItem } from '@/components/ui/dropdown-menu'
import { signOut } from '@/app/actions'

export function LogoutMenuItem() {
  return (
    <DropdownMenuItem
      className='cursor-pointer'
      onSelect={async (event) => {
        event.preventDefault()
        await signOut()
      }}
    >
      Logout
    </DropdownMenuItem>
  )
}
