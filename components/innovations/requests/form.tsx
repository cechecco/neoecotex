import { getOneRequest } from '@/app/actions/innovations'
import FormClient from '@/components/innovations/requests/formClient'
import { RequestData } from '@/lib/types'

interface Props {
  id: string
}

const getDefaultRequest = (): RequestData => {
  return {
    title: '',
    company: '',
    briefDescription: '',
    detailedDescription: '',
    expectedExpertise: '',
    expectedTimeline: '',
    budget: 0,
    concept: '',
    field: '',
    marketingConsent: false,
    ecologyConsent: false,
    imagesIds: [],
  }
}

export default async function Form({ id }: Props) {
  let requestData: RequestData = getDefaultRequest()
  if (id !== 'new') {
    const request = await getOneRequest(id)
    if (request && 'error' in request) {
      return (
        <div className='flex items-center justify-center h-full'>
          <p className='text-red-500'>{request.message}</p>
        </div>
      )
    }
    requestData = request
  }

  return (
    <div>
      <FormClient
        initialRequest={requestData}
        requestId={id === 'new' ? undefined : id}
      />
    </div>
  )
}
