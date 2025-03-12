'use client'

// Componente client che mostra i dati di un utente
import { Mail, Briefcase, Building, Users, MapPin } from 'lucide-react'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import React, { useEffect, useState } from 'react'

import { getUser } from '@/app/actions/users'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getImagesUrl } from '@/lib/client/appwrite'
import { InnovatorData, RequesterData, User } from '@/lib/types'

export default function ViewClient({ user }: { user: User }) {
  const [userState, setUserState] = useState<User>(user)

  useEffect(() => {
    const fetchUser = async () => {
      const fetchedUser = await getUser()
      if (!fetchedUser || 'error' in fetchedUser) {
        return notFound()
      }
      setUserState(fetchedUser)
    }
    fetchUser()
  }, [])

  const [images, setImages] = useState<Record<string, string>>({})
  useEffect(() => {
    getImagesUrl(userState.imagesIds).then(setImages)
  }, [userState.imagesIds])

  if (userState.type === 'innovator') {
    const innovator = userState as InnovatorData

    return (
      <Card className='min-h-screen'>
        <CardHeader className='flex flex-col items-left gap-2'>
          <CardTitle>
            {userState.name} {userState.surname}
          </CardTitle>
        </CardHeader>
        <CardContent className='flex gap-2'>
          {Object.keys(images).length > 0 &&
            userState.imagesIds.map((imageId) => (
              <Image
                key={imageId}
                src={images[imageId]}
                alt={userState.name}
                width={1200}
                height={300}
                className='w-48 h-48 object-cover object-center'
                priority
              />
            ))}
          <div>
            <div className='flex items-center gap-2'>
              <Mail className='h-4 w-4 text-muted-foreground' />
              <span>{innovator.email}</span>
            </div>

            <div className='flex items-center gap-2'>
              <MapPin className='h-4 w-4 text-muted-foreground' />
              <span>
                {innovator.city}, {innovator.country}
              </span>
            </div>

            <div className='flex items-center gap-2'>
              <Briefcase className='h-4 w-4 text-muted-foreground' />
              <span>{innovator.occupation}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (userState.type === 'requester') {
    const requester = userState as RequesterData
    return (
      <Card>
        <CardHeader className='flex flex-col items-left gap-2'>
          {Object.keys(images).length > 0 &&
            userState.imagesIds.map((imageId) => (
              <Image
                key={imageId}
                src={images[imageId]}
                alt={userState.name}
                width={1200}
                height={300}
                className='w-48 h-48 object-cover object-center'
                priority
              />
            ))}
          <CardTitle>
            {userState.name} {userState.surname}
          </CardTitle>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='flex items-center gap-2'>
            <Mail className='h-4 w-4 text-muted-foreground' />
            <span>{requester.email}</span>
          </div>

          <div className='flex items-center gap-3'>
            <MapPin className='h-4 w-4 text-muted-foreground' />
            <span>
              {requester.city}, {requester.country}
            </span>
          </div>

          <div className='flex items-center gap-2'>
            <Building className='h-4 w-4 text-muted-foreground' />
            <span>{requester.companyName}</span>
          </div>

          <div className='flex items-center gap-2'>
            <Users className='h-4 w-4 text-muted-foreground' />
            <span>{requester.companySize}</span>
          </div>
        </CardContent>
      </Card>
    )
  }
}
