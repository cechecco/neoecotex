import React from 'react'

interface HeaderProps {
  title: string
  children: React.ReactNode
}

const Header: React.FC<HeaderProps> = ({ title, children }) => {
  return (
    <div className='flex flex-col md:flex-row md:justify-between items-center gap-4 mb-4'>
      <p className='text-3xl font-bold'>{title}</p>
      <div className='flex flex-col md:flex-row items-stretch justify-center md:justify-end gap-2 w-full md:w-auto'>{children}</div>
    </div>
  )
}

export default Header
