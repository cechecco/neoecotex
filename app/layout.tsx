import { Mail, Linkedin, Twitter, Instagram, Youtube } from 'lucide-react'
import type { Metadata } from 'next'
import { Albert_Sans } from 'next/font/google'
import Link from 'next/link'

import MenuServer from '@/components/menuServer'
import { StoreProvider } from '@/contexts/store'
import './globals.css'

const albertSans = Albert_Sans({
  variable: '--font-albert-sans',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='en'>
      <body className={`${albertSans.variable} relative antialiased h-full flex flex-col`}>
        <StoreProvider>
          <div className='sticky top-0 z-50 mb-2'>
            <MenuServer />
          </div>
          <div className='min-h-screen'>{children}</div>
          <footer className='w-full bg-white border-t'>
            <div className='max-w-screen-lg mx-auto p-6'>
              <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
                {/* Company Info Column */}
                <div className='space-y-4'>
                  <div className='flex items-center gap-2'>
                    <div className='w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center'>
                      <span className='text-purple-500 font-bold'>n</span>
                    </div>
                    <span className='font-semibold text-xl'>neoecotex</span>
                  </div>

                  <p className='text-sm text-gray-600'>Transform the fashion and textile industry for the better through open innovation.</p>

                  <div className='flex items-center gap-2'>
                    <Mail className='h-4 w-4 text-gray-600' />
                    <a
                      href='mailto:connect@neoecotex.com'
                      className='text-sm text-gray-600 hover:text-purple-600'
                    >
                      connect@neoecotex.com
                    </a>
                  </div>

                  <div className='flex gap-2'>
                    <a
                      href='https://www.linkedin.com/company/neoecotex_01'
                      target='_blank'
                      rel='noopener noreferrer'
                      className='text-purple-500 hover:text-purple-700'
                    >
                      <Linkedin className='h-5 w-5' />
                    </a>
                    <a
                      href='#'
                      target='_blank'
                      rel='noopener noreferrer'
                      className='text-purple-500 hover:text-purple-700'
                    >
                      <Twitter className='h-5 w-5' />
                    </a>
                    <a
                      href='#'
                      target='_blank'
                      rel='noopener noreferrer'
                      className='text-purple-500 hover:text-purple-700'
                    >
                      <Instagram className='h-5 w-5' />
                    </a>
                    <a
                      href='#'
                      target='_blank'
                      rel='noopener noreferrer'
                      className='text-purple-500 hover:text-purple-700'
                    >
                      <Youtube className='h-5 w-5' />
                    </a>
                  </div>
                </div>

                {/* Platform Links Column */}
                <div className='space-y-4'>
                  <h3 className='font-semibold text-lg'>Platform</h3>
                  <ul className='space-y-2'>
                    <li>
                      <Link href='/'>
                        <span className='text-gray-600 hover:text-purple-600'>Home</span>
                      </Link>
                    </li>
                    <li>
                      <Link href='/how-it-works'>
                        <span className='text-gray-600 hover:text-purple-600'>How it works?</span>
                      </Link>
                    </li>
                    <li>
                      <Link href='/about'>
                        <span className='text-gray-600 hover:text-purple-600'>About</span>
                      </Link>
                    </li>
                    <li>
                      <Link href='/contact'>
                        <span className='text-gray-600 hover:text-purple-600'>Contact</span>
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Bottom footer */}
              <div className='mt-8 pt-4 border-t flex flex-col md:flex-row justify-between items-center'>
                <p className='text-sm text-gray-500'>© 2023 All rights reserved.</p>
                <div className='flex gap-4 mt-3 md:mt-0'>
                  <Link href='/terms'>
                    <span className='text-sm text-gray-500 hover:text-purple-600'>Terms of Use</span>
                  </Link>
                  <Link href='/privacy'>
                    <span className='text-sm text-gray-500 hover:text-purple-600'>Privacy Policy</span>
                  </Link>
                  <Link href='/cookies'>
                    <span className='text-sm text-gray-500 hover:text-purple-600'>Cookie Policy</span>
                  </Link>
                </div>
              </div>
            </div>
          </footer>
        </StoreProvider>
      </body>
    </html>
  )
}
