'use client'

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../ui/card'
import { Separator } from '../ui/separator'
import { formatDistance } from 'date-fns'
import UserSubmissionCheck from './userSubmissionCheck'
import WinnerEmailButton from './winnerEmailButton'
import { useState, useEffect } from 'react'
import { InnovationRequest } from '@/lib/types'
import { userHasSubmitted, thereIsWinner } from '@/app/actions/actions'

export default function InnovationRequestCard({ request }: { request: InnovationRequest }) {
  const [submitted, setSubmitted] = useState(false)
  const [won, setWon] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      const submitted = await userHasSubmitted(request.$id!)
      const winner = await thereIsWinner(request.$id!)
      setSubmitted(submitted)
      setWon(winner)
    }
    fetchData()
  }, [request.$id])

  return (
    <Card className={`h-full hover:translate-y-[-5px] hover:shadow-lg transition-all duration-300 flex flex-col justify-start ${won ? 'opacity-70' : ''}`}>
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
          <UserSubmissionCheck userHasSubmitted={submitted} />
          <WinnerEmailButton
            requestId={request.$id!}
            size='sm'
          />
        </div>
      </CardFooter>
    </Card>
  )
}
