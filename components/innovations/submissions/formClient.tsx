'use client'

import { AlertCircle } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'

import { deleteSubmission, updateSubmission } from '@/app/actions/innovations'
import FormField from '@/components/innovations/FormField'
import ImageUploader from '@/components/innovations/ImageUploader'
import { Button } from '@/components/ui/button'
import { Card, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { getImagesUrl } from '@/lib/client/appwrite'
import { Submission, SubmissionData } from '@/lib/types'

const maxImages = 1

interface Props {
  initialSubmission: SubmissionData
  submissionId: string | undefined
  requestId: string
}

export default function FormClient({ initialSubmission, submissionId, requestId }: Props) {
  const [submission, setSubmission] = useState<SubmissionData>(initialSubmission)
  const [fetchError, setFetchError] = useState<string | undefined>(undefined)
  const [validationError, setValidationError] = useState<Partial<Record<keyof SubmissionData, string[]>> | false>(false)
  const [imagesValidationErrors, setImagesValidationErrors] = useState<Partial<Record<keyof Submission, string[]>> | false>(false)
  const [pending, setPending] = useState(false)
  const [imagesUrl, setImagesUrl] = useState<Record<string, string>>({})
  const [newImages, setNewImages] = useState<{ file: File; preview: string }[]>([])

  useEffect(() => {
    const fetchImagesUrl = async () => {
      const imagesUrl = await getImagesUrl(submission.imagesIds || [])
      setImagesUrl(imagesUrl)
    }
    fetchImagesUrl()
  }, [submission.imagesIds])

  useEffect(() => {
    if (validationError) {
      const firstErrorField = Object.keys(validationError)[0] as keyof Submission
      if (firstErrorField) {
        const errorElement = document.getElementById(firstErrorField as string)
        if (errorElement) {
          errorElement.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
          })
        }
      }
    } else if (imagesValidationErrors) {
      const imagesInput = document.getElementById('images-input')
      if (imagesInput) {
        imagesInput.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        })
      }
    }
  }, [validationError, imagesValidationErrors])

  const handleImageRemove = (imageId: string | undefined) => {
    if (!imageId) return
    setSubmission({
      ...submission,
      imagesIds: (submission.imagesIds || []).filter((id: string) => id !== imageId),
    })
  }

  const handleNewImageRemove = (index: number) => {
    setNewImages((prev) => prev.filter((_, i) => i !== index))
  }

  const handleImagesAdd = (files: File[]) => {
    const _newImages = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }))

    setNewImages((prev) => [...prev, ..._newImages])
  }

  useEffect(() => {
    return () => {
      newImages.forEach((image) => URL.revokeObjectURL(image.preview))
    }
  }, [newImages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setValidationError(false)
    setFetchError(undefined)
    setImagesValidationErrors(false)
    setPending(true)

    const formData = new FormData(e.target as HTMLFormElement)

    newImages.forEach((image) => {
      formData.append('images', image.file)
    })

    const result = await updateSubmission(submissionId, formData)

    if (result.error) {
      setFetchError(result.error)
    } else if (result.submission) {
      setSubmission(result.submission)
      setNewImages([])
    }

    if (result.validationErrors) {
      setValidationError(result.validationErrors)
    }

    if (result.imagesValidationErrors) {
      setImagesValidationErrors(result.imagesValidationErrors)
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
            id='submission-form'
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
                    form='submission-form'
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
              <FormField<Submission>
                id='title'
                label='Title'
                type='text'
                maxLength={64}
                value={submission?.title}
                pending={pending}
                validationError={validationError}
                onChange={(e) => {
                  setSubmission({
                    ...submission,
                    title: 'target' in e ? e.target.value : e.value,
                  })
                }}
              />

              <FormField<Submission>
                id='briefDescription'
                label='Brief Description'
                type='textarea'
                maxLength={140}
                value={submission?.briefDescription}
                pending={pending}
                validationError={validationError}
                onChange={(e) => {
                  setSubmission({
                    ...submission,
                    briefDescription: 'target' in e ? e.target.value : e.value,
                  })
                }}
              />

              <FormField<Submission>
                id='detailedDescription'
                label='Detailed Description of Innovation Solution'
                type='textarea'
                maxLength={1500}
                value={submission?.detailedDescription}
                pending={pending}
                validationError={validationError}
                onChange={(e) => {
                  setSubmission({
                    ...submission,
                    detailedDescription: 'target' in e ? e.target.value : e.value,
                  })
                }}
              />

              <FormField<Submission>
                id='expertisePreferences'
                label='Expertise Preferences'
                type='textarea'
                maxLength={1500}
                value={submission?.expertisePreferences}
                pending={pending}
                validationError={validationError}
                onChange={(e) => {
                  setSubmission({
                    ...submission,
                    expertisePreferences: 'target' in e ? e.target.value : e.value,
                  })
                }}
              />

              <FormField<Submission>
                id='timelineScope'
                label='Timeline Scope'
                type='textarea'
                maxLength={1500}
                value={submission?.timelineScope}
                pending={pending}
                validationError={validationError}
                onChange={(e) => {
                  setSubmission({
                    ...submission,
                    timelineScope: 'target' in e ? e.target.value : e.value,
                  })
                }}
              />

              <ImageUploader
                maxImages={maxImages}
                imagesIds={submission.imagesIds || []}
                imagesUrl={imagesUrl}
                pending={pending}
                imagesValidationErrors={imagesValidationErrors}
                onImageRemove={handleImageRemove}
                onNewImageRemove={handleNewImageRemove}
                onImagesAdd={handleImagesAdd}
                newImages={newImages}
              />

              <div className='mt-4'>
                <p className='text-sm text-muted-foreground mb-2'>Max file size is 1mb</p>

                <FormField<Submission>
                  id='marketingConsent'
                  label='I want to stay in the loop on the latest and receive marketing communications.'
                  type='checkbox'
                  value={submission?.marketingConsent}
                  pending={pending}
                  validationError={validationError}
                  onChange={(e) => {
                    setSubmission({
                      ...submission,
                      marketingConsent: 'target' in e && typeof e.target === 'object' && 'checked' in e.target ? !!e.target.checked : false,
                    })
                  }}
                />

                <FormField<Submission>
                  id='ecologyConsent'
                  label='I accept my innovation does not harm ecology and humans.'
                  type='checkbox'
                  value={submission?.ecologyConsent}
                  pending={pending}
                  validationError={validationError}
                  onChange={(e) => {
                    setSubmission({
                      ...submission,
                      ecologyConsent: 'target' in e && typeof e.target === 'object' && 'checked' in e.target ? !!e.target.checked : false,
                    })
                  }}
                />
              </div>
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
                    <AlertCircle className='w-4 h-4' /> Danger: Delete this submission
                  </p>
                  <p className='text-destructive text-sm'>Once you delete a submission, there is no going back. Please be certain.</p>
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
