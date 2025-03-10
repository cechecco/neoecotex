'use client'

import { AlertCircle } from 'lucide-react'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Skeleton } from '@/components/ui/skeleton'

type ImageUploaderProps = {
  maxImages: number
  imagesIds: string[]
  pending: boolean
  imagesValidationErrors?: Partial<Record<string, string[]>> | false
  imagesUrl: Record<string, string>
  onImageRemove: (imageUrl: string) => void
  onNewImageRemove: (index: number) => void
  onImagesAdd: (files: File[]) => void
  newImages: { file: File; preview: string }[]
}

export default function ImageUploader({
  maxImages,
  imagesIds,
  imagesUrl,
  pending = false,
  imagesValidationErrors,
  onImageRemove,
  onNewImageRemove,
  onImagesAdd,
  newImages,
}: ImageUploaderProps) {
  
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    const availableSlots = maxImages - imagesIds.length - newImages.length
    if (availableSlots <= 0) return

    const filesToProcess = Array.from(files).slice(0, availableSlots)
    onImagesAdd(filesToProcess)
  }

  return (
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
              <PopoverContent className='w-auto p-2'>
                {imagesValidationErrors.images.map((error, index) => (
                  <p
                    key={index}
                    className='text-red-500 text-sm'
                  >
                    {error}
                  </p>
                ))}
              </PopoverContent>
            </Popover>
          )}
        </div>
        <p className='text-xs text-muted-foreground'>
          {imagesIds.length + newImages.length}/{maxImages} images
        </p>
      </Label>
      <div className='relative'>
        <div
          className={`border-2 border-dashed rounded-md p-6 ${pending ? 'invisible' : ''} 
                     flex flex-col items-center justify-center cursor-pointer
                     ${imagesIds.length + newImages.length >= maxImages ? 'opacity-50 cursor-not-allowed' : 'hover:border-primary hover:bg-secondary/20'}`}
          onDragOver={(e) => {
            e.preventDefault()
            e.stopPropagation()
            if (imagesIds.length + newImages.length < maxImages) {
              e.currentTarget.classList.add('border-primary', 'bg-secondary/20')
            }
          }}
          onDragLeave={(e) => {
            e.preventDefault()
            e.stopPropagation()
            e.currentTarget.classList.remove('border-primary', 'bg-secondary/20')
          }}
          onDrop={(e) => {
            e.preventDefault()
            e.stopPropagation()
            e.currentTarget.classList.remove('border-primary', 'bg-secondary/20')

            const availableSlots = maxImages - imagesIds.length - newImages.length
            if (availableSlots <= 0) return

            const files = Array.from(e.dataTransfer.files).filter((file) => file.type.startsWith('image/'))

            if (files.length > 0) {
              const allowedFiles = files.slice(0, availableSlots)
              onImagesAdd(allowedFiles)
            }
          }}
          onClick={() => {
            if (imagesIds.length + newImages.length < maxImages) {
              document.getElementById('images-input')?.click()
            }
          }}
          onPaste={(e) => {
            e.preventDefault()
            const availableSlots = maxImages - imagesIds.length - newImages.length
            if (availableSlots <= 0) return

            const items = e.clipboardData.items
            let addedImages = 0
            const files: File[] = []

            for (let i = 0; i < items.length && addedImages < availableSlots; i++) {
              if (items[i].type.indexOf('image') !== -1) {
                const file = items[i].getAsFile()
                if (file) {
                  files.push(file)
                  addedImages++
                }
              }
            }
            
            if (files.length > 0) {
              onImagesAdd(files)
            }
          }}
          tabIndex={0}
        >
          <div className='flex flex-col items-center justify-center gap-2'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className='h-10 w-10 text-muted-foreground'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={1.5}
                d='M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z'
              />
            </svg>
            <p className='text-sm text-muted-foreground font-medium'>Click to upload, drag and drop, or paste images</p>
            <p className='text-xs text-muted-foreground'>PNG, JPG, GIF up to 10MB</p>
          </div>
          <Input
            id='images-input'
            type='file'
            multiple
            accept='image/jpeg, image/png, image/jpg'
            className='sr-only'
            disabled={imagesIds.length + newImages.length >= maxImages}
            onChange={handleImageUpload}
          />
        </div>
        {pending && <Skeleton className='absolute inset-0 z-20 h-full' />}
      </div>

      {/* New Image Previews */}
      {newImages.length > 0 && (
        <div className='mt-2'>
          <p className='text-xs text-muted-foreground mb-1'>New images to upload:</p>
          <div className='grid grid-cols-2 md:grid-cols-3 gap-4'>
            {newImages.map((image, index) => (
              <div
                key={`new-${index}`}
                className='relative w-full h-48 rounded-md overflow-hidden border border-border group'
              >
                <img
                  src={image.preview}
                  alt={`New image ${index + 1}`}
                  className='object-contain w-full h-full'
                />
                <button
                  type='button'
                  onClick={() => onNewImageRemove(index)}
                  className='absolute top-2 right-2 bg-black/70 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity'
                  aria-label='Remove image'
                >
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    width='16'
                    height='16'
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='currentColor'
                    strokeWidth='2'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  >
                    <line
                      x1='18'
                      y1='6'
                      x2='6'
                      y2='18'
                    ></line>
                    <line
                      x1='6'
                      y1='6'
                      x2='18'
                      y2='18'
                    ></line>
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Existing Images */}
      {imagesIds.length > 0 && (
        <div className='mt-2'>
          <p className='text-xs text-muted-foreground mb-1'>Current images:</p>
          <div className='grid grid-cols-2 md:grid-cols-3 gap-4'>
            {imagesIds.map((imageId: string, index: number) => (
              <div
                key={index}
                className='relative w-full h-48 rounded-md overflow-hidden border border-border group'
              >
                <input
                  type='hidden'
                  name='imagesIds'
                  value={imageId}
                />
                <img
                  src={imagesUrl[imageId]}
                  alt={`Request image ${index + 1}`}
                  className='object-contain w-full h-full'
                />
                <button
                  type='button'
                  onClick={() => onImageRemove(imageId)}
                  className='absolute top-2 right-2 bg-black/70 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity'
                  aria-label='Remove image'
                >
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    width='16'
                    height='16'
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='currentColor'
                    strokeWidth='2'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  >
                    <line
                      x1='18'
                      y1='6'
                      x2='6'
                      y2='18'
                    ></line>
                    <line
                      x1='6'
                      y1='6'
                      x2='18'
                      y2='18'
                    ></line>
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
} 