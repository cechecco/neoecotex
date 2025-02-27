import React from 'react'
import { getRequestsChecks, getSubmissions } from '@/app/actions/actions'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import OpenButton from './openButton'
import WinButton from '../winButton'
import WinnerEmailButton from '../winnerEmailButton'
import { innovations } from '@/lib/server/database'

interface Props {
  requestId: string
}

const SubmissionsList = async ({ requestId }: Props) => {
  const submissionsResponse = await getSubmissions(requestId)

  if ('error' in submissionsResponse) {
    return <div>Error: {submissionsResponse.message}</div>
  }

  const submissions = submissionsResponse.documents

  if (submissions.length === 0) {
    return <div>No submissions found</div>
  }

  const check = (await getRequestsChecks([requestId]))[requestId]

  return (
    <Card>
      <CardHeader>
        <WinnerEmailButton check={check} />
      </CardHeader>
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
                    submissionId={submission.$id!}
                    requestId={submission.requestId}
                  />
                  <WinButton
                    submissionId={submission.$id!}
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

export default SubmissionsList
