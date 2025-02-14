import Image from 'next/image'
import Link from 'next/link'

const LogoMenu = () => {
  return (
    <Link href={'/'}>
      <div className='cursor-pointer hover:opacity-80 transition-opacity'>
        <Image
          src={'/logo.svg'}
          alt={'logo'}
          width={150}
          height={50}
          priority
        />
      </div>
    </Link>
  )
}

export default LogoMenu
