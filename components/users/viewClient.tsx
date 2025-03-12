'use client'

// Componente client che mostra i dati di un utente
import { notFound } from 'next/navigation'
import React, { useEffect, useState } from 'react'

import { getUser } from '@/app/actions/users'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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

  if (userState.type === 'requester') {
    const requester = userState as RequesterData
    return (
      <Card>
        <CardHeader>
          <CardTitle>{requester.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <p>
            <strong>Email:</strong> {requester.email}
          </p>
          <p>
            <strong>Name:</strong> {requester.name}
          </p>
          <p>
            <strong>Surname:</strong> {requester.surname}
          </p>
          <p>
            <strong>Country:</strong> {requester.country}
          </p>
          <p>
            <strong>City:</strong> {requester.city}
          </p>
          <p>
            <strong>Company Name:</strong> {requester.companyName}
          </p>
          <p>
            <strong>Company Size:</strong> {requester.companySize}
          </p>
        </CardContent>
      </Card>
    )
  }
}
