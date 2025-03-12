import Link from 'next/link'

export default async function RegistrationPage() {
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

  return (
    <main className='flex flex-col gap-4'>
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
