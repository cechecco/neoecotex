'use client'

import Link from 'next/link'
import { useState } from 'react'

import { signUpWithGoogle, signUpWithEmail } from '@/app/actions/auth'
import FormField from '@/components/innovations/FormField'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardContent } from '@/components/ui/card'

interface SignUpForm {
  name: string
  email: string
  password: string
}

export default function SignUpFormClient({ type }: { type: string }) {
  const [signupData, setSignupData] = useState<SignUpForm>({
    name: '',
    email: '',
    password: '',
  })
  const [validationError, setValidationError] = useState<Partial<Record<keyof SignUpForm, string[]>> | false>(false)
  const [pending, setPending] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setValidationError(false)
    setPending(true)

    const formData = new FormData(e.target as HTMLFormElement)
    formData.append('type', type)

    const result = await signUpWithEmail(formData)

    if (result.validationErrors) {
      setValidationError(result.validationErrors)
    }

    setPending(false)
  }

  return (
    <Card className='w-full max-w-md p-6'>
      <CardHeader className='space-y-1'>
        <h2 className='text-2xl font-semibold text-center'>Create an account</h2>
        <p className='text-sm text-muted-foreground text-center'>Enter your details below to create your account</p>
      </CardHeader>
      <CardContent className='space-y-4'>
        <form
          onSubmit={handleSubmit}
          className='space-y-4'
        >
          <FormField<SignUpForm>
            id='name'
            label='Name'
            type='text'
            value={signupData.name}
            pending={pending}
            validationError={validationError}
            onChange={(e) => {
              setSignupData({
                ...signupData,
                name: 'target' in e ? e.target.value : e.value,
              })
            }}
          />

          <FormField<SignUpForm>
            id='email'
            label='Email'
            type='text'
            value={signupData.email}
            pending={pending}
            validationError={validationError}
            onChange={(e) => {
              setSignupData({
                ...signupData,
                email: 'target' in e ? e.target.value : e.value,
              })
            }}
          />

          <FormField<SignUpForm>
            id='password'
            label='Password'
            type='password'
            value={signupData.password}
            pending={pending}
            validationError={validationError}
            onChange={(e) => {
              setSignupData({
                ...signupData,
                password: 'target' in e ? e.target.value : e.value,
              })
            }}
          />

          <Button
            type='submit'
            className='w-full'
            disabled={pending}
          >
            Sign up
          </Button>
        </form>

        <div className='flex items-center justify-center'>
          <div className='w-full h-[1px] bg-gray-200'></div>
          <span className='mx-4 text-gray-500'>OR</span>
          <div className='w-full h-[1px] bg-gray-200'></div>
        </div>

        <form
          action={async (formData) => {
            formData.append('type', type)
            await signUpWithGoogle(formData)
          }}
          className='w-full'
        >
          <Button
            variant='outline'
            className='w-full'
            type='submit'
            disabled={pending}
          >
            <svg
              className='w-5 h-5 mr-2'
              viewBox='0 0 24 24'
            >
              <path
                d='M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z'
                fill='#4285F4'
              />
              <path
                d='M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z'
                fill='#34A853'
              />
              <path
                d='M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z'
                fill='#FBBC05'
              />
              <path
                d='M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z'
                fill='#EA4335'
              />
            </svg>
            Sign up with Google
          </Button>
        </form>
      </CardContent>
      <div className='text-center mt-4'>
        <p className='text-sm text-muted-foreground'>
          Already have an account?{' '}
          <Link
            href='/login'
            className='text-primary hover:underline'
          >
            Sign in
          </Link>
        </p>
      </div>
    </Card>
  )
}
