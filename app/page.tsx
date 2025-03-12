import Image from 'next/image'
import Link from 'next/link'

import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'

export default async function InnovationRequestForm() {
  const texts = [
    {
      text: 'Innovator',
      description: ['For SMEs, start-ups, and professionals', 'Connect with companies to develop innovation'],
      type: 'innovator',
    },
    {
      text: 'Innovation Requester',
      description: ['For companies, SMEs, non-profit initiative', 'Find innovators to create solutions'],
      type: 'requester',
    },
  ]

  const features = [
    {
      text: 'Blog Posts',
      description: 'News, articles, and insights about innovation and technology',
    },
    {
      text: 'Innovation Hub',
      description: 'Match companies with innovators to solve challenges and create new solutions',
    },
    {
      text: 'Generative Ai',
      description: 'Cutting edge generative AI to help you',
    },
  ]

  return (
    <main className='flex flex-col gap-4'>
      <div className='flex justify-center items-center py-12'>
        <div className='flex gap-4 flex-col text-center w-full justify-center items-center'>
          <Image
            src='/logo.svg'
            alt='Neoecotex'
            width={700}
            height={200}
          />
          <p className='text-2xl lg:text-3xl px-8'>Connects companies with innovators to solve challenges and create new solutions</p>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-6xl px-4'>
            {features.map((feature, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className='text-lg'>{feature.text}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
          <p className='font-bold text-2xl lg:text-4xl mt-8 bg-white/20 p-4 w-full'>Begin your innovation journey today!</p>
        </div>
      </div>
      <div className='flex flex-col lg:flex-row justify-stretch mb-48 gap-4'>
        {texts.map((text, index) => (
          <Link
            key={index}
            href={`/signup?type=${text.type}`}
            className='border border-fuchsia-700 w-1/2 bg-fuchsia-200 p-4 h-48 backdrop-blur-xl shadow-lg flex flex-col gap-4 justify-center items-center align-middle backdrop-blur-sm w-full hover:shadow-lg hover:translate-y-[-10px] hover:bg-white transition-all duration-300'
          >
            <div className='flex flex-col gap-0 justify-center items-end'>
              <p className='text-xs text-center'>Register as</p>
              <p className='text-2xl font-bold'>{text.text}</p>
            </div>
            <div className='text-sm text-center'>
              {text.description.map((description, index) => (
                <div key={index}>
                  <span>{description}</span>
                  <br />
                </div>
              ))}
            </div>
          </Link>
        ))}
      </div>
    </main>
  )
}
