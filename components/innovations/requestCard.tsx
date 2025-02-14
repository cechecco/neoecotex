import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card'
import { Separator } from '../ui/separator'
import { formatDistance } from 'date-fns'
import Link from 'next/link'
import { CheckCircleIcon } from 'lucide-react'
import { InnovationRequest } from '@/lib/types'

export default function InnovationRequestCard({ request }: { request: InnovationRequest }) {
  return (
    <Link href={`/innovations/requests/${request.$id}`}>
      <Card className='h-full hover:translate-y-[-5px] hover:shadow-lg transition-all duration-300 flex flex-col justify-start'>
        <CardHeader>
          <CardTitle className='flex justify-between items-center'>
            <div>
              <p className='line-clamp-1'>{request.title}</p>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
            <p className='line-clamp-2'>{request.briefDescription}</p>
        </CardContent>
        <CardFooter className='w-full flex flex-col gap-2 mt-auto'>
          <Separator className='my-2' />
          <div className='flex justify-between items-center w-full'>
            <p className='text-xs text-muted-foreground'>Posted {formatDistance(new Date(request.$createdAt!), new Date(), { addSuffix: true })}</p>
            <p className='text-xs text-muted-foreground flex items-center gap-2 text-green-500'>
              Submitted <CheckCircleIcon className='w-4 h-4' />
            </p>
          </div>
        </CardFooter>
      </Card>
    </Link>
  )
}
