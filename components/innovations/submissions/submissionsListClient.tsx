import React from 'react'
import { Submission, RequestChecksMap } from '@/lib/types'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Card, CardContent } from '@/components/ui/card'
import OpenButton from './openButton'
import WinButton from '../winButton'
import RequestStatus from '../requestStatus'

interface Props {
  requestId: string
  submissions: Submission[]
  checks: RequestChecksMap
}

export default function SubmissionsListClient({ requestId, submissions, checks }: Props) {
  const check = checks[requestId]

  return (
    <Card>
      <RequestStatus check={check} />
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className='w-[500px]'>Title</TableHead>
              <TableHead className='w-[500px]'>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {submissions.map((submission) => (
              <TableRow key={submission.$id}>
                <TableCell>{submission.title}</TableCell>
                <TableCell className='flex gap-2'>
                  <OpenButton
                    submissionId={submission.$id}
                    requestId={submission.requestId}
                  />
                  <WinButton
                    submissionId={submission.$id}
                    check={check}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
