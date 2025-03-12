'use client'

// Componente client che gestisce il form per la creazione o l'aggiornamento di un utente

import Link from 'next/link'
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
    console.log('handleSubmit')
    e.preventDefault()
    setPending(true)
    setError(null)
    const wasAlreadyActive = userState.active
    const result = await updateUser(userState)
    console.log(result)
    if (result.error) {
      setError(result.message)
    } else if (result.validationErrors) {
      setValidationError(result.validationErrors)
    } else {
      if (wasAlreadyActive) {
        router.push(`/account`)
      } else {
        router.push(`/innovations/requests`)
      }
    }
    setPending(false)
  }

  return (
    <Card>
      <CardHeader>
        <form
          onSubmit={handleSubmit}
          className='space-y-4'
        >
          <CardTitle>
            <div className='flex items-center justify-between gap-2 w-full border border-secondary bg-secondary/20 p-4 rounded-md'>
              <p className='flex items-center gap-2 font-bold'>Apply changes</p>
              <div className='flex items-center gap-2'>
                <Button
                  variant='outline'
                  disabled={pending || !userState.active}
                  size='sm'
                >
                  <Link href={`/account`}>Discard</Link>
                </Button>
                <Button
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
          <CardContent>
            {error && <p className='text-red-500'>{error}</p>}

            <FormField<User>
              id='email'
              label='Email'
              type='text'
              value={userState.email}
              pending={pending}
              validationError={validationErrors}
              disabled={true}
              onChange={(e) => setUserState({ ...userState, email: 'target' in e ? e.target.value : e.value })}
            />

            <FormField<User>
              id='name'
              label='Name'
              type='text'
              value={userState.name}
              pending={pending}
              validationError={validationErrors}
              onChange={(e) => setUserState({ ...userState, name: 'target' in e ? e.target.value : e.value })}
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
                  onChange={(e) => setUserState({ ...userState, surname: 'target' in e ? e.target.value : e.value })}
                />
                <FormField<User>
                  id='country'
                  label='Country'
                  type='text'
                  value={userState.country}
                  pending={pending}
                  validationError={validationErrors}
                  onChange={(e) => setUserState({ ...userState, country: 'target' in e ? e.target.value : e.value })}
                />
                <FormField<User>
                  id='city'
                  label='City'
                  type='text'
                  value={userState.city}
                  pending={pending}
                  validationError={validationErrors}
                  onChange={(e) => setUserState({ ...userState, city: 'target' in e ? e.target.value : e.value })}
                />
                <FormField<User>
                  id='occupation'
                  label='Occupation'
                  type='text'
                  value={userState.occupation}
                  pending={pending}
                  validationError={validationErrors}
                  onChange={(e) => setUserState({ ...userState, occupation: 'target' in e ? e.target.value : e.value })}
                />
              </>
            )}

            {userState.type === 'requester' && (
              <>
                <FormField<User>
                  id='surname'
                  label='Surname'
                  type='text'
                  value={userState.surname}
                  pending={pending}
                  validationError={validationErrors}
                  onChange={(e) => setUserState({ ...userState, surname: 'target' in e ? e.target.value : e.value })}
                />
                <FormField<User>
                  id='country'
                  label='Country'
                  type='text'
                  value={userState.country}
                  pending={pending}
                  validationError={validationErrors}
                  onChange={(e) => setUserState({ ...userState, country: 'target' in e ? e.target.value : e.value })}
                />
                <FormField<User>
                  id='city'
                  label='City'
                  type='text'
                  value={userState.city}
                  pending={pending}
                  validationError={validationErrors}
                  onChange={(e) => setUserState({ ...userState, city: 'target' in e ? e.target.value : e.value })}
                />
                <FormField<User>
                  id='companyName'
                  label='Company Name'
                  type='text'
                  value={userState.companyName}
                  pending={pending}
                  validationError={validationErrors}
                  onChange={(e) => setUserState({ ...userState, companyName: 'target' in e ? e.target.value : e.value })}
                />
                <FormField<User>
                  id='companySize'
                  label='Company Size'
                  type='number'
                  value={userState.companySize}
                  pending={pending}
                  validationError={validationErrors}
                  onChange={(e) => setUserState({ ...userState, companySize: Number('target' in e ? e.target.value : e.value) })}
                />
              </>
            )}
          </CardContent>
        </form>
      </CardHeader>
    </Card>
  )
}
