'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Submission } from '@/lib/types'
import { RequestCheck } from '@/lib/types'

interface Props {
  submission: Submission
  check: RequestCheck
}

export default function ViewClient({ submission }: Props) {
  return (
    <>
      <Card>
        <CardHeader className='flex flex-col items-left gap-2'>
          <CardTitle>{submission.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p>
            <span className='text-xs text-muted-foreground'>Brief Description</span>
            <br /> {submission.briefDescription}
          </p>
          {/*
          <p>
            <span className='text-xs text-muted-foreground'>Detailed Description</span>
            <br /> {submission.detailedDescription}
          </p>
          <p>
            <span className='text-xs text-muted-foreground'>Expected Expertise</span>
            <br /> {submission.expectedExpertise}
          </p>
          <p>
            <span className='text-xs text-muted-foreground'>Expected Timeline</span>
            <br /> {submission.expectedTimeline}
          </p>
          <p>
            <span className='text-xs text-muted-foreground'>Company</span>
            <br /> {submission.company}
          </p>
          <p>
            <span className='text-xs text-muted-foreground'>Budget</span>
            <br /> {submission.budget}
          </p>
          <p>
            <span className='text-xs text-muted-foreground'>Concept</span>
            <br /> {submission.concept}
          </p>
          <p>
            <span className='text-xs text-muted-foreground'>Field</span>
            <br /> {submission.field}
          </p>
          <p>
            <span className='text-xs text-muted-foreground'>Marketing Consent</span>
            <br /> {submission.marketingConsent ? 'Yes' : 'No'}
          </p>
          <p>
            <span className='text-xs text-muted-foreground'>Ecology Consent</span>
            <br /> {submission.ecologyConsent ? 'Yes' : 'No'}
          </p>
          <p>
            <span className='text-xs text-muted-foreground'>Created At</span>
            <br /> {submission.$createdAt}
          </p>
          <p>
            <span className='text-xs text-muted-foreground'>Updated At</span>
            <br /> {submission.$updatedAt}
          </p>
          <p>
            <span className='text-xs text-muted-foreground'>ID</span>
            <br /> {submission.$id}
          </p> */}
        </CardContent>
      </Card>
    </>
  )
}
