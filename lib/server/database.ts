import { ID, Models, Query, QueryTypes, Storage } from 'node-appwrite'

import { getLoggedInUser } from '@/app/actions/auth'
import { createDatabaseAdminClient, createStorageAdminClient, getUserEmail } from '@/lib/server/appwrite'
import { Request, RequestChecksMap, RequestCreateInput, RequestData, Submission, SubmissionCreateInput } from '@/lib/types'

const DATABASE_ID = '67aa7414000f83ae7018'
const REQUESTS_COLLECTION_ID = '67aa745800179944f652'
const SUBMISSIONS_COLLECTION_ID = '67b25d700034a4bddeb1'
const STORAGE_BUCKET_ID = '67ca3da70007a46d3511' // Add your bucket ID here

async function getCurrentUser() {
  const user = await getLoggedInUser()
  if (!user) {
    throw new Error('User not found')
  }
  return user
}

export const requestsService = {
  async create(requestData: { data: RequestData, images: File[] }) {
    const { databases } = await createDatabaseAdminClient()
    const user = await getCurrentUser()
    const newId = ID.unique()

    let imagesUrl: string[] = requestData.data.imagesUrl
    if (requestData.images.length > 0) {
      imagesUrl = await Promise.all(requestData.images.map(async (image) => {
        return await storageService.uploadImage(image)
      }))
    }

    const docToCreate: RequestCreateInput = {
      ...requestData.data,
      owner: user.$id,
      winner: null,
      submissionsId: [],
      imagesUrl: imagesUrl,
    }

    try {
      const created = await databases.createDocument(DATABASE_ID, REQUESTS_COLLECTION_ID, newId, docToCreate)
      return created as Request
    } catch (error) {
      console.error(error)
      // If document creation fails but we uploaded an image, clean it up
      if (requestData.images.length > 0) {
        await Promise.all(imagesUrl.map(async (imageId) => {
          await storageService.deleteImage(imageId).catch(console.error)
        }))
      }
      throw new Error('Failed to create request')
    }
  },

  async update(requestId: string, requestData: { data: RequestData, images: File[] }) {
    const { databases } = await createDatabaseAdminClient()

    try {
      console.log('images', requestData.images)
      const imagesUrl = await Promise.all(requestData.images.map(async (image) => {
        return await storageService.uploadImage(image)
      }))
      console.log('imagesUrl', imagesUrl, requestData.data.imagesUrl)
      const updated = await databases.updateDocument(DATABASE_ID, REQUESTS_COLLECTION_ID, requestId, { ...requestData.data, imagesUrl: requestData.data.imagesUrl.concat(imagesUrl) })
      console.log('updated', updated)
      return updated as Request
    } catch (error) {
      console.error(error)
      throw new Error('Failed to update request')
    }
  },

  async getOne(id: string) {
    const { databases } = await createDatabaseAdminClient()
    try {
      const doc = await databases.getDocument(DATABASE_ID, REQUESTS_COLLECTION_ID, id)
      return doc as Request
    } catch (error) {
      console.error(error)
      throw new Error('Failed to get request')
    }
  },

  async list(pagination: { page: number; limit: number }, filterField: string, filterValue: QueryTypes) {
    const { databases } = await createDatabaseAdminClient()
    const { page, limit } = pagination
    const user = await getCurrentUser()
    try {
      const query = [
        filterField === 'winner' ? Query.isNull(filterField) : filterField === 'owner' ? Query.equal(filterField, user.$id) : Query.equal(filterField, filterValue),
        Query.orderDesc('$createdAt'),
        Query.limit(limit),
        Query.offset((page - 1) * limit),
      ]
      const list = await databases.listDocuments(DATABASE_ID, REQUESTS_COLLECTION_ID, query)
      return list as Models.DocumentList<Request>
    } catch (error) {
      console.error(error)
      throw new Error('Failed to list requests')
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
      throw new Error('Failed to delete request')
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
      throw new Error('Failed to select winner')
    }
  },

  // async getImageUrl(requestId: string) {
  //   try {
  //     const request = await this.getOne(requestId)
  //     if (!request.image) return null
  //     return storageService.getImageUrl(request.image)
  //   } catch (error) {
  //     console.error(error)
  //     return null
  //   }
  // },
}

