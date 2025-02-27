'use client'

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../ui/card'
import { Separator } from '../ui/separator'
import { formatDistance } from 'date-fns'
import UserSubmissionCheck from './userSubmissionCheck'
import { InnovationRequest } from '@/lib/types'
import { RequestChecks } from '@/lib/server/database'

interface Props {
  request: InnovationRequest
  check: RequestChecks
}

export default function InnovationRequestCard({ request, check }: Props) {
  // if (!check) return null

  return (
    <Card className={`h-full hover:translate-y-[-5px] hover:shadow-lg transition-all duration-300 flex flex-col justify-start ${check.thereIsWinner ? 'opacity-70' : ''}`}>
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
          <p className='text-xs text-muted-foreground'>
            Posted {formatDistance(new Date(request.$createdAt!), new Date(), { addSuffix: true })}
          </p>
          <UserSubmissionCheck userHasSubmitted={check.iHaveSubmitted} />
          {check.thereIsWinner && (
            <div className='text-xs text-muted-foreground'>
              Winner Selected
            </div>
          )}
        </div>
      </CardFooter>
    </Card>
  )
}
