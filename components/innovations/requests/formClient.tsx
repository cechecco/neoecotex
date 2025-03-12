'use client'

import { AlertCircle } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'

import { deleteRequest, updateRequest } from '@/app/actions/innovations'
import FormField from '@/components/innovations/FormField'
import ImageUploader from '@/components/innovations/ImageUploader'
import { Button } from '@/components/ui/button'
import { Card, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { getImagesUrl } from '@/lib/client/appwrite'
import { Request, RequestData } from '@/lib/types'

const maxImages = 1

export default function FormClient({ requestId, initialRequest }: { requestId: string | undefined; initialRequest: RequestData }) {
  const [request, setRequest] = useState<RequestData>(initialRequest)
  const [validationError, setValidationError] = useState<Partial<Record<keyof Request, string[]>> | false>(false)
  const [fetchError, setFetchError] = useState<string | false>(false)
  const [pending, setPending] = useState(false)
  const [imagesValidationErrors, setImagesValidationErrors] = useState<Partial<Record<keyof Request, string[]>> | false>(false)
  const [imagesUrl, setImagesUrl] = useState<Record<string, string>>({})
  const [newImages, setNewImages] = useState<{ file: File; preview: string }[]>([])

  useEffect(() => {
    const fetchImagesUrl = async () => {
      const imagesUrl = await getImagesUrl(request.imagesIds)
      setImagesUrl(imagesUrl)
    }
    fetchImagesUrl()
  }, [request.imagesIds])

  useEffect(() => {
    if (validationError) {
      const firstErrorField = Object.keys(validationError)[0] as keyof Request
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
    setRequest({
      ...request,
      imagesIds: request.imagesIds.filter((id) => id !== imageId),
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
    setFetchError(false)
    setPending(true)

    const formData = new FormData(e.target as HTMLFormElement)

    newImages.forEach((image) => {
      formData.append('images', image.file)
    })

    const result = await updateRequest(requestId, formData)
    if (result.error) {
      setFetchError(result.error)
    } else if (result.request) {
      setRequest(result.request)
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
            id='innovation-form'
            onSubmit={handleSubmit}
          >
            <CardTitle>
              <div className='flex items-center justify-between gap-2 w-full border border-secondary bg-secondary/20 p-4 rounded-md'>
                <p className='flex items-center gap-2 font-bold'>Apply changes</p>
                <div className='flex items-center gap-2'>
                  <Button
                    variant='outline'
                    disabled={pending}
                    size='sm'
                  >
                    <Link href={`/innovations/requests/${'$id' in request ? request.$id : 'dashboard'}`}>Discard</Link>
                  </Button>
                  <Button
                    form='innovation-form'
                    type='submit'
                    variant='secondary'
                    disabled={pending}
                    size='sm'
                  >
                    Save
                  </Button>
                </div>
              </div>
            </CardTitle>
            <div className='flex flex-col gap-4'>
              <FormField<Request>
                id='title'
                label='Title'
                type='text'
                maxLength={64}
                value={request?.title}
                pending={pending}
                validationError={validationError}
                onChange={(e) => {
                  setRequest({
                    ...request,
                    title: 'target' in e ? e.target.value : e.value,
                  })
                }}
              />

              <FormField<Request>
                id='briefDescription'
                label='Brief Description'
                type='textarea'
                maxLength={140}
                value={request?.briefDescription}
                pending={pending}
                validationError={validationError}
                onChange={(e) => {
                  setRequest({
                    ...request,
                    briefDescription: 'target' in e ? e.target.value : e.value,
                  })
                }}
              />

              <FormField<Request>
                id='detailedDescription'
                label='Detailed Description'
                type='textarea'
                maxLength={1000}
                value={request?.detailedDescription}
                pending={pending}
                validationError={validationError}
                onChange={(e) => {
                  setRequest({
                    ...request,
                    detailedDescription: 'target' in e ? e.target.value : e.value,
                  })
                }}
              />

              <FormField<Request>
                id='expectedExpertise'
                label='Expected Expertise'
                type='text'
                maxLength={140}
                value={request?.expectedExpertise}
                pending={pending}
                validationError={validationError}
                onChange={(e) => {
                  setRequest({
                    ...request,
                    expectedExpertise: 'target' in e ? e.target.value : e.value,
                  })
                }}
              />

              <FormField<Request>
                id='expectedTimeline'
                label='Expected Timeline'
                type='text'
                maxLength={140}
                value={request?.expectedTimeline}
                pending={pending}
                validationError={validationError}
                onChange={(e) => {
                  setRequest({
                    ...request,
                    expectedTimeline: 'target' in e ? e.target.value : e.value,
                  })
                }}
              />

              <FormField<Request>
                id='company'
                label='Company'
                type='text'
                maxLength={64}
                value={request?.company}
                pending={pending}
                validationError={validationError}
                onChange={(e) => {
                  setRequest({
                    ...request,
                    company: 'target' in e ? e.target.value : e.value,
                  })
                }}
              />

              <FormField<Request>
                id='budget'
                label='Budget'
                type='number'
                value={request?.budget}
                pending={pending}
                validationError={validationError}
                onChange={(e) => {
                  setRequest({
                    ...request,
                    budget: parseFloat('target' in e ? e.target.value : e.value) || 0,
                  })
                }}
              />

              <FormField<Request>
                id='concept'
                label='Concept'
                type='text'
                maxLength={140}
                value={request?.concept}
                pending={pending}
                validationError={validationError}
                onChange={(e) => {
                  setRequest({
                    ...request,
                    concept: 'target' in e ? e.target.value : e.value,
                  })
                }}
              />

              <FormField<Request>
                id='field'
                label='Field'
                type='text'
                maxLength={140}
                value={request?.field}
                pending={pending}
                validationError={validationError}
                onChange={(e) => {
                  setRequest({
                    ...request,
                    field: 'target' in e ? e.target.value : e.value,
                  })
                }}
              />

              <ImageUploader
                maxImages={maxImages}
                imagesIds={request.imagesIds}
                imagesUrl={imagesUrl}
                pending={pending}
                imagesValidationErrors={imagesValidationErrors}
                onImageRemove={handleImageRemove}
                onNewImageRemove={handleNewImageRemove}
                onImagesAdd={handleImagesAdd}
                newImages={newImages}
              />

              <FormField<Request>
                id='marketingConsent'
                label='Marketing Consent'
                type='checkbox'
                value={request?.marketingConsent}
                pending={pending}
                validationError={validationError}
                onChange={(e) => {
                  setRequest({
                    ...request,
                    marketingConsent: 'target' in e ? (e.target as HTMLInputElement).checked : !!e.value,
                  })
                }}
              />

              <FormField<Request>
                id='ecologyConsent'
                label='Ecology Consent'
                type='checkbox'
                value={request?.ecologyConsent}
                pending={pending}
                validationError={validationError}
                onChange={(e) => {
                  setRequest({
                    ...request,
                    ecologyConsent: 'target' in e ? (e.target as HTMLInputElement).checked : !!e.value,
                  })
                }}
              />
            </div>
          </form>
        </CardHeader>
        <CardFooter className='w-full flex flex-col gap-4'>
          {requestId && (
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
                  type='button'
                  variant='destructive'
                  onClick={async () => {
                    if (requestId) {
                      setPending(true)
                      await deleteRequest(requestId)
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
