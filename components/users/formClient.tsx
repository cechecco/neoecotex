'use client'

// Componente client che gestisce il form per la creazione o l'aggiornamento di un utente

import { useRouter } from 'next/navigation'
import { useState, FormEvent } from 'react'

import { updateUser } from '@/app/actions/users'
import FormField from '@/components/innovations/FormField'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { User } from '@/lib/types'

interface Props {
  user: User
}

export default function FormClient({ user }: Props) {
  const [userState, setUserState] = useState<User>(user)
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [validationErrors, setValidationError] = useState<Partial<Record<keyof User, string[]>> | false>(false)
  const router = useRouter()

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setPending(true)
    setError(null)
    const result = await updateUser(userState)
    console.log(result)
    if (result.error) {
      setError(result.message)
    } else if (result.validationErrors) {
      setValidationError(result.validationErrors)
    } else {
      router.push(`/signup/users`)
    }
    setPending(false)
  }

  return (
    <Card>
      <CardHeader>
        {JSON.stringify(userState)}
        <CardTitle>User Editor</CardTitle>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={handleSubmit}
          className='space-y-4'
        >
          {error && <p className='text-red-500'>{error}</p>}

          <FormField<User>
            id='email'
            label='Email'
            type='text'
            value={userState.email}
            pending={pending}
            validationError={validationErrors}
            onChange={(e) => setUserState({ ...userState, email: e.target.value })}
          />

          <FormField<User>
            id='name'
            label='Name'
            type='text'
            value={userState.name}
            pending={pending}
            validationError={validationErrors}
            onChange={(e) => setUserState({ ...userState, name: e.target.value })}
          />

          {userState.type === 'innovator' && (
            <>
              <FormField<User>
                id='surname'
                label='Surname'
                type='text'
                value={userState.surname}
                pending={pending}
                validationError={validationErrors}
                onChange={(e) => setUserState({ ...userState, surname: e.target.value })}
              />
              <FormField<User>
                id='country'
                label='Country'
                type='text'
                value={userState.country}
                pending={pending}
                validationError={validationErrors}
                onChange={(e) => setUserState({ ...userState, country: e.target.value })}
              />
              <FormField<User>
                id='city'
                label='City'
                type='text'
                value={userState.city}
                pending={pending}
                validationError={validationErrors}
                onChange={(e) => setUserState({ ...userState, city: e.target.value })}
              />
              <FormField<User>
                id='occupation'
                label='Occupation'
                type='text'
                value={userState.occupation}
                pending={pending}
                validationError={validationErrors}
                onChange={(e) => setUserState({ ...userState, occupation: e.target.value })}
              />
            </>
          )}

          {userState.type === 'requestor' && (
            <>
              <FormField<User>
                id='surname'
                label='Surname'
                type='text'
                value={userState.surname}
                pending={pending}
                validationError={validationErrors}
                onChange={(e) => setUserState({ ...userState, surname: e.target.value })}
              />
              <FormField<User>
                id='country'
                label='Country'
                type='text'
                value={userState.country}
                pending={pending}
                validationError={validationErrors}
                onChange={(e) => setUserState({ ...userState, country: e.target.value })}
              />
              <FormField<User>
                id='city'
                label='City'
                type='text'
                value={userState.city}
                pending={pending}
                validationError={validationErrors}
                onChange={(e) => setUserState({ ...userState, city: e.target.value })}
              />
              <FormField<User>
                id='companyName'
                label='Company Name'
                type='text'
                value={userState.companyName}
                pending={pending}
                validationError={validationErrors}
                onChange={(e) => setUserState({ ...userState, companyName: e.target.value })}
              />
              <FormField<User>
                id='companySize'
                label='Company Size'
                type='number'
                value={userState.companySize}
                pending={pending}
                validationError={validationErrors}
                onChange={(e) => setUserState({ ...userState, companySize: Number(e.target.value) })}
              />
            </>
          )}

          <div className='flex items-center gap-2 justify-end'>
            <Button
              variant='outline'
              type='button'
              onClick={() => router.back()}
              disabled={pending}
            >
              Cancel
            </Button>
            <Button
              variant='default'
              type='submit'
              disabled={pending}
            >
              Update
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
