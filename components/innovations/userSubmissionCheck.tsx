import { Check } from 'lucide-react'

export default function UserSubmissionCheck({ userHasSubmitted }: { userHasSubmitted: boolean }) {
  if (userHasSubmitted) {
    return (
      <div className='flex items-center gap-1 text-xs'>
        <span>Submitted</span>
        <Check className='w-4 h-4' />
      </div>
    )
  } else {
    return <></>
  }
}
