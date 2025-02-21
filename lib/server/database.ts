import { getLoggedInUser } from '@/app/actions/auth'
import { createDatabaseAdminClient, getUserEmail } from '@/lib/server/appwrite'
import { InnovationRequest, innovationRequestSchema, Submission, submissionSchema, SubmissionWithStringId } from '@/lib/types'
import { DatabaseError } from '@/lib/types'
import { Query } from 'node-appwrite'

const DATABASE_ID = '67aa7414000f83ae7018'
const REQUESTS_COLLECTION_ID = '67aa745800179944f652'
const SUBMISSIONS_COLLECTION_ID = '67b25d700034a4bddeb1'
const REQUESTERS_COLLECTION_ID = '67b5f3f80009d5634aa5'
const SUBMITTERS_COLLECTION_ID = '67b66b5500294dca33eb'

export const innovations = {
  async create(id: string, data: InnovationRequest) {
    try {
      const { databases } = await createDatabaseAdminClient()
      const user = await getLoggedInUser()
      if (!user) {
        throw new Error('User not found')
      }
      const document = await databases.createDocument(DATABASE_ID, REQUESTS_COLLECTION_ID, id, data)
      // First check if requester document exists and get current innovation requests
      let requesterDoc
      try {
        requesterDoc = await databases.getDocument(DATABASE_ID, REQUESTERS_COLLECTION_ID, user.$id)
        // If exists, append new request to existing array
        const existingRequests = requesterDoc.innovationRequests || []
        await databases.updateDocument(DATABASE_ID, REQUESTERS_COLLECTION_ID, user.$id, {
          innovationRequests: [...existingRequests, id],
        })
      } catch (error) {
        console.log('Error updating requester document:', error)
        // If not exists, create new document with array containing just this request
        await databases.createDocument(DATABASE_ID, REQUESTERS_COLLECTION_ID, user.$id, {
          innovationRequests: [id],
        })
      }
      return document
    } catch (error) {
      console.log(error)
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
  async list(pagination: { page: number; limit: number }) {
    try {
      const { databases } = await createDatabaseAdminClient()
      return await databases.listDocuments(DATABASE_ID, REQUESTS_COLLECTION_ID, [Query.orderDesc('$createdAt'), Query.limit(pagination.limit), Query.offset((pagination.page - 1) * pagination.limit)])
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
      const user = await getLoggedInUser()
      if (!user) {
        throw new Error('User not found')
      }

      // First delete the innovation request
      await databases.deleteDocument(DATABASE_ID, REQUESTS_COLLECTION_ID, id)

      // Then update the requester's document to remove this request ID
      try {
        const requesterDoc = await databases.getDocument(DATABASE_ID, REQUESTERS_COLLECTION_ID, user.$id)
        const existingRequests = requesterDoc.innovationRequests || []
        const updatedRequests = existingRequests.filter((requestId: string) => requestId !== id)

        await databases.updateDocument(DATABASE_ID, REQUESTERS_COLLECTION_ID, user.$id, {
          innovationRequests: updatedRequests,
        })
      } catch (error) {
        console.log('Error updating requester document:', error)
      }
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
  async userHasSubmitted(requestId: string | undefined) {
    if (!requestId) {
      return false
    }
    const { databases } = await createDatabaseAdminClient()
    const user = await getLoggedInUser()
    if (!user) {
      return false
    }
    try {
      const submitterDoc = await databases.getDocument(DATABASE_ID, SUBMITTERS_COLLECTION_ID, user.$id)
      const existingSubmissions = submitterDoc.submissions || []
      return existingSubmissions.find((sub: Submission) => sub.requestId.$id === requestId)
    } catch {
      return false
    }
  },
  async selectWinner(requestId: string, submissionId: string) {
    const { databases } = await createDatabaseAdminClient()
    // First check if a winner is already set
    const request = await databases.getDocument(DATABASE_ID, REQUESTS_COLLECTION_ID, requestId)
    if (request.winner) {
      throw new Error('A winner has already been selected for this request')
    }
    // If no winner is set, proceed with setting the winner
    await databases.updateDocument(DATABASE_ID, REQUESTS_COLLECTION_ID, requestId, {
      winner: submissionId,
    })
  },
  async getWinnerId(requestId: string) {
    const { databases } = await createDatabaseAdminClient()
    const request = await databases.getDocument(DATABASE_ID, REQUESTS_COLLECTION_ID, requestId)
    const winnerSubmission = request.winner

    if (!winnerSubmission) {
      return undefined
    }

    const winnerSubmissionId = winnerSubmission.$id

    const submitters = await databases.listDocuments(DATABASE_ID, SUBMITTERS_COLLECTION_ID)

    const winnerSubmitterId = submitters.documents.find((submitter) => submitter.submissions.find((sub: Submission) => sub.$id === winnerSubmissionId))?.$id

    if (!winnerSubmitterId) {
      return undefined
    }
    return winnerSubmitterId
  },
  async isOwner(userId: string, requestId: string) {
    const { databases } = await createDatabaseAdminClient()
    try {
      const requesterDoc = await databases.getDocument(DATABASE_ID, REQUESTERS_COLLECTION_ID, userId)
      return requesterDoc.innovationRequests?.find((request: InnovationRequest) => request.$id === requestId) || false
    } catch (error) {
      console.log('Error checking request ownership:', error)
      return false
    }
  },
  async iAmOwner(requestId: string) {
    const currentUser = await getLoggedInUser()
    if (!currentUser) {
      return false
    }
    return await this.isOwner(currentUser.$id, requestId)
  },
  async iAmWinner(requestId: string) {
    const winnerSubmitterId = await this.getWinnerId(requestId)
    const currentUser = await getLoggedInUser()
    return currentUser?.$id === winnerSubmitterId
  },
  async getWinnerEmail(requestId: string) {
    const winnerSubmitterId = await this.getWinnerId(requestId)
    if (!winnerSubmitterId) {
      return undefined
    }

    const fakeEmail = '****@****.***'

    const currentUser = await getLoggedInUser()
    if (!currentUser) {
      return fakeEmail
    }

    if (!(await this.iAmWinner(requestId)) && !(await this.isOwner(currentUser.$id, requestId))) {
      return fakeEmail
    }
    return getUserEmail(winnerSubmitterId)
  },
  async thereIsWinner(requestId: string) {
    const { databases } = await createDatabaseAdminClient()
    const request = await databases.getDocument(DATABASE_ID, REQUESTS_COLLECTION_ID, requestId)
    return !!request.winner
  },
}

export const submissions = {
  async create(id: string, data: SubmissionWithStringId) {
    try {
      const { databases } = await createDatabaseAdminClient()
      const user = await getLoggedInUser()
      if (!user) {
        throw new Error('User not found')
      }

      const document = await databases.createDocument(DATABASE_ID, SUBMISSIONS_COLLECTION_ID, id, data)

      // Handle submitter document
      try {
        const submitterDoc = await databases.getDocument(DATABASE_ID, SUBMITTERS_COLLECTION_ID, user.$id)
        // If exists, append new submission to existing array
        const existingSubmissions = submitterDoc.submissions || []
        await databases.updateDocument(DATABASE_ID, SUBMITTERS_COLLECTION_ID, user.$id, {
          submissions: [...existingSubmissions, id],
        })
      } catch (error) {
        console.log('Error updating submitter document:', error)
        // If not exists, create new document with array containing just this submission
        await databases.createDocument(DATABASE_ID, SUBMITTERS_COLLECTION_ID, user.$id, {
          submissions: [id],
        })
      }
      return document
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
      const user = await getLoggedInUser()
      if (!user) {
        throw new Error('User not found')
      }

      // First delete the submission
      await databases.deleteDocument(DATABASE_ID, SUBMISSIONS_COLLECTION_ID, id)

      // Then update the submitter's document to remove this submission ID
      try {
        const submitterDoc = await databases.getDocument(DATABASE_ID, SUBMITTERS_COLLECTION_ID, user.$id)
        const existingSubmissions = submitterDoc.submissions || []
        const updatedSubmissions = existingSubmissions.filter((submissionId: string) => submissionId !== id)

        await databases.updateDocument(DATABASE_ID, SUBMITTERS_COLLECTION_ID, user.$id, {
          submissions: updatedSubmissions,
        })
      } catch (error) {
        console.log('Error updating submitter document:', error)
      }
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
