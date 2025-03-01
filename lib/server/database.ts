import { createDatabaseAdminClient, getUserEmail } from '@/lib/server/appwrite'
import { getLoggedInUser } from '@/app/actions/auth'
import { Request, RequestCreateInput, RequestData, requestSchema, Submission } from '@/lib/types'
import { ID, Models, Query } from 'node-appwrite'

const DATABASE_ID = '67aa7414000f83ae7018'
const REQUESTS_COLLECTION_ID = '67aa745800179944f652'
const SUBMISSIONS_COLLECTION_ID = '67b25d700034a4bddeb1'

async function getCurrentUser() {
  const user = await getLoggedInUser()
  if (!user) {
    throw new Error('User not found')
  }
  return user
}

export const requestsService = {
  async create(data: RequestData) {

    const { databases } = await createDatabaseAdminClient()
    const user = await getCurrentUser()
    const newId = ID.unique()

    const docToCreate: RequestCreateInput = {
      ...data,
      owner: user.$id,
      winner: null,
      submissionsId: [],
    }

    try {
      const created = await databases.createDocument(
        DATABASE_ID,
        REQUESTS_COLLECTION_ID,
        newId,
        docToCreate
      )
      return created as Request
    } catch (error) {
      console.error(error)
      throw error // TODO: format error for frontend
    }
  },

  async update(requestId: string, requestData: Partial<Request>) {

    ///
    // const hasAlreadyWinner = await this.getOne(id).then((req) => req.winner !== null)

    // if (hasAlreadyWinner) {
    //   throw new Error('A winner has already been selected.')
    // }
    ///

    const { databases } = await createDatabaseAdminClient()

    try {
      const updated = await databases.updateDocument(
        DATABASE_ID,
        REQUESTS_COLLECTION_ID,
        requestId,
        requestData
      )
      return updated as Request
    } catch (error) {
      console.error(error)
      throw error // TODO: format error for frontend
    }
  },

  async getOne(id: string) {
    const { databases } = await createDatabaseAdminClient()
    try {
      const doc = await databases.getDocument(
        DATABASE_ID,
        REQUESTS_COLLECTION_ID,
        id
      )
      return doc as Request
    } catch (error) {
      console.error(error)
      throw error // TODO: format error for frontend
    }
  },

  async list(pagination: { page: number; limit: number }) {
    const { databases } = await createDatabaseAdminClient()
    const { page, limit } = pagination
    try {
      const list = await databases.listDocuments(DATABASE_ID, REQUESTS_COLLECTION_ID, [
        Query.orderDesc('$createdAt'),
        Query.limit(limit),
        Query.offset((page - 1) * limit),
      ])
      return list as Models.DocumentList<Request>
    } catch (error) {
      console.error(error)
      throw error // TODO: format error for frontend
    }
  },

  async deleteOne(id: string) {
    const { databases } = await createDatabaseAdminClient()
    await getCurrentUser()
    try {
      await databases.deleteDocument(DATABASE_ID, REQUESTS_COLLECTION_ID, id)
      return true
    } catch (error) {
      console.error(error)
      throw error // TODO: format error for frontend
    }
  },

  async selectWinner(requestId: string, submissionId: string) {
    const { databases } = await createDatabaseAdminClient()
    try {
      const doc = await databases.getDocument(DATABASE_ID, REQUESTS_COLLECTION_ID, requestId)
      if (doc.winner) {
        throw new Error('A winner has already been selected.')
      }
      return await databases.updateDocument(DATABASE_ID, REQUESTS_COLLECTION_ID, requestId, {
        winner: submissionId,
      })
    } catch (error) {
      console.error(error)
      throw error
    }
  },
}

export const submissionsService = {
  async create(data: Omit<Submission, '$id'|'$createdAt'|'$updatedAt'>) {
    const { databases } = await createDatabaseAdminClient()
    await getCurrentUser()
    const newId = ID.unique()
    try {
      const created = await databases.createDocument(
        DATABASE_ID,
        SUBMISSIONS_COLLECTION_ID,
        newId,
        data
      )
      // Aggiorniamo la Request per aggiungere la submissionId
      const reqDoc = await databases.getDocument(DATABASE_ID, REQUESTS_COLLECTION_ID, data.requestId)
      const oldSubIds = reqDoc.submissionsId || []
      await databases.updateDocument(DATABASE_ID, REQUESTS_COLLECTION_ID, data.requestId, {
        submissionsId: [...oldSubIds, created.$id],
      })
      return created
    } catch (error) {
      console.error(error)
      throw error
    }
  },

  async update(id: string, partialData: Partial<Submission>) {
    const { databases } = await createDatabaseAdminClient()
    try {
      const updated = await databases.updateDocument(
        DATABASE_ID,
        SUBMISSIONS_COLLECTION_ID,
        id,
        partialData
      )
      return updated
    } catch (error) {
      console.error(error)
      throw error
    }
  },

  async getOne(id: string) {
    const { databases } = await createDatabaseAdminClient()
    try {
      const doc = await databases.getDocument(
        DATABASE_ID,
        SUBMISSIONS_COLLECTION_ID,
        id
      )
      // Se vuoi validare con Zod:
      // return submissionSchema.parse(doc)
      return doc
    } catch (error) {
      console.error(error)
      throw error
    }
  },

  async listByRequest(requestId: string) {
    const { databases } = await createDatabaseAdminClient()
    try {
      return await databases.listDocuments(DATABASE_ID, SUBMISSIONS_COLLECTION_ID, [
        Query.equal('requestId', requestId),
      ])
    } catch (error) {
      console.error(error)
      throw error
    }
  },

  async deleteOne(id: string) {
    const { databases } = await createDatabaseAdminClient()
    await getCurrentUser()
    try {
      await databases.deleteDocument(DATABASE_ID, SUBMISSIONS_COLLECTION_ID, id)
      return true
    } catch (error) {
      console.error(error)
      throw error
    }
  },
}

/** Esempio di checks per Request */
export type RequestCheck = {
  iAmOwner: boolean
  iAmWinner: boolean
  iHaveSubmitted: boolean
  thereIsWinner: boolean
  winnerEmail: string | undefined
  requestId: string
}

export type RequestChecksMap = Record<string, RequestCheck>

async function getRequestsByIds(ids: string[]) {
  if (!ids.length) return []
  const { databases } = await createDatabaseAdminClient()
  const result = await databases.listDocuments(DATABASE_ID, REQUESTS_COLLECTION_ID, [
    Query.equal('$id', ids),
  ])
  return result.documents
}

export async function computeRequestChecks(requestIds: string[]) {
  const user = await getCurrentUser()
  const docs = await getRequestsByIds(requestIds)

  const checksMap: RequestChecksMap = {}

  await Promise.all(
    docs.map(async (reqDoc: any) => {
      const iAmOwner = reqDoc.owner === user.$id
      let iAmWinner = false
      let winnerEmail = ''

      if (reqDoc.winner) {
        const winnerSub = await submissionsService.getOne(reqDoc.winner)
        if (winnerSub.owner === user.$id) {
          iAmWinner = true
        }
        if (winnerSub.owner) {
          winnerEmail = iAmWinner || iAmOwner
            ? await getUserEmail(winnerSub.owner)
            : '****@****.***'
        }
      }

      const iHaveSubmitted = (reqDoc.submissionsId || []).includes(user.$id)
      const thereIsWinner = !!reqDoc.winner

      checksMap[reqDoc.$id] = {
        iAmOwner,
        iAmWinner,
        iHaveSubmitted,
        thereIsWinner,
        winnerEmail,
        requestId: reqDoc.$id,
      }
    })
  )

  return checksMap
}
