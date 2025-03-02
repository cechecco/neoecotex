import { getOneRequest } from '@/app/actions/actions'
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
  }
}

export default async function Form({ id }: Props) {
  let requestData: RequestData | undefined
  if (id === 'new') {
    requestData = getDefaultRequest()
  } else {
    const request = await getOneRequest(id)
    if (request && 'error' in request) {
      return (
        <div className='flex items-center justify-center h-full'>
          <p className='text-red-500'>{request.message}</p>
        </div>
      )
    }
    requestData = {
      title: request.title,
      company: request.company,
      briefDescription: request.briefDescription,
      detailedDescription: request.detailedDescription,
      expectedExpertise: request.expectedExpertise,
      expectedTimeline: request.expectedTimeline,
      budget: request.budget,
      concept: request.concept,
      field: request.field,
      marketingConsent: request.marketingConsent,
      ecologyConsent: request.ecologyConsent,
    }
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
