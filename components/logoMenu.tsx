import Image from 'next/image'
import Link from 'next/link'

const LogoMenu = () => {
  return (
    <div className='cursor-pointer hover:opacity-80 transition-opacity'>
      <Link href={'/'}>
        <Image
          src={'/logo.svg'}
          alt={'logo'}
          width={150}
          height={50}
          priority
        />
      </Link>
    </div>
  )
}

export default LogoMenu
