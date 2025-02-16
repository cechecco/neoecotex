import { InnovationRequest, innovationRequestSchema } from '@/lib/types'

export function getRawRequest(formData: FormData): InnovationRequest {
  const rawRequest = {
    title: formData.get('title'),
    briefDescription: formData.get('briefDescription'),
    detailedDescription: formData.get('detailedDescription'),
    expectedExpertise: formData.get('expectedExpertise'),
    expectedTimeline: formData.get('expectedTimeline'),
    budget: parseInt(formData.get('budget') as string) || 0,
    company: formData.get('company'),
    concept: formData.get('concept'),
    field: formData.get('field'),
    marketingConsent: !!formData.get('marketingConsent'),
    ecologyConsent: !!formData.get('ecologyConsent'),
  } as InnovationRequest

  return rawRequest
}

export function validationErrors(request: InnovationRequest): Partial<Record<keyof InnovationRequest, string[] | undefined>> | undefined {
  const validatedFields = innovationRequestSchema.safeParse(request)

  if (!validatedFields.success) {
    return validatedFields.error.flatten().fieldErrors
  }

  return undefined
}
