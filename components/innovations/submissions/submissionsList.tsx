import React from 'react'
import { getSubmissions } from '@/app/actions/actions'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import OpenButton from './openButton'

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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Submissions</CardTitle>
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
                <TableCell>
                  <OpenButton
                    submissionId={submission.$id!}
                    requestId={submission.requestId.$id!}
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
