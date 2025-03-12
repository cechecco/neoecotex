import React from 'react'

import OpenButton from '@/components/innovations/submissions/openButton'
import SelectWinnerButton from '@/components/innovations/submissions/selectWinnerButton'
import { Card, CardContent } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Submission, RequestChecksMap } from '@/lib/types'

import StatusBadges from '../requests/statusBadges'

interface Props {
  submissions: Submission[]
  checks: RequestChecksMap
  userType: string
}

export default function ListClient({ submissions, checks, userType }: Props) {
  return (
    <Card>
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
                  {userType === 'requester' ? (
                    <SelectWinnerButton
                      submissionId={submission.$id}
                      check={checks[submission.requestId]}
                    />
                  ) : (
                    <StatusBadges check={checks[submission.requestId]} />
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
