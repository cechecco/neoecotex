'use client'

import { Card, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { deleteSubmission, updateSubmission } from '@/app/actions/actions'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useState } from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { AlertCircle } from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import { SubmissionData } from '@/lib/types'

interface Props {
  initialSubmission: SubmissionData
  submissionId: string | undefined
  requestId: string
}

export default function FormClient({ initialSubmission, submissionId, requestId }: Props) {
  const [submission, setSubmission] = useState<SubmissionData>(initialSubmission)
  const [fetchError, setFetchError] = useState<string | undefined>(undefined)
  const [validationError, setValidationError] = useState<Partial<Record<keyof SubmissionData, string[]>> | false>(false)
  const [pending, setPending] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setValidationError(false)
    setFetchError(undefined)
    setPending(true)

    const formData = new FormData(e.target as HTMLFormElement)
    const result = await updateSubmission(submissionId, formData)

    if (result.error) {
      setFetchError(result.error)
    } else if (result.validationErrors) {
      setValidationError(result.validationErrors)
    } else if (result.submission) {
      setSubmission(result.submission)
    }

    setPending(false)
  }

  if (fetchError) {
    return (
      <div className='flex items-center justify-center h-full'>
        <p className='text-red-500'>{fetchError}</p>
      </div>
    )
  }

  return (
    <>
      <Card>
        <CardHeader>
          <form
            id='innovation-form'
            onSubmit={handleSubmit}
          >
            <CardTitle>
              <div className='flex items-center justify-between gap-2 w-full border border-secondary bg-secondary/20 p-4 rounded-md'>
                <p className='flex items-center gap-2 font-bold'>Apply changes</p>
                <input
                  type='hidden'
                  name='requestId'
                  value={requestId}
                />
                <div className='flex items-center gap-2'>
                  <Button
                    variant='outline'
                    disabled={pending}
                    size='sm'
                    type='button'
                  >
                    <Link href={`/innovations/requests/${requestId}/submissions/${submissionId || ''}`}>Discard</Link>
                  </Button>
                  <Button
                    form='innovation-form'
                    variant='secondary'
                    type='submit'
                    disabled={pending || (submissionId ? JSON.stringify(submission) === JSON.stringify(initialSubmission) : false)}
                    size='sm'
                  >
                    Save
                  </Button>
                </div>
              </div>
            </CardTitle>
            <div className='flex flex-col gap-4'>
              <div className='grid w-full items-center gap-1.5'>
                <Label
                  htmlFor='title'
                  className='flex items-center justify-between'
                >
                  <div className='flex items-center gap-2 text-sm text-muted-foreground'>
                    Title
                    {validationError && validationError.title && (
                      <>
                        <AlertCircle
                          className='w-4 h-4 text-red-500'
                          size={12}
                        />
                        <p className='text-red-500 text-sm'>{validationError.title}</p>
                      </>
                    )}
                  </div>
                  <p className='text-xs text-muted-foreground'>{submission?.title?.length || 0} / 64</p>
                </Label>
                <div className='relative'>
                  <Input
                    type='text'
                    id='title'
                    name='title'
                    defaultValue={submission?.title}
                    className={pending ? 'invisible' : ''}
                    maxLength={64}
                    onChange={(e) => {
                      setSubmission({
                        ...submission,
                        title: e.target.value,
                      })
                    }}
                  />
                  {pending && <Skeleton className='absolute inset-0 z-20 h-full' />}
                </div>
              </div>

              <div className='grid w-full items-center gap-1.5'>
                <Label
                  htmlFor='briefDescription'
                  className='flex items-center justify-between'
                >
                  <div className='flex items-center gap-2 text-sm text-muted-foreground'>
                    Brief Description
                    {validationError && validationError.briefDescription && (
                      <>
                        <AlertCircle
                          className='w-4 h-4 text-red-500'
                          size={12}
                        />
                        <p className='text-red-500 text-sm'>{validationError.briefDescription}</p>
                      </>
                    )}
                  </div>
                  <p className='text-xs text-muted-foreground'>{submission?.briefDescription?.length || 0} / 140</p>
                </Label>
                <div className='relative'>
                  <Textarea
                    id='briefDescription'
                    name='briefDescription'
                    defaultValue={submission?.briefDescription}
                    className={pending ? 'invisible' : ''}
                    maxLength={140}
                    onChange={(e) => {
                      setSubmission({
                        ...submission,
                        briefDescription: e.target.value,
                      })
                    }}
                  />
                  {pending && <Skeleton className='absolute inset-0 z-20 h-full' />}
                </div>
              </div>

              {/* Add more fields as needed, following the same pattern */}
            </div>
          </form>
        </CardHeader>
        <CardFooter className='w-full flex flex-col gap-4'>
          {submissionId && (
            <>
              <Separator />
              <div className='flex justify-between items-center gap-2 w-full border border-destructive bg-destructive/10 p-4 rounded-md'>
                <div className='flex flex-col gap-2'>
                  <p className='flex items-center gap-2 text-destructive font-bold'>
                    <AlertCircle className='w-4 h-4' /> Danger: Delete this request
                  </p>
                  <p className='text-destructive text-sm'>Once you delete a request, there is no going back. Please be certain.</p>
                </div>
                <Button
                  variant='destructive'
                  onClick={async () => {
                    if (submissionId) {
                      setPending(true)
                      await deleteSubmission(submissionId, requestId)
                      setPending(false)
                    }
                  }}
                  size='sm'
                >
                  Delete
                </Button>
              </div>
            </>
          )}
        </CardFooter>
      </Card>
    </>
  )
}
