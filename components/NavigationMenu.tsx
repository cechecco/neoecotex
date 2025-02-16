import { getLoggedInUser } from '../app/signup/actions'
import ClientMenu from '@/components/clientMenu'

export default async function NavigationMenus() {
  const user = await getLoggedInUser()
  return <ClientMenu user={user} />
}
