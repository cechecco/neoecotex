import { getLoggedInUser } from '@/app/actions/auth'
import { createDatabaseAdminClient, getUserEmail } from '@/lib/server/appwrite'
import { InnovationRequest, InnovationRequestData, innovationRequestSchema, InnovationRequestWithMetadata, Submission, SubmissionData, submissionSchema, SubmissionWithMetadata } from '@/lib/types'
import { DatabaseError } from '@/lib/types'
import { ID, Query } from 'node-appwrite'
import { Models } from 'node-appwrite'

const DATABASE_ID = '67aa7414000f83ae7018'
const REQUESTS_COLLECTION_ID = '67aa745800179944f652'
const SUBMISSIONS_COLLECTION_ID = '67b25d700034a4bddeb1'
const REQUESTERS_COLLECTION_ID = '67b5f3f80009d5634aa5'
const SUBMITTERS_COLLECTION_ID = '67b66b5500294dca33eb'

export const innovations = {
  async create(data: InnovationRequestData) {
    try {
      const { databases } = await createDatabaseAdminClient()
      const user = await getLoggedInUser()
      if (!user) {
        throw new Error('User not found')
      }

      const request: InnovationRequestWithMetadata = {
        ...data,
        owner: user.$id,
        winner: null,
        submissionsId: [],
      }

      const id = ID.unique()

      const document = await databases.createDocument(DATABASE_ID, REQUESTS_COLLECTION_ID, id, request)
      
      return id
      // First check if requester document exists and get current innovation requests
      // let requesterDoc
      // try {
      //   requesterDoc = await databases.getDocument(DATABASE_ID, REQUESTERS_COLLECTION_ID, user.$id)
      //   // If exists, append new request to existing array
      //   const existingRequests = requesterDoc.innovationRequests || []
      //   await databases.updateDocument(DATABASE_ID, REQUESTERS_COLLECTION_ID, user.$id, {
      //     innovationRequests: [...existingRequests, id],
      //   })
      // } catch (error) {
      //   console.log('Error updating requester document:', error)
      //   // If not exists, create new document with array containing just this request
      //   await databases.createDocument(DATABASE_ID, REQUESTERS_COLLECTION_ID, user.$id, {
      //     innovationRequests: [id],
      //   })
      // }
      return document
    } catch (error) {
      console.log(error)
      return {
        error: true,
        message: (error as Error).toString(),
      } as DatabaseError
    }
  },

  async update(data: InnovationRequestData, id: string) {

    try {
      const { databases } = await createDatabaseAdminClient()
      return await databases.updateDocument(DATABASE_ID, REQUESTS_COLLECTION_ID, id, { ...data })
    } catch (error) {
      return {
        error: true,
        message: (error as Error).toString(),
      } as DatabaseError
    }
  },

  async get(id: string) {
    if (id === 'new') {

      const user = await getLoggedInUser()
      if (!user) {
        throw new Error('User not found')
      }
      const data: InnovationRequestData = {
          title: '',
          briefDescription: '',
          detailedDescription: '',
          expectedExpertise: '',
          expectedTimeline: '',
          budget: 100,
          company: '',
          concept: '',
          field: '',
          marketingConsent: false,
          ecologyConsent: false,
        }
      
      const newRequest: InnovationRequestWithMetadata = {
        ...data,
        owner: user.$id,
        winner: null,
        submissionsId: [],
      }
        
      return newRequest
      }
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
  getRequestData(formData: FormData) {
    const data: InnovationRequestData = {
        title: formData.get('title') as string,
        briefDescription: formData.get('briefDescription') as string,
        detailedDescription: formData.get('detailedDescription') as string,
        expectedExpertise: formData.get('expectedExpertise') as string,
        expectedTimeline: formData.get('expectedTimeline') as string,
        budget: parseInt(formData.get('budget') as string) || 0,
        company: formData.get('company') as string  || '',
        concept: formData.get('concept') as string || '',
        field: formData.get('field') as string || '',
        marketingConsent: !!formData.get('marketingConsent'),
        ecologyConsent: !!formData.get('ecologyConsent'),
      }

    return data
  },
  validationErrors(data: InnovationRequestData): Partial<Record<keyof InnovationRequestData, string[] | undefined>> | undefined {
    const validatedFields = innovationRequestSchema.safeParse(data)

    if (!validatedFields.success) {
      return validatedFields.error.flatten().fieldErrors
    }

    return undefined
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
}

export const submissions = {
  async create(submission: SubmissionWithMetadata) {
    try {
      const { databases } = await createDatabaseAdminClient()
      const user = await getLoggedInUser()
      if (!user) {
        throw new Error('User not found')
      }

      const document = await databases.createDocument(DATABASE_ID, SUBMISSIONS_COLLECTION_ID, ID.unique(), submission)

      try {
        const request = await databases.getDocument(DATABASE_ID, REQUESTS_COLLECTION_ID, submission.requestId) as unknown as InnovationRequest
        const existingSubmissions = request.submissionsId || []
        await databases.updateDocument(DATABASE_ID, REQUESTS_COLLECTION_ID, submission.requestId, {
          submissionsId: [...existingSubmissions, document.$id],
        })
      } catch (error) {
        console.log('Error updating innovation request submissions:', error)
      }

      // Handle submitter document
      // try {
      //   const submitterDoc = await databases.getDocument(DATABASE_ID, SUBMITTERS_COLLECTION_ID, user.$id)
      //   // If exists, append new submission to existing array
      //   const existingSubmissions = submitterDoc.submissions || []
      //   await databases.updateDocument(DATABASE_ID, SUBMITTERS_COLLECTION_ID, user.$id, {
      //     submissions: [...existingSubmissions, id],
      //   })
      // } catch (error) {
      //   console.log('Error updating submitter document:', error)
      //   // If not exists, create new document with array containing just this submission
      //   await databases.createDocument(DATABASE_ID, SUBMITTERS_COLLECTION_ID, user.$id, {
      //     submissions: [id],
      //   })
      // }
      return document
    } catch (error) {
      console.log(error)
      return {
        error: true,
        message: (error as Error).toString(),
      } as DatabaseError
    }
  },

  async update(id: string, data: SubmissionData) {
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
      console.log('get submission', id)
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
      owner: formData.get('owner'),
    } as SubmissionWithMetadata

    return rawSubmission
  },
  validationErrors(submission: SubmissionData): Partial<Record<keyof SubmissionData, string[] | undefined>> | undefined {
    const validatedFields = submissionSchema.safeParse(submission)

    if (!validatedFields.success) {
      return validatedFields.error.flatten().fieldErrors
    }
  },
}

export type RequestChecks = {
  iAmOwner: boolean
  iAmWinner: boolean
  iHaveSubmitted: boolean
  thereIsWinner: boolean
  winnerEmail: string | undefined
  requestId: string
}

export type RequestChecksMap = {
  [requestId: string]: RequestChecks;
}

async function getRequests(requestIds: string[]) {    
  if (!requestIds.length) {
    return []
  }

  const { databases } = await createDatabaseAdminClient()

  const requests = await databases.listDocuments(DATABASE_ID, REQUESTS_COLLECTION_ID, [
    Query.equal('$id', requestIds)
  ])

  return requests.documents

}

export async function computeRequestChecks(requestIds: string[]): Promise<RequestChecksMap> {
  const currentUser = await getLoggedInUser()

  const requests = await getRequests(requestIds) as unknown as InnovationRequest[]

  const results = await Promise.all(requests.map(async (request) => {

    const iAmOwner = request.owner === currentUser?.$id
    const iAmWinner = request.winner === currentUser?.$id
    const iHaveSubmitted = request.submissionsId.some((submissionId: string) => submissionId === currentUser?.$id)
    const thereIsWinner = !!request.winner

    let winnerEmail = ''

    if (request.winner) {
      const winnerSubmission = await submissions.get(request.winner) // TODO typing!
      const winnerUserId = (winnerSubmission as unknown as Submission).owner
      winnerEmail = !winnerUserId
        ? ''
        : iAmWinner || iAmOwner
          ? await getUserEmail(winnerUserId)
          : '****@****.***'
    }

    return {
      id: request.$id,
      checks: {
        iAmOwner,
        iAmWinner,
        iHaveSubmitted,
        thereIsWinner,
        winnerEmail,
        requestId: request.$id // important to have the requestId in the checks object
      }
    }
  }))

  return results.reduce((acc: any, { id, checks }: any) => ({
    ...acc,
    [id!]: checks
  }), {})
}
