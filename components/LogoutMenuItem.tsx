import { DropdownMenuItem } from '@/components/ui/dropdown-menu'
import { signOut } from '@/app/signup/actions'

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
