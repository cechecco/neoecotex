'use server'

import { usersService } from '@/lib/server/database'
import { User, UserData, requesterSchema, innovatorSchema } from '@/lib/types'

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

const validateUser = (data: Partial<User>) => {
  const schema = data.type === 'requester' ? requesterSchema : innovatorSchema
  const validatedFields = schema.safeParse(data)
  if (!validatedFields.success) {
    return validatedFields.error.flatten().fieldErrors
  }
  return null
}

export async function updateUser(data: UserData) {
  try {
    const validationErrors = validateUser(data)
    if (validationErrors) {
      return {
        validationErrors,
      }
    }

    const updated = await usersService.update(data)
    return {
      user: updated,
    }
  } catch (error) {
    console.error(error)
    return { error: true, message: String(error) }
  }
}
