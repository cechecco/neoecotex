'use client'

import { Award, Copy } from 'lucide-react'
import { CheckCircle } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { RequestCheck } from '@/lib/types'
interface Props {
  check: RequestCheck
  size?: 'sm' | 'md'
}

export default function StatusBadges({ check }: Props) {
  return (
    <div className='text-xs text-muted-foreground'>
      {check.iHaveSubmitted && !check.thereIsWinner && (
        <p className='flex items-center gap-1 bg-white text-muted-foreground border border-muted-foreground px-2 py-1 rounded-md'>
          <CheckCircle className='w-4 h-4' /> Submitted
        </p>
      )}
      {check.thereIsWinner && !check.iAmWinner && (
        <p className='flex items-center gap-1 bg-white text-muted-foreground border border-muted-foreground px-2 py-1 rounded-md'>
          <Award className='w-4 h-4' /> Winner Selected
        </p>
      )}
      {check.iAmWinner && (
        <p className='flex items-center gap-1 shadow-sm bg-gradient-to-r from-fuchsia-700 to-fuchsia-500 text-white px-2 py-1 rounded-md'>
          <Award className='w-4 h-4' /> You are the winner
        </p>
      )}
      {check.iAmOwner && check.thereIsWinner && (
        <div className='flex items-center gap-2'>
          <p> Winner Contact </p>
          <p className='flex items-center gap-1 bg-white text-muted-foreground border border-muted-foreground px-2 py-1 rounded-md'>
            <Award className='w-4 h-4' />
            {check.winnerEmail}
          </p>
          <Button
            variant='outline'
            size='icon'
            onClick={() => {
              navigator.clipboard.writeText(check.winnerEmail || '')
            }}
          >
            <Copy className='w-4 h-4' />
          </Button>
        </div>
      )}
    </div>
  )
}
