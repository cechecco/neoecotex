'use client'

// Componente client che gestisce il form per la creazione o l'aggiornamento di un utente

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState, FormEvent, useEffect } from 'react'

import { updateUser } from '@/app/actions/users'
import FormField from '@/components/innovations/FormField'
import ImageUploader from '@/components/innovations/ImageUploader'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { getImagesUrl } from '@/lib/client/appwrite'
import { User } from '@/lib/types'
interface Props {
  user: User
}

export default function FormClient({ user }: Props) {
  const [userState, setUserState] = useState<User>(user)
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [validationErrors, setValidationError] = useState<Partial<Record<keyof User, string[]>> | false>(false)
  const [imagesValidationErrors, setImagesValidationErrors] = useState<Partial<Record<keyof User, string[]>> | false>(false)
  const [imagesUrl, setImagesUrl] = useState<Record<string, string>>({})
  const [newImages, setNewImages] = useState<{ file: File; preview: string }[]>([])
  const router = useRouter()

  const maxImages = 1

  useEffect(() => {
    const fetchImagesUrl = async () => {
      if (userState.imagesIds && userState.imagesIds.length > 0) {
        const imagesUrl = await getImagesUrl(userState.imagesIds)
        setImagesUrl(imagesUrl)
      }
    }
    fetchImagesUrl()
  }, [userState.imagesIds])

  useEffect(() => {
    return () => {
      newImages.forEach((image) => URL.revokeObjectURL(image.preview))
    }
  }, [newImages])

  const handleImageRemove = (imageId: string | undefined) => {
    if (!imageId) return
    setUserState({
      ...userState,
      imagesIds: userState.imagesIds ? userState.imagesIds.filter((id) => id !== imageId) : [],
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

  async function handleSubmit(e: FormEvent) {
    console.log('handleSubmit')
    e.preventDefault()
    setPending(true)
    setError(null)
    setValidationError(false)
    setImagesValidationErrors(false)

    const wasAlreadyActive = userState.active

    const formData = new FormData(e.target as HTMLFormElement)

    newImages.forEach((image) => {
      formData.append('images', image.file)
    })

    const result = await updateUser(formData)
    console.log(result)

    if (result.error) {
      setError(result.message)
    } else if (result.validationErrors) {
      setValidationError(result.validationErrors)
    } else if (result.imagesValidationErrors) {
      setImagesValidationErrors(result.imagesValidationErrors)
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
            <FormField<User>
              id='surname'
              label='Surname'
              type='text'
              value={userState.surname}
              pending={pending}
              validationError={validationErrors}
              onChange={(e) => setUserState({ ...userState, surname: 'target' in e ? e.target.value : e.value })}
            />
            <ImageUploader
              maxImages={maxImages}
              imagesIds={userState.imagesIds || []}
              imagesUrl={imagesUrl}
              pending={pending}
              imagesValidationErrors={imagesValidationErrors}
              onImageRemove={handleImageRemove}
              onNewImageRemove={handleNewImageRemove}
              onImagesAdd={handleImagesAdd}
              newImages={newImages}
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
            {userState.type === 'innovator' && (
              <>
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
