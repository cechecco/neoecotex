import { redirect } from 'next/navigation'
import { getLoggedInUser } from '@/app/actions'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'

export default async function HomePage() {
  const user = await getLoggedInUser()
  if (!user) redirect('/signup')

  return (
    <Card className='max-w-md mx-auto mt-8'>
      <CardHeader>
        <CardTitle>Account Information</CardTitle>
      </CardHeader>
      <CardContent className='space-y-4'>
        <div className='grid grid-cols-[100px_1fr] gap-2'>
          <span className='font-medium'>Email:</span>
          <span>{user.email}</span>

          <span className='font-medium'>Name:</span>
          <span>{user.name}</span>

          <span className='font-medium'>ID:</span>
          <span>{user.$id}</span>
        </div>
      </CardContent>
    </Card>
  )
}
