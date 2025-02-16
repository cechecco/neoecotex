import { createDatabaseAdminClient } from '@/lib/server/appwrite'
import { InnovationRequest } from '@/lib/types'
import { DatabaseError } from './types'

const DATABASE_ID = '67aa7414000f83ae7018'
const COLLECTION_ID = '67aa745800179944f652'

export async function createDocument(id: string, data: InnovationRequest) {
  try {
    const { databases } = await createDatabaseAdminClient()
    return await databases.createDocument(DATABASE_ID, COLLECTION_ID, id, data)
  } catch (error) {
    return {
      error: true,
      message: (error as Error).toString(),
    } as DatabaseError
  }
}

export async function updateDocument(id: string, data: InnovationRequest) {
  try {
    const { databases } = await createDatabaseAdminClient()
    return await databases.updateDocument(DATABASE_ID, COLLECTION_ID, id, data)
  } catch (error) {
    return {
      error: true,
      message: (error as Error).toString(),
    } as DatabaseError
  }
}

export async function getDocument(id: string) {
  try {
    const { databases } = await createDatabaseAdminClient()
    return await databases.getDocument(DATABASE_ID, COLLECTION_ID, id)
  } catch (error) {
    return {
      error: true,
      message: (error as Error).toString(),
    } as DatabaseError
  }
}

export async function listDocuments() {
  try {
    const { databases } = await createDatabaseAdminClient()
    return await databases.listDocuments(DATABASE_ID, COLLECTION_ID)
  } catch (error) {
    return {
      error: true,
      message: (error as Error).toString(),
    } as DatabaseError
  }
}

export async function deleteDocument(id: string) {
  try {
    const { databases } = await createDatabaseAdminClient()
    return await databases.deleteDocument(DATABASE_ID, COLLECTION_ID, id)
  } catch (error) {
    return {
      error: true,
      message: (error as Error).toString(),
    } as DatabaseError
  }
}
