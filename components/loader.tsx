import { Loader2 } from 'lucide-react'

export default function Loader() {
  return (
    <div className='fixed inset-0 bg-background/50 flex justify-center items-center z-50'>
      <Loader2 className='w-14 h-14 animate-spin text-secondary' />
    </div>
  )
}
