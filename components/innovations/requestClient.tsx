'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { useInnovationRequest } from '@/contexts/InnovationRequestContext'
export function RequestViewClient() {
  const { request } = useInnovationRequest()

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>{request.title}</CardTitle>
        </CardHeader>
        <CardContent className='flex flex-col gap-4'>
          <div>
            <p className='text-xs italic text-muted-foreground'>Brief Description</p>
            <p className=''>{request.briefDescription}</p>
          </div>
          <div>
            <p className='text-xs italic text-muted-foreground'>Detailed Description</p>
            <p>{request.detailedDescription}</p>
          </div>
          <div>
            <p className='text-xs italic text-muted-foreground'>Expected Expertise</p>
            <p>{request.expectedExpertise}</p>
          </div>
          <div>
            <p className='text-xs italic text-muted-foreground'>Expected Timeline</p>
            <p>{request.expectedTimeline}</p>
          </div>
          <div>
            <p className='text-xs italic text-muted-foreground'>Company</p>
            <p>{request.company}</p>
          </div>
          <div>
            <p className='text-xs italic text-muted-foreground'>Budget</p>
            <p>{request.budget}</p>
          </div>
          <div>
            <p className='text-xs italic text-muted-foreground'>Concept</p>
            <p>{request.concept}</p>
          </div>
          <div>
            <p className='text-xs italic text-muted-foreground'>Field</p>
            <p>{request.field}</p>
          </div>
          <div>
            <p className='text-xs italic text-muted-foreground'>Marketing Consent</p>
            <p>{request.marketingConsent ? 'Yes' : 'No'}</p>
          </div>
          <div>
            <p className='text-xs italic text-muted-foreground'>Ecology Consent</p>
            <p>{request.ecologyConsent ? 'Yes' : 'No'}</p>
          </div>
          <div>
            <p className='text-xs italic text-muted-foreground'>Created At</p>
            <p>{request.$createdAt}</p>
          </div>
          <div>
            <p className='text-xs italic text-muted-foreground'>Updated At</p>
            <p>{request.$updatedAt}</p>
          </div>
          <div>
            <p className='text-xs italic text-muted-foreground'>ID</p>
            <p>{request.$id}</p>
          </div>
        </CardContent>
      </Card>
    </>
  )
}
