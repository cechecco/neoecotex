import { RequestCheck } from '@/lib/types'
import { CheckCircle } from 'lucide-react'
import { Badge } from '../ui/badge'

export default function SubmissionStatusBadge({ check }: { check: RequestCheck }) {
  if (!check.iHaveSubmitted) return null

  return (
    <Badge className='bg-green-500 hover:bg-green-600'>
      <CheckCircle className='w-3 h-3 mr-1' />
      You have submitted
    </Badge>
  )
}
