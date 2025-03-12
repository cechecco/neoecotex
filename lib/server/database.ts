import { ID, Models, Query, QueryTypes } from 'node-appwrite'

import { getLoggedInUser } from '@/app/actions/auth'
import { createDatabaseAdminClient, createStorageAdminClient, getUserEmail } from '@/lib/server/appwrite'
import { InnovatorData, Request, RequestChecksMap, RequestCreateInput, RequestData, RequesterData, Submission, SubmissionData, User, UserData } from '@/lib/types'

const DATABASE_ID = '67aa7414000f83ae7018'
const REQUESTS_COLLECTION_ID = '67aa745800179944f652'
const SUBMISSIONS_COLLECTION_ID = '67b25d700034a4bddeb1'
const STORAGE_BUCKET_ID = '67ca3da70007a46d3511' // Add your bucket ID here

export async function getCurrentUser() {
  const user = await getLoggedInUser()
  if (!user) {
    throw new Error('User not found')
  }
  return user
}

export const requestsService = {
  async create(requestData: { data: RequestData; images: File[] }) {
    const { databases } = await createDatabaseAdminClient()
    const user = await getCurrentUser()
    const newId = ID.unique()

    let imagesIds: string[] = requestData.data.imagesIds
    if (requestData.images.length > 0) {
      imagesIds = await Promise.all(
        requestData.images.map(async (image) => {
          return await storageService.uploadImage(image)
        })
      )
    }

    const docToCreate: RequestCreateInput = {
      ...requestData.data,
      owner: user.$id,
      winner: null,
      submissionsId: [],
      imagesIds: imagesIds,
    }

    try {
      const created = await databases.createDocument(DATABASE_ID, REQUESTS_COLLECTION_ID, newId, docToCreate)
      return created as Request
    } catch (error) {
      console.error(error)
      throw new Error('Failed to create request')
    }
  },

  async update(requestId: string, requestData: { data: RequestData; images: File[] }) {
    const { databases } = await createDatabaseAdminClient()

    try {
      const oldImagesIds = await databases.getDocument(DATABASE_ID, REQUESTS_COLLECTION_ID, requestId)
      const imagesToRemove = oldImagesIds.imagesIds.filter((imageId: string) => !requestData.data.imagesIds.includes(imageId))
      await Promise.all(
        imagesToRemove.map(async (imageId: string) => {
          await storageService.deleteImage(imageId).catch(console.error)
        })
      )
      const imagesUrl = await Promise.all(
        requestData.images.map(async (image) => {
          return await storageService.uploadImage(image)
        })
      )
      const updated = await databases.updateDocument(DATABASE_ID, REQUESTS_COLLECTION_ID, requestId, { ...requestData.data, imagesIds: requestData.data.imagesIds.concat(imagesUrl) })

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
  async create(data: SubmissionData, images: File[] = []) {
    const { databases } = await createDatabaseAdminClient()
    const user = await getCurrentUser()
    const newId = ID.unique()

    let imagesIds: string[] = data.imagesIds || []
    if (images.length > 0) {
      const uploadedImageIds = await Promise.all(
        images.map(async (image) => {
          return await storageService.uploadImage(image)
        })
      )
      imagesIds = [...imagesIds, ...uploadedImageIds]
    }

    try {
      const created = await databases.createDocument(DATABASE_ID, SUBMISSIONS_COLLECTION_ID, newId, {
        ...data,
        owner: user.$id,
        imagesIds: imagesIds,
      })

      const reqDoc = await databases.getDocument(DATABASE_ID, REQUESTS_COLLECTION_ID, data.requestId)
      const oldSubIds = reqDoc.submissionsId || []
      await databases.updateDocument(DATABASE_ID, REQUESTS_COLLECTION_ID, data.requestId, {
        submissionsId: [...oldSubIds, created.$id],
      })

      return created as Submission
    } catch (error) {
      console.error(error)
      // Clean up any uploaded images if there's an error
      if (imagesIds.length > data.imagesIds.length) {
        await Promise.all(
          imagesIds.slice(data.imagesIds.length).map(async (imageId) => {
            await storageService.deleteImage(imageId).catch(console.error)
          })
        )
      }
      throw new Error('Failed to create submission')
    }
  },

  async update(id: string, data: SubmissionData, images: File[] = []) {
    const { databases } = await createDatabaseAdminClient()

    try {
      const oldDoc = await databases.getDocument(DATABASE_ID, SUBMISSIONS_COLLECTION_ID, id)
      const oldImagesIds = oldDoc.imagesIds || []

      // Delete removed images
      const imagesToRemove = oldImagesIds.filter((imageId: string) => !data.imagesIds.includes(imageId))
      await Promise.all(
        imagesToRemove.map(async (imageId: string) => {
          await storageService.deleteImage(imageId).catch(console.error)
        })
      )

      // Upload new images
      const newImagesIds = await Promise.all(
        images.map(async (image) => {
          return await storageService.uploadImage(image)
        })
      )

      // Update document with combined image IDs
      const updated = await databases.updateDocument(DATABASE_ID, SUBMISSIONS_COLLECTION_ID, id, {
        ...data,
        imagesIds: [...data.imagesIds, ...newImagesIds],
      })

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

  async listByUser() {
    const user = await getCurrentUser()
    const { databases } = await createDatabaseAdminClient()
    try {
      const list = await databases.listDocuments(DATABASE_ID, SUBMISSIONS_COLLECTION_ID, [Query.equal('owner', user.$id)])
      return list as Models.DocumentList<Submission>
    } catch (error) {
      console.error(error)
      throw new Error('Failed to list submissions by user')
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
      throw new Error('Failed to delete image' + error)
    }
  },
}

const USERS_COLLECTION_ID = '67cf0c29002ddc34e7a9' // da sostituire con l'ID della collezione Appwrite

export const usersService = {
  async get() {
    const { databases } = await createDatabaseAdminClient()
    const user = await getCurrentUser()
    const doc = await databases.getDocument(DATABASE_ID, USERS_COLLECTION_ID, user.$id)
    return doc as User
  },

  async create(type: string) {
    const { databases } = await createDatabaseAdminClient()
    console.log('create', type)
    const user = await getCurrentUser()
    try {
      const innovator = {
        occupation: '',
      }

      const requester = {
        companyName: '',
        companySize: 0,
      }

      const userData: UserData = {
        name: user.name,
        surname: '',
        email: user.email,
        type: type === 'requester' ? 'requester' : 'innovator',
        country: '',
        city: '',
        imagesIds: [],
        active: false,
        ...(type === 'requester' ? requester : innovator),
      }

      const created = await databases.createDocument(DATABASE_ID, USERS_COLLECTION_ID, user.$id, userData)
      return created as User
    } catch (error) {
      console.error(error)
      return { error: true, message: String(error) }
    }
  },

  async update(data: UserData) {
    const { databases } = await createDatabaseAdminClient()
    const user = await getCurrentUser()
    const userDoc = await databases.getDocument(DATABASE_ID, USERS_COLLECTION_ID, user.$id)
    try {
      const userSpecificData =
        userDoc.type === 'innovator'
          ? {
              occupation: (data as InnovatorData).occupation,
            }
          : {
              companyName: (data as RequesterData).companyName,
              companySize: (data as RequesterData).companySize,
            }
      const userData: UserData = {
        email: userDoc.email,
        name: data.name || '',
        surname: data.surname || '',
        country: data.country || '',
        city: data.city || '',
        imagesIds: data.imagesIds || [],
        type: userDoc.type || '',
        active: true,
        ...userSpecificData,
      }
      const updated = await databases.updateDocument(DATABASE_ID, USERS_COLLECTION_ID, user.$id, userData)
      return updated as User
    } catch (error) {
      console.error(error)
      return { error: true, message: String(error) }
    }
  },
}
