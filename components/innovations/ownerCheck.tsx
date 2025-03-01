import { RequestCheck } from '@/lib/server/database'
import { ShieldCheck } from 'lucide-react'
import { Badge } from '../ui/badge'

export default function RequestOwnerBadge({ check }: { check: RequestCheck }) {
  if (!check.iAmOwner) return null

  return (
    <Badge className='bg-blue-500 hover:bg-blue-600'>
      <ShieldCheck className='w-3 h-3 mr-1' />
      You are the owner
    </Badge>
  )
}
