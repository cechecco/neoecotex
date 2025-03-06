'use client'

import { formatDistance } from 'date-fns'

import { Card as CardUI, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Request, RequestCheck } from '@/lib/types'

import StatusBadges from './statusBadges'

interface Props {
  request: Request
  check: RequestCheck
}

export default function Card({ request, check }: Props) {
  return (
    <CardUI className='h-full transition-all duration-300 flex flex-col justify-start'>
      <CardHeader>
        <CardTitle className='line-clamp-1'>{request.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className='line-clamp-2'>{request.briefDescription}</p>
      </CardContent>
      <CardFooter className='mt-auto flex flex-col gap-2'>
        <Separator className='my-2' />
        <div className='flex justify-between items-center w-full text-xs text-muted-foreground'>
          <p>Posted {formatDistance(new Date(request.$createdAt), new Date(), { addSuffix: true })}</p>
          <StatusBadges check={check} />
        </div>
      </CardFooter>
    </CardUI>
  )
}
