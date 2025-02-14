import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <main className='flex flex-col items-center justify-center h-screen'>
      <h1 className='text-4xl font-bold'>404 - Page not found</h1>
      <p className='text-lg'>The page you are looking for does not exist.</p>
      <Button>
        <Link href='/'>Go back to the home page</Link>
      </Button>
    </main>
  )
}
