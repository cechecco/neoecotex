import Image from 'next/image'
import Link from 'next/link'

import { Button } from '@/components/ui/button'

export default function HomePage() {
  return (
    <main className='flex flex-col min-h-screen'>
      {/* Hero Section */}
      <div className='flex justify-center'>
        <div className='relative w-full max-w-4xl aspect-[2/1]'>
          <Image
            src='/logo.svg'
            alt='Platform workflow showing how Innovation Requestors connect with Innovators'
            fill
            className='object-contain'
          />
        </div>
      </div>
      <section className='w-full overflow-hidden'>
        <div className='container px-4 mx-auto'>
          <div className='flex flex-col items-center'>
            <h1 className='text-5xl md:text-6xl font-bold text-center'>Connect, innovate, transform</h1>
            <p className='text-xl md:text-2xl mb-8 text-center'>Open eco-innovation platform for fashion and textile</p>
            <Button
              size='lg'
              className='bg-black text-white hover:bg-gray-800'
            >
              <Link href='/registration'>TRY IT FOR FREE</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className='py-10'>
        <div className='container px-4 mx-auto'>
          <div className='text-center mb-12'>
            <h2 className='text-3xl md:text-4xl font-bold mb-4'>How It Works</h2>
            <p className='text-lg max-w-3xl mx-auto'>
              The platform serves as a co-creation space to unleash the power of creativity and ensure a positive impact on the environment through eco-innovation.
            </p>
          </div>

          <div className='flex justify-center'>
            <div className='relative w-full max-w-4xl aspect-[4/3]'>
              <Image
                src='/how-it-works.svg'
                alt='Platform workflow showing how Innovation Requestors connect with Innovators'
                fill
                className='object-contain'
              />
            </div>
          </div>
        </div>
      </section>

      {/* Focus Section */}
      <section className='py-10'>
        <div className='container px-4 mx-auto'>
          <div className='flex flex-col md:flex-row items-center gap-12'>
            <div className='w-full md:w-1/2'>
              <div className='relative w-full aspect-square'>
                <Image
                  src='/platform-mockup.png'
                  alt='Platform mockup showing innovation hub'
                  fill
                  className='object-cover rounded-lg'
                />
              </div>
            </div>

            <div className='w-full md:w-1/2'>
              <p className='text-sm font-medium uppercase tracking-wider mb-2'>WE GROW WHAT WE FOCUS ON</p>
              <h2 className='text-3xl md:text-4xl font-bold mb-6'>Discover the power of innovation</h2>
              <p className='text-lg mb-4'>We aim to contribute to the acceleration of eco-innovation.</p>
              <p className='text-lg mb-8'>We matchmake innovators and companies to drive impactful eco-innovation.</p>
              <Button
                size='lg'
                className='bg-black text-white hover:bg-gray-800'
              >
                Read More
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Who We Are Section */}
      <section className='py-10'>
        <div className='container px-4 mx-auto'>
          <div className='flex flex-col md:flex-row-reverse items-center gap-12'>
            <div className='w-full md:w-1/2'>
              <div className='relative w-full aspect-square'>
                <Image
                  src='/about.png'
                  alt='Collaborative event showing hands raised'
                  fill
                  className='object-cover rounded-lg'
                />
              </div>
            </div>

            <div className='w-full md:w-1/2'>
              <p className='text-sm font-medium uppercase tracking-wider mb-2'>ACCELERATING ECO-INNOVATION</p>
              <h2 className='text-3xl md:text-4xl font-bold mb-6'>Who we are?</h2>
              <p className='text-lg mb-4'>An open eco-innovation platform for fashion and textiles.</p>
              <p className='text-lg mb-8'>We create a collaborative space for developing eco-innovation projects by connecting stakeholders across the industry.</p>
              <Button
                size='lg'
                className='bg-black text-white hover:bg-gray-800'
              >
                Read More
              </Button>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
