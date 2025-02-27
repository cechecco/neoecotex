'use client'

import { Trophy, Copy } from 'lucide-react'
import { RequestChecks } from '@/lib/server/database'
interface Props {
  check: RequestChecks
  size?: 'sm' | 'md'
}

// Ora ricevi i dati già calcolati dal server
export default function WinnerEmailButton({ check, size = 'md' }: Props) {
    return (
      <>
      {check.iAmOwner ? (
        <p>You are the owner of this request</p>
      ) : null}
      {check.iAmWinner ? (
        <p>You are the winner of this request</p>
      ) : null}
      {check.iHaveSubmitted ? (
        <p>You have submitted a proposal for this request</p>
      ) : null}
      {check.thereIsWinner ? (
        <p>There is a winner for this request</p>
      ) : null}
      {check.winnerEmail ? (
        <p>The winner email is {check.winnerEmail}</p>
      ) : null}
      </>
    )
  }

