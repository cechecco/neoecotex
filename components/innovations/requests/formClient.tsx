'use client'

import { AlertCircle } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

import { deleteRequest, updateRequest } from '@/app/actions/innovations'
import { Button } from '@/components/ui/button'
import { Card, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { Textarea } from '@/components/ui/textarea'
import { Request, RequestData } from '@/lib/types'

export default function FormClient({ 
  initialRequest, 
  requestId, 
  maxImages = 5 // Default max images if not specified
}: { 
  initialRequest: RequestData; 
  requestId: string | undefined;
  maxImages?: number;
}) {
  const [request, setRequest] = useState<RequestData>(initialRequest)
  const [validationError, setValidationError] = useState<Partial<Record<keyof Request, string[]>> | false>(false)
  const [fetchError, setFetchError] = useState<string | false>(false)
  const [pending, setPending] = useState(false)
  
  // Track images that should be removed
  const [imagesToRemove, setImagesToRemove] = useState<string[]>([])

  const handleImageRemove = (imageUrl: string | undefined) => {
    if (!imageUrl) return
    setImagesToRemove([...imagesToRemove, imageUrl]);
    
    setRequest({
      ...request,
      imagesUrl: request.imagesUrl.filter(url => url !== imageUrl)
    });
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setValidationError(false)
    setFetchError(false)
    setPending(true)

    const formData = new FormData(e.target as HTMLFormElement)
    
    // Add the images to remove to the form data
    if (imagesToRemove.length > 0) {
      formData.append('imagesToRemove', JSON.stringify(imagesToRemove));
    }
    
    const result = await updateRequest(requestId, formData)

    if (result.error) {
      setFetchError(result.error)
    } else if (result.validationErrors) {
      setValidationError(result.validationErrors)
    } else if (result.request) {
      setRequest(result.request)
      // Reset images to remove after successful update
      setImagesToRemove([]);
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
          aa{JSON.stringify(request)}
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
                  <p className='text-xs text-muted-foreground'>{request?.title?.length || 0} / 64</p>
                </Label>
                <div className='relative'>
                  <Input
                    type='text'
                    id='title'
                    name='title'
                    defaultValue={request?.title}
                    className={pending ? 'invisible' : ''}
                    maxLength={64}
                    onChange={(e) => {
                      setRequest({
                        ...request,
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
                  <p className='text-xs text-muted-foreground'>{request?.briefDescription?.length || 0} / 140</p>
                </Label>
                <div className='relative'>
                  <Textarea
                    id='briefDescription'
                    name='briefDescription'
                    defaultValue={request?.briefDescription}
                    className={pending ? 'invisible' : ''}
                    maxLength={140}
                    onChange={(e) => {
                      setRequest({
                        ...request,
                        briefDescription: e.target.value,
                      })
                    }}
                  />
                  {pending && <Skeleton className='absolute inset-0 z-20 h-full' />}
                </div>
              </div>

              <div className='grid w-full items-center gap-1.5'>
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
                  <p className='text-xs text-muted-foreground'>{request?.detailedDescription?.length || 0} / 1000</p>
                </Label>
                <div className='relative'>
                  <Textarea
                    id='detailedDescription'
                    name='detailedDescription'
                    defaultValue={request?.detailedDescription}
                    className={pending ? 'invisible' : ''}
                    maxLength={1000}
                    onChange={(e) => {
                      setRequest({
                        ...request,
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
                  <p className='text-xs text-muted-foreground'>{request?.expectedExpertise?.length || 0} / 140</p>
                </Label>
                <div className='relative'>
                  <Input
                    type='text'
                    id='expectedExpertise'
                    name='expectedExpertise'
                    defaultValue={request?.expectedExpertise}
                    className={pending ? 'invisible' : ''}
                    maxLength={140}
                    onChange={(e) => {
                      setRequest({
                        ...request,
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
                  <p className='text-xs text-muted-foreground'>{request?.expectedTimeline?.length || 0} / 140</p>
                </Label>
                <div className='relative'>
                  <Input
                    type='text'
                    id='expectedTimeline'
                    name='expectedTimeline'
                    defaultValue={request?.expectedTimeline}
                    className={pending ? 'invisible' : ''}
                    maxLength={140}
                    onChange={(e) => {
                      setRequest({
                        ...request,
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
                  <p className='text-xs text-muted-foreground'>{request?.company?.length || 0} / 64</p>
                </Label>
                <div className='relative'>
                  <Input
                    type='text'
                    id='company'
                    name='company'
                    defaultValue={request?.company}
                    className={pending ? 'invisible' : ''}
                    maxLength={64}
                    onChange={(e) => {
                      setRequest({
                        ...request,
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
                    defaultValue={request?.budget}
                    className={pending ? 'invisible' : ''}
                    onChange={(e) => {
                      setRequest({
                        ...request,
                        budget: parseFloat(e.target.value) || 0,
                      })
                    }}
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
                  <p className='text-xs text-muted-foreground'>{request?.concept?.length || 0} / 140</p>
                </Label>
                <div className='relative'>
                  <Input
                    type='text'
                    id='concept'
                    name='concept'
                    defaultValue={request?.concept}
                    className={pending ? 'invisible' : ''}
                    maxLength={140}
                    onChange={(e) => {
                      setRequest({
                        ...request,
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
                  <p className='text-xs text-muted-foreground'>{request?.field?.length || 0} / 140</p>
                </Label>
                <div className='relative'>
                  <Input
                    type='text'
                    id='field'
                    name='field'
                    defaultValue={request?.field}
                    className={pending ? 'invisible' : ''}
                    maxLength={140}
                    onChange={(e) => {
                      setRequest({
                        ...request,
                        field: e.target.value,
                      })
                    }}
                  />
                  {pending && <Skeleton className='absolute inset-0 z-20 h-full' />}
                </div>
              </div>

              <div className='grid w-full items-center gap-1.5'>
                <Label
                  htmlFor='images'
                  className='flex items-center justify-between'
                >
                  <div className='flex items-center gap-2 text-sm text-muted-foreground'>
                    Images
                    {validationError && validationError.images && (
                      <>
                        <AlertCircle
                          className='w-4 h-4 text-red-500'
                          size={12}
                        />
                        <p className='text-red-500 text-sm'>{validationError.images}</p>
                      </>
                    )}
                  </div>
                  <p className='text-xs text-muted-foreground'>
                    {request?.imagesUrl?.length || 0} / {maxImages} images
                  </p>
                </Label>
                <div className='relative'>
                  <Input
                    type='file'
                    name='images'
                    accept='image/*'
                    multiple
                    className={pending ? 'invisible' : ''}
                    disabled={request?.imagesUrl?.length >= maxImages}
                  />
                  {pending && <Skeleton className='absolute inset-0 z-20 h-full' />}
                </div>
                {request?.imagesUrl && request.imagesUrl.length > 0 && (
                  <div className='mt-2'>
                    <p className='text-xs text-muted-foreground mb-1'>Current images:</p>
                    <div className='grid grid-cols-2 md:grid-cols-3 gap-4'>
                      {request.imagesUrl.map((imageUrl, index) => (
                        <div key={index} className='relative w-full h-48 rounded-md overflow-hidden border border-border group'>
                          <input
                            type="hidden" 
                            name="imagesUrl" 
                            value={imageUrl} 
                          />
                          <img 
                            src={imageUrl} 
                            alt={`Request image ${index + 1}`} 
                            className='object-contain w-full h-full'
                          />
                          <button
                            type="button"
                            onClick={() => handleImageRemove(imageUrl)}
                            className='absolute top-2 right-2 bg-black/70 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity'
                            aria-label="Remove image"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <line x1="18" y1="6" x2="6" y2="18"></line>
                              <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className='flex items-center space-x-2'>
                <div className='relative'>
                  <Checkbox
                    id='marketingConsent'
                    name='marketingConsent'
                    defaultChecked={request?.marketingConsent}
                    className={pending ? 'invisible' : ''}
                    onChange={(e) => {
                      setRequest({
                        ...request,
                        marketingConsent: (e.target as HTMLInputElement).checked,
                      })
                    }}
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
                    defaultChecked={request?.ecologyConsent}
                    className={pending ? 'invisible' : ''}
                    onChange={(e) => {
                      setRequest({
                        ...request,
                        ecologyConsent: (e.target as HTMLInputElement).checked,
                      })
                    }}
                  />
                  {pending && <Skeleton className='absolute inset-0 z-20 h-full' />}
                </div>
                <Label
                  htmlFor='ecologyConsent'
                  className='text-sm text-muted-foreground'
                >
                  Ecology Consent
                </Label>
              </div>
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
