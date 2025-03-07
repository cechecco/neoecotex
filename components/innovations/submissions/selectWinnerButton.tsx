'use client'

import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import Confetti from 'react-confetti'

import { selectWinner } from '@/app/actions/innovations'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { RequestCheck } from '@/lib/types'

interface SelectWinnerButtonProps {
  submissionId: string
  check: RequestCheck
}

export default function SelectWinnerButton({ submissionId, check }: SelectWinnerButtonProps) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const [windowDimensions, setWindowDimensions] = useState({ width: 0, height: 0 })

  // Set window dimensions on component mount
  useEffect(() => {
    const updateWindowDimensions = () => {
      setWindowDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }

    // Initial setup
    updateWindowDimensions()

    // Update on resize
    window.addEventListener('resize', updateWindowDimensions)

    // Clean up
    return () => window.removeEventListener('resize', updateWindowDimensions)
  }, [])

  const handleConfirm = async () => {
    await selectWinner(check.requestId, submissionId)
    setShowConfetti(true)
    router.refresh()
    setOpen(false)

    // Hide confetti after some time
    setTimeout(() => {
      setShowConfetti(false)
    }, 5000)
  }

  return (
    <>
      {showConfetti && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            zIndex: 999,
            pointerEvents: 'none', // Allow clicking through the confetti
          }}
        >
          <Confetti
            width={windowDimensions.width}
            height={windowDimensions.height}
            recycle={false}
            numberOfPieces={1000}
            gravity={3}
            colors={['#FF69B4', '#FF1493', '#C71585', '#8B008B', '#9400D3']}
          />
        </div>
      )}

      <Button
        size='sm'
        disabled={check.thereIsWinner}
        onClick={() => setOpen(true)}
      >
        <p>Select Winner</p>
      </Button>

      <Dialog
        open={open}
        onOpenChange={setOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Selection</DialogTitle>
            <DialogDescription>Are you sure you want to select this project as the winner? This action cannot be undone.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant='outline'
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant='default'
              onClick={handleConfirm}
            >
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
