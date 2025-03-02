import { redirect } from 'next/navigation'

import { signUpWithGoogle, signUpWithEmail, getLoggedInUser } from '@/app/actions/auth'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card'
import { Input } from '@/components/ui/input'

export default async function SignUpPage() {
  const user = await getLoggedInUser()
  if (user) redirect('/account')

  return (
    <div className='flex items-start mt-8 justify-center min-h-screen'>
      <Card className='w-full max-w-md p-6'>
        <CardHeader className='space-y-1'>
          <h2 className='text-2xl font-semibold text-center'>Create an account</h2>
          <p className='text-sm text-muted-foreground text-center'>Enter your details below to create your account</p>
        </CardHeader>
        <CardContent className='space-y-4'>
          <form
            action={signUpWithEmail}
            className='space-y-4'
          >
            <Input
              id='email'
              name='email'
              placeholder='Email'
              type='email'
              required
            />
            <Input
              id='password'
              name='password'
              placeholder='Password'
              minLength={8}
              type='password'
              required
            />
            <Input
              id='name'
              name='name'
              placeholder='Name'
              type='text'
              required
            />
            <Button
              type='submit'
              className='w-full'
            >
              Sign up
            </Button>
          </form>
        </CardContent>
        <CardFooter>
          <form
            action={signUpWithGoogle}
            className='w-full'
          >
            <Button
              variant='outline'
              className='w-full'
              type='submit'
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
        </CardFooter>
      </Card>
    </div>
  )
}
