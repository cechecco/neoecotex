'use client'

import { RequestCheck } from '@/lib/types'
interface Props {
  check: RequestCheck
  size?: 'sm' | 'md'
}

export default function RequestStatus({ check }: Props) {
  return (
    <>
      {check.iAmOwner ? <p>You are the owner of this request</p> : null}
      {check.iAmWinner ? <p>You are the winner of this request</p> : null}
      {check.iHaveSubmitted ? <p>You have submitted a proposal for this request</p> : null}
      {check.thereIsWinner ? <p>There is a winner for this request</p> : null}
      {check.winnerEmail ? <p>The winner email is {check.winnerEmail}</p> : null}
    </>
  )
}
