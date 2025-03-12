'use server'

import { storageService, usersService } from '@/lib/server/database'
import { User, UserData, requesterSchema, innovatorSchema, imageSchema, BaseUserData, RequesterData, InnovatorData } from '@/lib/types'

export async function getUser() {
  try {
    const user = await usersService.get()
    if (!user) {
      return null
    }
    return user as User
  } catch {
    return null
  }
}

export async function createUser(type: string) {
  console.log('createUser', type)
  try {
    const created = await usersService.create(type)
    return created
  } catch (error) {
    console.error(error)
    return { error: true, message: String(error) }
  }
}

const validateImages = (images: File[]) => {
  const validatedFields = imageSchema.safeParse({ images })
  if (!validatedFields.success) {
    return validatedFields.error.flatten().fieldErrors
  }
  return null
}

const validateUser = (data: UserData) => {
  const schema = data.type === 'requester' ? requesterSchema : innovatorSchema
  const validatedFields = schema.safeParse(data)
  if (!validatedFields.success) {
    return validatedFields.error.flatten().fieldErrors
  }
  return null
}

const getUserData = async (data: FormData) => {
  const user = await getUser()

  if (!user) {
    return null
  }

  const userData: BaseUserData = {
    email: user.email,
    name: data.get('name') as string,
    surname: data.get('surname') as string,
    type: user.type,
    imagesIds: user.imagesIds,
    country: data.get('country') as string,
    city: data.get('city') as string,
  }

  if (user.type === 'requester') {
    const requesterData: RequesterData = {
      ...userData,
      companyName: data.get('companyName') as string,
      companySize: parseInt(data.get('companySize') as string),
    }

    return {
      ...requesterData,
      active: user.active,
    }
  }

  const innovatorData: InnovatorData = {
    ...userData,
    occupation: data.get('occupation') as string,
  }

  return {
    ...innovatorData,
    active: user.active,
  }
}

const getImages = (formData: FormData) => {
  const images = formData.getAll('images').filter((image) => (image as File).size > 0) as File[]
  return images
}

export async function updateUser(data: FormData) {
  try {
    const userData = await getUserData(data)
    const images = getImages(data)
    if (!userData) {
      return { error: true, message: 'User not found' }
    }
    const validationErrors = validateUser(userData)
    const imagesValidationErrors = validateImages(images)

    if (validationErrors || imagesValidationErrors) {
      return {
        validationErrors,
        imagesValidationErrors,
      }
    }

    const oldImagesIds = await usersService.get()
    const imagesToRemove = oldImagesIds ? oldImagesIds.imagesIds.filter((imageId: string) => !userData.imagesIds.includes(imageId)) : []
    await Promise.all(
      imagesToRemove.map(async (imageId: string) => {
        await storageService.deleteImage(imageId).catch(console.error)
      })
    )
    const imagesUrl = await Promise.all(
      images.map(async (image) => {
        return await storageService.uploadImage(image)
      })
    )

    const updated = await usersService.update({
      ...userData,
      imagesIds: imagesUrl,
    })
    return {
      user: updated,
    }
  } catch (error) {
    console.error(error)
    return { error: true, message: String(error) }
  }
}
