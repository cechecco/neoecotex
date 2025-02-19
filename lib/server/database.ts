import { createDatabaseAdminClient } from '@/lib/server/appwrite'
import { InnovationRequest, innovationRequestSchema, Submission, submissionSchema, SubmissionWithStringId } from '@/lib/types'
import { DatabaseError } from '@/lib/types'
import { Query } from 'node-appwrite'
const DATABASE_ID = '67aa7414000f83ae7018'
const REQUESTS_COLLECTION_ID = '67aa745800179944f652'
const SUBMISSIONS_COLLECTION_ID = '67b25d700034a4bddeb1'

export const innovations = {
  async create(id: string, data: InnovationRequest) {
    try {
      const { databases } = await createDatabaseAdminClient()
      return await databases.createDocument(DATABASE_ID, REQUESTS_COLLECTION_ID, id, data)
    } catch (error) {
      return {
        error: true,
        message: (error as Error).toString(),
      } as DatabaseError
    }
  },

  async update(id: string, data: InnovationRequest) {
    try {
      const { databases } = await createDatabaseAdminClient()
      return await databases.updateDocument(DATABASE_ID, REQUESTS_COLLECTION_ID, id, data)
    } catch (error) {
      return {
        error: true,
        message: (error as Error).toString(),
      } as DatabaseError
    }
  },

  async get(id: string) {
    try {
      const { databases } = await createDatabaseAdminClient()
      return await databases.getDocument(DATABASE_ID, REQUESTS_COLLECTION_ID, id)
    } catch (error) {
      return {
        error: true,
        message: (error as Error).toString(),
      } as DatabaseError
    }
  },

  async list() {
    try {
      const { databases } = await createDatabaseAdminClient()
      return await databases.listDocuments(DATABASE_ID, REQUESTS_COLLECTION_ID)
    } catch (error) {
      return {
        error: true,
        message: (error as Error).toString(),
      } as DatabaseError
    }
  },

  async delete(id: string) {
    try {
      const { databases } = await createDatabaseAdminClient()
      return await databases.deleteDocument(DATABASE_ID, REQUESTS_COLLECTION_ID, id)
    } catch (error) {
      return {
        error: true,
        message: (error as Error).toString(),
      } as DatabaseError
    }
  },
  getRawRequest(formData: FormData): InnovationRequest {
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
  },
  validationErrors(request: InnovationRequest): Partial<Record<keyof InnovationRequest, string[] | undefined>> | undefined {
    const validatedFields = innovationRequestSchema.safeParse(request)

    if (!validatedFields.success) {
      return validatedFields.error.flatten().fieldErrors
    }

    return undefined
  },
}

export const submissions = {
  async create(id: string, data: SubmissionWithStringId) {
    try {
      const { databases } = await createDatabaseAdminClient()
      return await databases.createDocument(DATABASE_ID, SUBMISSIONS_COLLECTION_ID, id, data)
    } catch (error) {
      return {
        error: true,
        message: (error as Error).toString(),
      } as DatabaseError
    }
  },

  async update(id: string, data: SubmissionWithStringId) {
    try {
      const { databases } = await createDatabaseAdminClient()
      return await databases.updateDocument(DATABASE_ID, SUBMISSIONS_COLLECTION_ID, id, data)
    } catch (error) {
      return {
        error: true,
        message: (error as Error).toString(),
      } as DatabaseError
    }
  },

  async get(id: string) {
    try {
      const { databases } = await createDatabaseAdminClient()
      return (await databases.getDocument(DATABASE_ID, SUBMISSIONS_COLLECTION_ID, id)) as unknown as Submission
    } catch (error) {
      return {
        error: true,
        message: (error as Error).toString(),
      } as DatabaseError
    }
  },

  async list(requestId: string) {
    try {
      const { databases } = await createDatabaseAdminClient()
      return (await databases.listDocuments(DATABASE_ID, SUBMISSIONS_COLLECTION_ID, [Query.equal('requestId', requestId)])) as unknown as { documents: Submission[] } // TODO: fix this
    } catch (error) {
      return {
        error: true,
        message: (error as Error).toString(),
      } as DatabaseError
    }
  },

  async delete(id: string) {
    try {
      const { databases } = await createDatabaseAdminClient()
      return await databases.deleteDocument(DATABASE_ID, SUBMISSIONS_COLLECTION_ID, id)
    } catch (error) {
      return {
        error: true,
        message: (error as Error).toString(),
      } as DatabaseError
    }
  },
  getRawSubmission(formData: FormData) {
    const rawSubmission = {
      title: formData.get('title'),
      briefDescription: formData.get('briefDescription'),
      requestId: formData.get('requestId'),
    } as SubmissionWithStringId

    return rawSubmission
  },
  validationErrors(submission: SubmissionWithStringId): Partial<Record<keyof SubmissionWithStringId, string[] | undefined>> | undefined {
    const validatedFields = submissionSchema.safeParse(submission)

    if (!validatedFields.success) {
      return validatedFields.error.flatten().fieldErrors
    }
  },
}
