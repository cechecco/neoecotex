'use client'

import { Models } from 'node-appwrite'
import { createContext, useContext, ReactNode, useState } from 'react'

interface UserContextType {
  user: Models.User<Models.Preferences> | null
  setUser: (user: Models.User<Models.Preferences> | null) => void
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children, initialUser }: { children: ReactNode; initialUser: Models.User<Models.Preferences> | null }) {
  const [user, setUser] = useState(initialUser)

  return <UserContext.Provider value={{ user, setUser }}>{children}</UserContext.Provider>
}

export function useUser() {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider')
  }
  return context
}
