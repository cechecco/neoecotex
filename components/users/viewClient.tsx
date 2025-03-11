'use client'

// Componente client che mostra i dati di un utente
import { notFound } from 'next/navigation'
import React, { useEffect, useState } from 'react'

import { getUser } from '@/app/actions/users'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { InnovatorData, RequestorData, User } from '@/lib/types'

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

  if (userState.type === 'innovator') {
    const innovator = userState as InnovatorData

    return (
      <Card>
        <CardHeader>
          <CardTitle>{innovator.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <p>
            <strong>Email:</strong> {innovator.email}
          </p>
          <p>
            <strong>Name:</strong> {innovator.name}
          </p>
          <p>
            <strong>Surname:</strong> {innovator.surname}
          </p>
          <p>
            <strong>Country:</strong> {innovator.country}
          </p>
          <p>
            <strong>City:</strong> {innovator.city}
          </p>
          <p>
            <strong>Occupation:</strong> {innovator.occupation}
          </p>
        </CardContent>
      </Card>
    )
  }

  if (userState.type === 'requestor') {
    const requestor = userState as RequestorData
    return (
      <Card>
        <CardHeader>
          <CardTitle>{requestor.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <p>
            <strong>Email:</strong> {requestor.email}
          </p>
          <p>
            <strong>Name:</strong> {requestor.name}
          </p>
          <p>
            <strong>Surname:</strong> {requestor.surname}
          </p>
          <p>
            <strong>Country:</strong> {requestor.country}
          </p>
          <p>
            <strong>City:</strong> {requestor.city}
          </p>
          <p>
            <strong>Company Name:</strong> {requestor.companyName}
          </p>
          <p>
            <strong>Company Size:</strong> {requestor.companySize}
          </p>
        </CardContent>
      </Card>
    )
  }
}
