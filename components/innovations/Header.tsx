import React from 'react'

interface HeaderProps {
  title: string
  children: React.ReactNode
}

const Header: React.FC<HeaderProps> = ({ title, children }) => {
  return (
    <div className='flex justify-between items-center mb-4'>
      <p className='text-3xl font-bold'>{title}</p>
      <div className='flex items-center justify-end gap-2'>{children}</div>
    </div>
  )
}

export default Header
