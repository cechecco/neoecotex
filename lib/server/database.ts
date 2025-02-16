import { createDatabaseAdminClient } from '@/lib/server/appwrite'
import { InnovationRequest } from '@/lib/types'
import { DatabaseError } from '@/lib/types'

const DATABASE_ID = '67aa7414000f83ae7018'
const REQUESTS_COLLECTION_ID = '67aa745800179944f652'
// const SUBMISSIONS_COLLECTION_ID = '67b25d700034a4bddeb1'

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
}
