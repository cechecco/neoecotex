'use client'

import React, { useEffect, useState } from 'react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Request, RequestCheck } from '@/lib/types'
import Image from 'next/image'
import { getImagesUrl } from '@/lib/client/appwrite'
interface Props {
  request: Request,
  check: RequestCheck
}

export default function ViewClient({ request }: Props) {
  const [images, setImages] = useState<Record<string, string>>({})
  useEffect(() => {
    getImagesUrl(request.imagesUrl).then(setImages)
  }, [request.imagesUrl])
  return (
    <>
      <Card>
        <CardHeader className='flex flex-col items-left gap-2'>
          {(Object.keys(images).length > 0) && request.imagesUrl.map((imageUrl) => (
            <Image
              key={imageUrl}
              src={images[imageUrl]}
              alt={request.title}
              width={1000}
              height={400}
              className="w-full h-[300px] object-cover rounded-md"
            />
          ))}
          <CardTitle>{request.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p>
            <span className='text-xs text-muted-foreground'>Brief Description</span>
            <br /> {request.briefDescription}
          </p>
          <p>
            <span className='text-xs text-muted-foreground'>Detailed Description</span>
            <br /> {request.detailedDescription}
          </p>
          <p>
            <span className='text-xs text-muted-foreground'>Expected Expertise</span>
            <br /> {request.expectedExpertise}
          </p>
          <p>
            <span className='text-xs text-muted-foreground'>Expected Timeline</span>
            <br /> {request.expectedTimeline}
          </p>
          <p>
            <span className='text-xs text-muted-foreground'>Company</span>
            <br /> {request.company}
          </p>
          <p>
            <span className='text-xs text-muted-foreground'>Budget</span>
            <br /> {request.budget}
          </p>
          <p>
            <span className='text-xs text-muted-foreground'>Concept</span>
            <br /> {request.concept}
          </p>
          <p>
            <span className='text-xs text-muted-foreground'>Field</span>
            <br /> {request.field}
          </p>
          <p>
            <span className='text-xs text-muted-foreground'>Marketing Consent</span>
            <br /> {request.marketingConsent ? 'Yes' : 'No'}
          </p>
          <p>
            <span className='text-xs text-muted-foreground'>Ecology Consent</span>
            <br /> {request.ecologyConsent ? 'Yes' : 'No'}
          </p>
          <p>
            <span className='text-xs text-muted-foreground'>Created At</span>
            <br /> {request.$createdAt}
          </p>
          <p>
            <span className='text-xs text-muted-foreground'>Updated At</span>
            <br /> {request.$updatedAt}
          </p>
          <p>
            <span className='text-xs text-muted-foreground'>ID</span>
            <br /> {request.$id}
          </p>
        </CardContent>
      </Card>
    </>
  )
}
