'use client'

import { CheckedState } from '@radix-ui/react-checkbox'
import { AlertCircle } from 'lucide-react'

import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Skeleton } from '@/components/ui/skeleton'
import { Textarea } from '@/components/ui/textarea'

interface FormFieldProps<T> {
  id: keyof T
  label: string
  type?: 'text' | 'number' | 'textarea' | 'checkbox'
  maxLength?: number
  value: string | number | boolean | CheckedState
  pending: boolean
  validationError: Partial<Record<keyof T, string[]>> | false
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
}

export default function FormField<T>({ id, label, type = 'text', maxLength, value, pending, validationError, onChange }: FormFieldProps<T>) {
  const InputComponent = type === 'textarea' ? Textarea : Input
  const stringValue = typeof value === 'string' ? value : ''

  return (
    <div className='grid w-full items-center gap-1.5'>
      <Label
        htmlFor={id.toString()}
        className='flex items-center justify-between'
      >
        <div className='flex items-center gap-2 text-sm text-muted-foreground'>
          {label}
          {validationError && validationError[id] && (
            <Popover>
              <PopoverTrigger>
                <AlertCircle
                  className='w-4 h-4 text-red-500'
                  size={12}
                />
              </PopoverTrigger>
              <PopoverContent className='w-auto p-2'>
                <p className='text-red-500 text-sm'>{validationError[id]}</p>
              </PopoverContent>
            </Popover>
          )}
        </div>
        {maxLength && type !== 'checkbox' && (
          <p className='text-xs text-muted-foreground'>
            {stringValue?.length || 0} / {maxLength}
          </p>
        )}
      </Label>
      {type === 'checkbox' ? (
        <div className='flex items-center space-x-2'>
          <div className='relative'>
            <Checkbox
              id={id.toString()}
              name={id.toString()}
              defaultChecked={value as CheckedState}
              className={pending ? 'invisible' : ''}
              onCheckedChange={(checked) => {
                onChange({
                  target: { checked },
                } as React.ChangeEvent<HTMLInputElement>)
              }}
            />
            {pending && <Skeleton className='absolute inset-0 z-20 h-full' />}
          </div>
          <Label
            htmlFor={id.toString()}
            className='text-sm text-muted-foreground'
          >
            {label}
          </Label>
        </div>
      ) : (
        <div className='relative'>
          <InputComponent
            type={type !== 'textarea' ? type : undefined}
            id={id.toString()}
            name={id.toString()}
            defaultValue={value as string}
            className={pending ? 'invisible' : ''}
            maxLength={maxLength}
            onChange={onChange as (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void}
            autoComplete='off'
          />
          {pending && <Skeleton className='absolute inset-0 z-20 h-full' />}
        </div>
      )}
    </div>
  )
}
