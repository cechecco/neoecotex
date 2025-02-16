import { Skeleton } from '@/components/ui/skeleton'

export default function InnovationsLoading() {
  return (
    <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-4'>
      {[...Array(10)].map((_, index) => (
        <Skeleton
          key={index}
          className='h-48'
        />
      ))}
    </div>
  )
}
