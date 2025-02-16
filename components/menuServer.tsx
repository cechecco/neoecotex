import { getLoggedInUser } from '@/app/actions/auth'
import MenuClient from '@/components/menuClient'

export default async function MenuServer() {
  const user = await getLoggedInUser()
  return <div className='w-full sticky top-0 z-10 grid grid-cols-3 items-center p-4 backdrop-blur-xl h-20'>
    <MenuClient user={user} />
  </div>
}
