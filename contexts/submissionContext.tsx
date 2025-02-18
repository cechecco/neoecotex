'use client'

import { Submission, SubmissionWithStringId } from '@/lib/types'
import { createContext, useContext, ReactNode, useState } from 'react'

interface SubmissionContextType {
  submission: Submission | SubmissionWithStringId
  setSubmission: (submission: Submission | SubmissionWithStringId) => void
}

const SubmissionContext = createContext<SubmissionContextType | undefined>(undefined)

export function SubmissionProvider({ children, initialSubmission }: { children: ReactNode; initialSubmission: Submission | SubmissionWithStringId }) {
  const [submission, setSubmission] = useState(initialSubmission)

  return <SubmissionContext.Provider value={{ submission, setSubmission }}>{children}</SubmissionContext.Provider>
}

export function useSubmission() {
  const context = useContext(SubmissionContext)
  if (context === undefined) {
    throw new Error('useSubmission must be used within a SubmissionProvider')
  }
  return context
}
