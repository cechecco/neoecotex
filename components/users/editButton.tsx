import { Pencil } from 'lucide-react'

import LoadingLink from '@/components/innovations/LoadingLink'
import { Button } from '@/components/ui/button'

export default function EditButton() {
  return (
    <LoadingLink
      href={`/account/edit`}
      className='flex items-center gap-2'
    >
      <Button size='sm'>
        <Pencil />
        Edit
      </Button>
    </LoadingLink>
  )
}
