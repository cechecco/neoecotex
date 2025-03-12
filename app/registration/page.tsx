import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'

export default async function RegistrationPage() {
  const cards = [
    {
      title: 'I am an Innovator',
      description: 'For SMEs, start-ups, and independent professionals, as innovators, register and reply to innovation post to connect with companies to develop eco-innovation.',
      features: ['Post Innovation Solution', 'Monthly Community Bulletin', 'Free Access to the Annual Community Event'],
      type: 'innovator',
      bgColor: 'bg-gradient-to-br from-purple-600 to-purple-500 text-white',
      btnColor: 'bg-white text-black hover:bg-gray-100',
    },
    {
      title: 'I am an Innovation Requestor',
      description: 'For companies, SMEs, non-profit initiative, in search of innovation for your product, process, or marketing, register and create innovation post.',
      features: ['Create Innovation Post', 'Monthly Community Bulletin', 'Free Access to the Annual Community Event'],
      type: 'requester',
      bgColor: 'bg-gradient-to-br from-fuchsia-600 to-fuchsia-500 text-white',
      btnColor: 'bg-white text-black hover:bg-gray-100',
    },
  ]

  return (
    <main className='container mx-auto py-12 px-4'>
      <h1 className='text-4xl font-bold text-center mb-10'>Join Our Innovation Community</h1>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto'>
        {cards.map((card, index) => (
          <Card
            key={index}
            className={`overflow-hidden ${card.bgColor} transform transition-all duration-300 hover:scale-105 hover:shadow-xl`}
          >
            <CardHeader className='text-center pt-10'>
              <h2 className='text-3xl font-bold'>{card.title}</h2>
            </CardHeader>
            <CardContent className='space-y-6 px-6'>
              <p className='text-center'>{card.description}</p>
              <ul className='space-y-3'>
                {card.features.map((feature, idx) => (
                  <li
                    key={idx}
                    className='flex items-center'
                  >
                    <span className='mr-2'>✓</span>
                    {feature}
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter className='flex justify-center pb-10'>
              <Button
                asChild
                className={`${card.btnColor} px-8 py-6 text-lg font-semibold rounded-md shadow-md hover:shadow-lg transition-all`}
              >
                <Link href={`/signup?type=${card.type}`}>Register Now</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </main>
  )
}
