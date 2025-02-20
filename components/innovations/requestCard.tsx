import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../ui/card'
import { Separator } from '../ui/separator'
import { formatDistance } from 'date-fns'
import Link from 'next/link'
import { InnovationRequest } from '@/lib/types'
import UserSubmissionCheck from './userSubmissionCheck'
import { innovations } from '@/lib/server/database'
import WinnerEmailButton from './winnerEmailButton'

export default async function InnovationRequestCard({ request }: { request: InnovationRequest }) {
  const userHasSubmitted = await innovations.userHasSubmitted(request.$id)
  const thereIsWinner = await innovations.thereIsWinner(request.$id!)
  return (
    <Link href={`/innovations/requests/${request.$id}`}>
      <Card className={`h-full hover:translate-y-[-5px] hover:shadow-lg transition-all duration-300 flex flex-col justify-start ${thereIsWinner ? 'opacity-70' : ''}`}>
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
            <UserSubmissionCheck userHasSubmitted={userHasSubmitted} />
            <WinnerEmailButton
              requestId={request.$id!}
              size='sm'
            />
          </div>
        </CardFooter>
      </Card>
    </Link>
  )
}
