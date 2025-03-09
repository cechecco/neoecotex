'use client'

import { AlertCircle } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'

import { deleteRequest, updateRequest } from '@/app/actions/innovations'
import { Button } from '@/components/ui/button'
import { Card, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { Textarea } from '@/components/ui/textarea'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Request, RequestData } from '@/lib/types'
import { getImagesUrl } from '@/lib/client/appwrite'

export default function FormClient({ 
  initialRequest, 
  requestId, 
  maxImages = 1 // Default max images if not specified
}: { 
  initialRequest: RequestData; 
  requestId: string | undefined;
  maxImages?: number;
}) {
  const [request, setRequest] = useState<RequestData>(initialRequest)
  const [validationError, setValidationError] = useState<Partial<Record<keyof Request, string[]>> | false>(false)
  const [imagesValidationErrors, setImagesValidationErrors] = useState<Partial<Record<keyof Request, string[]>> | false>(false)
  const [fetchError, setFetchError] = useState<string | false>(false)
  const [pending, setPending] = useState(false)
  
  // Track images that should be removed
  const [imagesToRemove, setImagesToRemove] = useState<string[]>([])
  // Track new images previews
  const [newImagePreviews, setNewImagePreviews] = useState<{file: File, preview: string}[]>([])

  // Scroll to error when validation errors are set
  useEffect(() => {
    if (validationError) {
      // Get the first field with an error
      const firstErrorField = Object.keys(validationError)[0] as keyof Request;
      if (firstErrorField) {
        // Find the DOM element for that field
        const errorElement = document.getElementById(firstErrorField as string);
        if (errorElement) {
          // Scroll to the element with smooth behavior
          errorElement.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center' 
          });
        }
      }
    } else if (imagesValidationErrors) {
      // If there are only image validation errors
      const imagesInput = document.getElementById('images-input');
      if (imagesInput) {
        imagesInput.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center' 
        });
      }
    }
  }, [validationError, imagesValidationErrors]);

  const handleImageRemove = (imageUrl: string | undefined) => {
    if (!imageUrl) return
    setImagesToRemove(prev => [...prev, imageUrl]);
    setRequest({
      ...request,
      imagesUrl: request.imagesUrl.filter(url => url !== imageUrl)
    });
  }
  
  const handleNewImageRemove = (index: number) => {
    setNewImagePreviews(prev => prev.filter((_, i) => i !== index));
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    // Limit the number of new images to maxImages - existing images
    const availableSlots = maxImages - request.imagesUrl.length - newImagePreviews.length;
    if (availableSlots <= 0) return;
    
    // Only process files up to the available slots
    const filesToProcess = Array.from(files).slice(0, availableSlots);
    
    // Create previews for new images
    const newPreviews = filesToProcess.map(file => ({
      file,
      preview: URL.createObjectURL(file)
    }));
    
    setNewImagePreviews(prev => [...prev, ...newPreviews]);
  }
  
  // Clean up object URLs to avoid memory leaks
  useEffect(() => {
    return () => {
      newImagePreviews.forEach(preview => URL.revokeObjectURL(preview.preview));
    };
  }, [newImagePreviews]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setValidationError(false)
    setFetchError(false)
    setPending(true)

    const formData = new FormData(e.target as HTMLFormElement)
    
    // Manually append the new image files to the FormData
    newImagePreviews.forEach(preview => {
      formData.append('images', preview.file)
    })
    
    const result = await updateRequest(requestId, formData)
    if (result.error) {
      setFetchError(result.error)
    }  else if (result.request) {
      setRequest(result.request)
      // Reset images to remove and new previews after successful update
      setImagesToRemove([]);
      setNewImagePreviews([]);
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

  const [images, setImages] = useState<Record<string, string>>({})
  useEffect(() => {
    getImagesUrl(request.imagesUrl).then(setImages)
  }, [request.imagesUrl])

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
              <div className='grid w-full items-center gap-1.5'>
                <Label
                  htmlFor='title'
                  className='flex items-center justify-between'
                >
                  <div className='flex items-center gap-2 text-sm text-muted-foreground'>
                    Title
                    {validationError && validationError.title && (
                      <Popover>
                        <PopoverTrigger>
                          <AlertCircle
                            className='w-4 h-4 text-red-500'
                            size={12}
                          />
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-2">
                          <p className='text-red-500 text-sm'>{validationError.title}</p>
                        </PopoverContent>
                      </Popover>
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
                      <Popover>
                        <PopoverTrigger>
                          <AlertCircle
                            className='w-4 h-4 text-red-500'
                            size={12}
                          />
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-2">
                          <p className='text-red-500 text-sm'>{validationError.briefDescription}</p>
                        </PopoverContent>
                      </Popover>
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
                      <Popover>
                        <PopoverTrigger>
                          <AlertCircle
                            className='w-4 h-4 text-red-500'
                            size={12}
                          />
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-2">
                          <p className='text-red-500 text-sm'>{validationError.detailedDescription}</p>
                        </PopoverContent>
                      </Popover>
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
                      <Popover>
                        <PopoverTrigger>
                          <AlertCircle
                            className='w-4 h-4 text-red-500'
                            size={12}
                          />
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-2">
                          <p className='text-red-500 text-sm'>{validationError.expectedExpertise}</p>
                        </PopoverContent>
                      </Popover>
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
                      <Popover>
                        <PopoverTrigger>
                          <AlertCircle
                            className='w-4 h-4 text-red-500'
                            size={12}
                          />
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-2">
                          <p className='text-red-500 text-sm'>{validationError.expectedTimeline}</p>
                        </PopoverContent>
                      </Popover>
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
                      <Popover>
                        <PopoverTrigger>
                          <AlertCircle
                            className='w-4 h-4 text-red-500'
                            size={12}
                          />
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-2">
                          <p className='text-red-500 text-sm'>{validationError.company}</p>
                        </PopoverContent>
                      </Popover>
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
                      <Popover>
                        <PopoverTrigger>
                          <AlertCircle
                            className='w-4 h-4 text-red-500'
                            size={12}
                          />
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-2">
                          <p className='text-red-500 text-sm'>{validationError.budget}</p>
                        </PopoverContent>
                      </Popover>
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
                      <Popover>
                        <PopoverTrigger>
                          <AlertCircle
                            className='w-4 h-4 text-red-500'
                            size={12}
                          />
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-2">
                          <p className='text-red-500 text-sm'>{validationError.concept}</p>
                        </PopoverContent>
                      </Popover>
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
                      <Popover>
                        <PopoverTrigger>
                          <AlertCircle
                            className='w-4 h-4 text-red-500'
                            size={12}
                          />
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-2">
                          <p className='text-red-500 text-sm'>{validationError.field}</p>
                        </PopoverContent>
                      </Popover>
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
                    Image
                    {imagesValidationErrors && imagesValidationErrors.images && (
                      <Popover>
                        <PopoverTrigger>
                          <AlertCircle
                            className='w-4 h-4 text-red-500'
                            size={12}
                          />
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-2">
                          {imagesValidationErrors.images.map((error, index) => (
                            <p key={index} className='text-red-500 text-sm'>{error}</p>
                          ))}
                        </PopoverContent>
                      </Popover>
                    )}
                  </div>
                  <p className='text-xs text-muted-foreground'>
                    {request.imagesUrl.length + newImagePreviews.length}/{maxImages} images
                  </p>
                </Label>
                <div className='relative'>
                  <div 
                    className={`border-2 border-dashed rounded-md p-6 ${pending ? 'invisible' : ''} 
                               flex flex-col items-center justify-center cursor-pointer
                               ${request.imagesUrl.length + newImagePreviews.length >= maxImages ? 'opacity-50 cursor-not-allowed' : 'hover:border-primary hover:bg-secondary/20'}`}
                    onDragOver={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      if (request.imagesUrl.length + newImagePreviews.length < maxImages) {
                        e.currentTarget.classList.add('border-primary', 'bg-secondary/20');
                      }
                    }}
                    onDragLeave={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      e.currentTarget.classList.remove('border-primary', 'bg-secondary/20');
                    }}
                    onDrop={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      e.currentTarget.classList.remove('border-primary', 'bg-secondary/20');
                      
                      const availableSlots = maxImages - request.imagesUrl.length - newImagePreviews.length;
                      if (availableSlots <= 0) return;
                      
                      const files = Array.from(e.dataTransfer.files).filter(file => 
                        file.type.startsWith('image/')
                      );
                      
                      if (files.length > 0) {
                        const allowedFiles = files.slice(0, availableSlots);
                        
                        const newPreviews = allowedFiles.map(file => ({
                          file,
                          preview: URL.createObjectURL(file)
                        }));
                        
                        setNewImagePreviews(prev => [...prev, ...newPreviews]);
                      }
                    }}
                    onClick={() => {
                      if (request.imagesUrl.length + newImagePreviews.length < maxImages) {
                        document.getElementById('images-input')?.click();
                      }
                    }}
                    onPaste={(e) => {
                      e.preventDefault();
                      const availableSlots = maxImages - request.imagesUrl.length - newImagePreviews.length;
                      if (availableSlots <= 0) return;
                      
                      const items = e.clipboardData.items;
                      let addedImages = 0;
                      
                      for (let i = 0; i < items.length && addedImages < availableSlots; i++) {
                        if (items[i].type.indexOf('image') !== -1) {
                          const file = items[i].getAsFile();
                          if (file) {
                            const newPreview = {
                              file,
                              preview: URL.createObjectURL(file)
                            };
                            setNewImagePreviews(prev => [...prev, newPreview]);
                            addedImages++;
                          }
                        }
                      }
                    }}
                    tabIndex={0}
                  >
                    <div className="flex flex-col items-center justify-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <p className="text-sm text-muted-foreground font-medium">
                        Click to upload, drag and drop, or paste images
                      </p>
                      <p className="text-xs text-muted-foreground">
                        PNG, JPG, GIF up to 10MB
                      </p>
                    </div>
                    <Input
                      id="images-input"
                      type='file'
                      name='images'
                      multiple
                      className='sr-only'
                      disabled={request.imagesUrl.length + newImagePreviews.length >= maxImages}
                      onChange={handleImageUpload}
                    />
                  </div>
                  {pending && <Skeleton className='absolute inset-0 z-20 h-full' />}
                </div>
                {imagesToRemove.map((imageUrl, index) => (
                  <input
                    key={index}
                    type="hidden"
                    name="imagesToRemove"
                    value={imageUrl}
                  />
                ))}
                
                {/* New Image Previews */}
                {newImagePreviews.length > 0 && (
                  <div className='mt-2'>
                    <p className='text-xs text-muted-foreground mb-1'>New images to upload:</p>
                    <div className='grid grid-cols-2 md:grid-cols-3 gap-4'>
                      {newImagePreviews.map((preview, index) => (
                        <div key={`new-${index}`} className='relative w-full h-48 rounded-md overflow-hidden border border-border group'>
                          <img 
                            src={preview.preview} 
                            alt={`New image ${index + 1}`} 
                            className='object-contain w-full h-full'
                          />
                          <button
                            type="button"
                            onClick={() => handleNewImageRemove(index)}
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
                
                {/* Existing Images */}
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
                            src={images[imageUrl]} 
                            alt={`Request image ${index + 1}`} 
                            className='object-contain w-full h-full'
                          />
                          <button
                            type="button"
                            onClick={() => handleImageRemove(imageUrl)}
                            className='absolute top-2 right-2 bg-black/70 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity'
                            aria-label="Remove image"
                          >
                            <p>{imageUrl}</p>
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
