'use client'

import React, { createContext, useContext, useState } from 'react'

import { Request, RequestChecksMap } from '@/lib/types'

// Mappa: numero di pagina -> array di Request
type RequestsPagesMap = {
  [page: number]: Request[]
}

// Mappa: numero di pagina -> checks per quella pagina
type ChecksPagesMap = {
  [page: number]: RequestChecksMap
}

type StoreState = {
  // Memorizza le requests, indicizzate per pagina
  requestsPages: RequestsPagesMap
  checksPages: ChecksPagesMap

  setRequestsPages: React.Dispatch<React.SetStateAction<RequestsPagesMap>>
  setChecksPages: React.Dispatch<React.SetStateAction<ChecksPagesMap>>

  // Se vuoi, puoi tenere l'informazione sulla pagina corrente qui
  currentPage: number
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>

  currentRequestChecks: RequestChecksMap | null
  setCurrentRequestChecks: React.Dispatch<React.SetStateAction<RequestChecksMap | null>>
}

const StoreContext = createContext<StoreState | null>(null)

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [requestsPages, setRequestsPages] = useState<RequestsPagesMap>({})
  const [checksPages, setChecksPages] = useState<ChecksPagesMap>({})

  // Per comodità, potremmo tenere anche lo stato della pagina corrente qui dentro
  const [currentPage, setCurrentPage] = useState(1)

  const [currentRequestChecks, setCurrentRequestChecks] = useState<RequestChecksMap | null>(null)

  return (
    <StoreContext.Provider
      value={{
        requestsPages,
        checksPages,
        setRequestsPages,
        setChecksPages,
        currentPage,
        setCurrentPage,
        currentRequestChecks,
        setCurrentRequestChecks,
      }}
    >
      {children}
    </StoreContext.Provider>
  )
}

export function useStore() {
  const context = useContext(StoreContext)
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider')
  }
  return context
}
