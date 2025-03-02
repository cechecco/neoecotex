import React from 'react'

import OpenButton from '@/components/innovations/submissions/openButton'
import SelectWinnerButton from '@/components/innovations/submissions/selectWinnerButton'
import { Card, CardContent } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Submission, RequestChecksMap } from '@/lib/types'

import StatusBadges from '../requests/statusBadges'

interface Props {
  requestId: string
  submissions: Submission[]
  checks: RequestChecksMap
}

export default function ListClient({ requestId, submissions, checks }: Props) {
  const check = checks[requestId]

  return (
    <Card>
      <StatusBadges check={check} />
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
                  <SelectWinnerButton
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
