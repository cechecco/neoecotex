import { getLoggedInUser } from '../app/actions/auth'
import MenuClient from '@/components/menuClient'

export default async function MenuServer() {
  const user = await getLoggedInUser()
  return <MenuClient user={user} />
}
