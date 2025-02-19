import { getLoggedInUser } from '@/app/actions/auth'
import MenuClient from '@/components/menuClient'

export default async function MenuServer() {
  const user = await getLoggedInUser()
  return (
    <div className='w-full sticky top-0 z-10 md:grid md:grid-cols-3 md:items-center md:p-4 md:backdrop-blur-xl'>
      <MenuClient user={user} />
    </div>
  )
}