export const submissionsService = {
  async create(data: Omit<Submission, '$id' | '$createdAt' | '$updatedAt'>, image?: File) {
    const { databases } = await createDatabaseAdminClient()
    const user = await getCurrentUser()
    const newId = ID.unique()
    
    let imageId = null
    if (image) {
      imageId = await storageService.uploadImage(image)
    }

    try {
      const created = await databases.createDocument(DATABASE_ID, SUBMISSIONS_COLLECTION_ID, newId, {
        ...data,
        owner: user.$id,
        image: imageId,
      })

      const reqDoc = await databases.getDocument(DATABASE_ID, REQUESTS_COLLECTION_ID, data.requestId)
      const oldSubIds = reqDoc.submissionsId || []
      await databases.updateDocument(DATABASE_ID, REQUESTS_COLLECTION_ID, data.requestId, {
        submissionsId: [...oldSubIds, created.$id],
      })

      return created
    } catch (error) {
      console.error(error)
      // Clean up image if document creation fails
      if (imageId) {
        await storageService.deleteImage(imageId).catch(console.error)
      }
      throw new Error('Failed to create submission')
    }
  },

  async update(id: string, partialData: Partial<SubmissionCreateInput>) {
    const { databases } = await createDatabaseAdminClient()
    try {
      const updated = await databases.updateDocument(DATABASE_ID, SUBMISSIONS_COLLECTION_ID, id, partialData)
      return updated as Submission
    } catch (error) {
      console.error(error)
      throw new Error('Failed to update submission')
    }
  },

  async getOne(id: string) {
    const { databases } = await createDatabaseAdminClient()
    try {
      const doc = await databases.getDocument(DATABASE_ID, SUBMISSIONS_COLLECTION_ID, id)
      return doc as Submission
    } catch (error) {
      console.log('getOne error', id)
      console.error(error)
      throw new Error('Failed to get submission')
    }
  },

  async listByRequest(requestId: string) {
    const { databases } = await createDatabaseAdminClient()
    try {
      const list = await databases.listDocuments(DATABASE_ID, SUBMISSIONS_COLLECTION_ID, [Query.equal('requestId', requestId)])
      return list as Models.DocumentList<Submission>
    } catch (error) {
      console.error(error)
      throw new Error('Failed to list submissions by request')
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
      throw new Error('Failed to delete submission')
    }
  },

  // async getImageUrl(submissionId: string) {
  //   try {
  //     const submission = await this.getOne(submissionId)
  //     if (!submission.image) return null
  //     return storageService.getImageUrl(submission.image)
  //   } catch (error) {
  //     console.error(error)
  //     return null
  //   }
  // },
}

async function getRequestsByIds(ids: string[]) {
  if (!ids.length) return []
  const { databases } = await createDatabaseAdminClient()
  const result = await databases.listDocuments(DATABASE_ID, REQUESTS_COLLECTION_ID, [Query.equal('$id', ids)])
  return result.documents as Request[]
}

export async function computeRequestChecks(requestIds: string[]) {
  const user = await getCurrentUser()
  const docs = await getRequestsByIds(requestIds)

  const checksMap: RequestChecksMap = {}

  await Promise.all(
    docs.map(async (reqDoc) => {
      const iAmOwner = reqDoc.owner === user.$id
      let iAmWinner = false
      let winnerEmail = ''

      if (reqDoc.winner) {
        const winnerSub = await submissionsService.getOne(reqDoc.winner)
        if (winnerSub.owner === user.$id) {
          iAmWinner = true
        }
        if (winnerSub.owner) {
          winnerEmail = iAmWinner || iAmOwner ? await getUserEmail(winnerSub.owner) : '****@****.***'
        }
      }

      const requestSubmissions = await submissionsService.listByRequest(reqDoc.$id)

      const iHaveSubmitted = requestSubmissions.documents.some((sub) => sub.owner === user.$id)
      const thereIsWinner = !!reqDoc.winner

      const submissionsTitles: Record<string, string> = {}
      requestSubmissions.documents.forEach((sub) => {
        submissionsTitles[sub.$id] = sub.title
      })

      checksMap[reqDoc.$id] = {
        iAmOwner,
        iAmWinner,
        iHaveSubmitted,
        thereIsWinner,
        winnerEmail,
        requestId: reqDoc.$id,
        requestTitle: reqDoc.title,
        submissionsTitles,
      }
    })
  )

  return checksMap
}

export const storageService = {
  async uploadImage(file: File) {
    const { storage } = await createStorageAdminClient()
    const newId = ID.unique()
    
    try {
      const uploaded = await storage.createFile(STORAGE_BUCKET_ID, newId, file)
      return uploaded.$id
    } catch (error) {
      console.error(error)
      throw new Error('Failed to upload image' + error)
    }
  },
  
  async deleteImage(fileId: string) {
    const { storage } = await createStorageAdminClient()
    
    try {
      await storage.deleteFile(STORAGE_BUCKET_ID, fileId)
      return true
    } catch (error) {
      console.error(error)
      throw new Error('Failed to delete image')
    }
  }
}

