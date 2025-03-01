import type { Metadata } from 'next'
import { Albert_Sans } from 'next/font/google'
import './globals.css'
import { Mail, Linkedin } from 'lucide-react'
import { Button } from '@/components/ui/button'
import MenuServer from '@/components/menuServer'
import { StoreProvider } from '@/contexts/store'
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
      <body className={`${albertSans.variable} relative antialiased bg-gradient-to-b from-violet-500 to-fuchsia-500 h-full flex flex-col`}>
        <StoreProvider>
          <div className='h-5 md:h-16'>
            <MenuServer />
          </div>
          <div className='min-h-screen'>{children}</div>
          <footer className='w-full bg-black/30 backdrop-blur-xl'>
            <div className='max-w-screen-lg mx-auto p-4 text-center'>
              <div className='flex items-center justify-center gap-4'>
                <Button
                  variant='ghost'
                  size='icon'
                  asChild
                >
                  <a
                    href='https://www.linkedin.com/company/neoecotex_01'
                    target='_blank'
                    rel='noopener noreferrer'
                    className='hover:text-violet-300 transition-colors'
                  >
                    <Linkedin className='h-5 w-5' />
                  </a>
                </Button>
                <Button
                  variant='ghost'
                  size='icon'
                  asChild
                >
                  <a
                    href='mailto:neoecotex@gmail.com'
                    className='hover:text-violet-300 transition-colors'
                  >
                    <Mail className='h-5 w-5' />
                  </a>
                </Button>
              </div>
            </div>
          </footer>
        </StoreProvider>
      </body>
    </html>
  )
}
