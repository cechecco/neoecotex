'use client'

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { formatDistance } from 'date-fns'
import { Request } from '@/lib/types'
import { RequestCheck } from '@/lib/server/database'

interface Props {
  request: Request
  check: RequestCheck
}

export function RequestCard({ request, check }: Props) {
  return (
    <Card className={`h-full transition-all duration-300 flex flex-col justify-start ${check.thereIsWinner ? 'opacity-70' : ''}`}>
      <CardHeader>
        <CardTitle className="line-clamp-1">{request.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="line-clamp-2">{request.briefDescription}</p>
      </CardContent>
      <CardFooter className="mt-auto flex flex-col gap-2">
        <Separator className="my-2" />
        <div className="flex justify-between items-center w-full text-xs text-muted-foreground">
          <p>
            Posted {formatDistance(new Date(request.$createdAt), new Date(), { addSuffix: true })}
          </p>
          {check.iHaveSubmitted && <p>Submitted</p>}
          {check.thereIsWinner && <p>Winner Selected</p>}
        </div>
      </CardFooter>
    </Card>
  )
}
