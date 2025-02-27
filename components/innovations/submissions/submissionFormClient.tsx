'use client'

import { Card, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { deleteSubmission, updateSubmission } from '@/app/actions/actions'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useActionState, useEffect, useState } from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { AlertCircle } from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import { InnovationRequest, Submission } from '@/lib/types'
import { useSubmission } from '@/contexts/submissionContext'

export default function SubmissionFormClient() {
  const { submission, setSubmission } = useSubmission()
  const [state, formAction, pending] = useActionState(updateSubmission, submission)
  const [fetchError, setFetchError] = useState<string | undefined>(undefined)
  const [validationError, setValidationError] = useState<Partial<Record<keyof Submission, string[]>> | false>(false)

  useEffect(() => {
    if (!pending) {
      if ('error' in state) {
        setFetchError(state.message)
      } else if ('validationError' in state) {
        setValidationError(state.errors)
      } else {
        setSubmission(state)
      }
    }
  }, [state, setSubmission, pending])

  if (fetchError) {
    return (
      <div className='flex items-center justify-center h-full'>
        <p className='text-red-500'>{fetchError}</p>
      </div>
    )
  }

  return (
    <>
      <form
        id='innovation-form'
        action={formAction}
      >
        <Card>
          <CardHeader>
            <CardTitle>
              <div className='flex items-center justify-between gap-2 w-full border border-secondary bg-secondary/20 p-4 rounded-md'>
                <p className='flex items-center gap-2 font-bold'>Apply changes</p>
                <input
                  type='hidden'
                  name='requestId'
                  value={submission.requestId}
                />
                <div className='flex items-center gap-2'>
                  <Button
                    variant='outline'
                    disabled={pending}
                    size='sm'
                    type='button'
                  >
                    {/* TODO: quel check su id non e' bello */}
                    <Link
                      href={`/innovations/requests/${submission.requestId}/submissions/${'$id' in submission ? submission.$id : ''}`}
                    >
                      Discard
                    </Link>
                  </Button>
                  <Button
                    form='innovation-form'
                    variant='secondary'
                    type='submit'
                    disabled={pending || (submission.$id ? JSON.stringify(submission) === JSON.stringify(state) : false)}
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

              {/* <div className='grid w-full items-center gap-1.5'>
                <Label
                  htmlFor='detailedDescription'
                  className='flex items-center justify-between'
                >
                  <div className='flex items-center gap-2 text-sm text-muted-foreground'>
                    Detailed Description
                    {validationError && validationError.detailedDescription && (
                      <>
                        <AlertCircle
                          className='w-4 h-4 text-red-500'
                          size={12}
                        />
                        <p className='text-red-500 text-sm'>{validationError.detailedDescription}</p>
                      </>
                    )}
                  </div>
                  <p className='text-xs text-muted-foreground'>{submission?.detailedDescription?.length || 0} / 1000</p>
                </Label>
                <div className='relative'>
                  <Textarea
                    id='detailedDescription'
                    name='detailedDescription'
                    defaultValue={submission?.detailedDescription}
                    className={pending ? 'invisible' : ''}
                    maxLength={1000}
                    onChange={(e) => {
                      setSubmission({
                        ...submission,
                        detailedDescription: e.target.value,
                      })
                    }}
                  />
                  {pending && <Skeleton className='absolute inset-0 z-20 h-full' />}
                </div>
              </div>

              <div className='grid w-full items-center gap-1.5'>
                <Label
                  htmlFor='expectedExpertise'
                  className='flex items-center justify-between'
                >
                  <div className='flex items-center gap-2 text-sm text-muted-foreground'>
                    Expected Expertise
                    {validationError && validationError.expectedExpertise && (
                      <>
                        <AlertCircle
                          className='w-4 h-4 text-red-500'
                          size={12}
                        />
                        <p className='text-red-500 text-sm'>{validationError.expectedExpertise}</p>
                      </>
                    )}
                  </div>
                  <p className='text-xs text-muted-foreground'>{submission?.expectedExpertise?.length || 0} / 140</p>
                </Label>
                <div className='relative'>
                  <Input
                    type='text'
                    id='expectedExpertise'
                    name='expectedExpertise'
                    defaultValue={submission?.expectedExpertise}
                    className={pending ? 'invisible' : ''}
                    maxLength={140}
                    onChange={(e) => {
                      setSubmission({
                        ...submission,
                        expectedExpertise: e.target.value,
                      })
                    }}
                  />
                  {pending && <Skeleton className='absolute inset-0 z-20 h-full' />}
                </div>
              </div>

              <div className='grid w-full items-center gap-1.5'>
                <Label
                  htmlFor='expectedTimeline'
                  className='flex items-center justify-between'
                >
                  <div className='flex items-center gap-2 text-sm text-muted-foreground'>
                    Expected Timeline
                    {validationError && validationError.expectedTimeline && (
                      <>
                        <AlertCircle
                          className='w-4 h-4 text-red-500'
                          size={12}
                        />
                        <p className='text-red-500 text-sm'>{validationError.expectedTimeline}</p>
                      </>
                    )}
                  </div>
                  <p className='text-xs text-muted-foreground'>{submission?.expectedTimeline?.length || 0} / 140</p>
                </Label>
                <div className='relative'>
                  <Input
                    type='text'
                    id='expectedTimeline'
                    name='expectedTimeline'
                    defaultValue={submission?.expectedTimeline}
                    className={pending ? 'invisible' : ''}
                    maxLength={140}
                    onChange={(e) => {
                      setSubmission({
                        ...submission,
                        expectedTimeline: e.target.value,
                      })
                    }}
                  />
                  {pending && <Skeleton className='absolute inset-0 z-20 h-full' />}
                </div>
              </div>

              <div className='grid w-full items-center gap-1.5'>
                <Label
                  htmlFor='company'
                  className='flex items-center justify-between'
                >
                  <div className='flex items-center gap-2 text-sm text-muted-foreground'>
                    Company
                    {validationError && validationError.company && (
                      <>
                        <AlertCircle
                          className='w-4 h-4 text-red-500'
                          size={12}
                        />
                        <p className='text-red-500 text-sm'>{validationError.company}</p>
                      </>
                    )}
                  </div>
                  <p className='text-xs text-muted-foreground'>{submission?.company?.length || 0} / 64</p>
                </Label>
                <div className='relative'>
                  <Input
                    type='text'
                    id='company'
                    name='company'
                    defaultValue={submission?.company}
                    className={pending ? 'invisible' : ''}
                    maxLength={64}
                    onChange={(e) => {
                      setSubmission({
                        ...submission,
                        company: e.target.value,
                      })
                    }}
                  />
                  {pending && <Skeleton className='absolute inset-0 z-20 h-full' />}
                </div>
              </div>

              <div className='grid w-full items-center gap-1.5'>
                <Label
                  htmlFor='budget'
                  className='flex items-center justify-between'
                >
                  <div className='flex items-center gap-2 text-sm text-muted-foreground'>
                    Budget
                    {validationError && validationError.budget && (
                      <>
                        <AlertCircle
                          className='w-4 h-4 text-red-500'
                          size={12}
                        />
                        <p className='text-red-500 text-sm'>{validationError.budget}</p>
                      </>
                    )}
                  </div>
                </Label>
                <div className='relative'>
                  <Input
                    type='number'
                    id='budget'
                    name='budget'
                    defaultValue={submission?.budget}
                    className={pending ? 'invisible' : ''}
                  />
                  {pending && <Skeleton className='absolute inset-0 z-20 h-full' />}
                </div>
              </div>

              <div className='grid w-full items-center gap-1.5'>
                <Label
                  htmlFor='concept'
                  className='flex items-center justify-between'
                >
                  <div className='flex items-center gap-2 text-sm text-muted-foreground'>
                    Concept
                    {validationError && validationError.concept && (
                      <>
                        <AlertCircle
                          className='w-4 h-4 text-red-500'
                          size={12}
                        />
                        <p className='text-red-500 text-sm'>{validationError.concept}</p>
                      </>
                    )}
                  </div>
                  <p className='text-xs text-muted-foreground'>{submission?.concept?.length || 0} / 140</p>
                </Label>
                <div className='relative'>
                  <Input
                    type='text'
                    id='concept'
                    name='concept'
                    defaultValue={submission?.concept}
                    className={pending ? 'invisible' : ''}
                    maxLength={140}
                    onChange={(e) => {
                      setSubmission({
                        ...submission,
                        concept: e.target.value,
                      })
                    }}
                  />
                  {pending && <Skeleton className='absolute inset-0 z-20 h-full' />}
                </div>
              </div>

              <div className='grid w-full items-center gap-1.5'>
                <Label
                  htmlFor='field'
                  className='flex items-center justify-between'
                >
                  <div className='flex items-center gap-2 text-sm text-muted-foreground'>
                    Field
                    {validationError && validationError.field && (
                      <>
                        <AlertCircle
                          className='w-4 h-4 text-red-500'
                          size={12}
                        />
                        <p className='text-red-500 text-sm'>{validationError.field}</p>
                      </>
                    )}
                  </div>
                  <p className='text-xs text-muted-foreground'>{submission?.field?.length || 0} / 140</p>
                </Label>
                <div className='relative'>
                  <Input
                    type='text'
                    id='field'
                    name='field'
                    defaultValue={submission?.field}
                    className={pending ? 'invisible' : ''}
                    maxLength={140}
                    onChange={(e) => {
                      setSubmission({
                        ...submission,
                        field: e.target.value,
                      })
                    }}
                  />
                  {pending && <Skeleton className='absolute inset-0 z-20 h-full' />}
                </div>
              </div>

              <div className='flex items-center space-x-2'>
                <div className='relative'>
                  <Checkbox
                    id='marketingConsent'
                    name='marketingConsent'
                    defaultChecked={submission?.marketingConsent}
                    className={pending ? 'invisible' : ''}
                  />
                  {pending && <Skeleton className='absolute inset-0 z-20 h-full' />}
                </div>
                <Label
                  htmlFor='marketingConsent'
                  className='text-sm text-muted-foreground'
                >
                  Marketing Consent
                </Label>
              </div>

              <div className='flex items-center space-x-2'>
                <div className='relative'>
                  <Checkbox
                    id='ecologyConsent'
                    name='ecologyConsent'
                    defaultChecked={submission?.ecologyConsent}
                    className={pending ? 'invisible' : ''}
                  />
                  {pending && <Skeleton className='absolute inset-0 z-20 h-full' />}
                </div>
                <Label
                  htmlFor='ecologyConsent'
                  className='text-sm text-muted-foreground'
                >
                  Ecology Consent
                </Label>
              </div> */}
            </div>
          </CardHeader>
          <CardFooter className='w-full flex flex-col gap-4'>
            {submission.$id && (
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
                    onClick={() => submission.$id && deleteSubmission(submission.$id, (submission.requestId as InnovationRequest).$id!)}
                    size='sm'
                  >
                    Delete
                  </Button>
                </div>
              </>
            )}
          </CardFooter>
        </Card>
      </form>
    </>
  )
}
