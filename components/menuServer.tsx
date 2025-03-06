import { getLoggedInUser } from '@/app/actions/auth'

// import MenuClient from '@/components/menuClient'
import LogoMenu from './logoMenu'
import SiteMenu from './siteMenu'
import UserMenu from './userMenu'

export default async function MenuServer() {
  const user = await getLoggedInUser()
  return (
    <div className='w-full grid grid-cols-3 items-center sticky top-0 z-10 backdrop-blur-xl h-16'>
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
  )
}
