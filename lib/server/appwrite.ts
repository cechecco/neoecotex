'use server'
import { cookies } from 'next/headers'
import { Client, Account, Databases, Users, Storage } from 'node-appwrite'

const APPWRITE_ENDPOINT = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!
const APPWRITE_PROJECT = process.env.NEXT_PUBLIC_APPWRITE_PROJECT!
const APPWRITE_KEY = process.env.NEXT_APPWRITE_KEY!

function validateEnvironmentVariables() {
  if (!APPWRITE_ENDPOINT || !APPWRITE_PROJECT || !APPWRITE_KEY) {
    throw new Error('Missing required Appwrite environment variables')
  }
}

validateEnvironmentVariables()

export async function createSessionClient() {
  const client = new Client().setEndpoint(APPWRITE_ENDPOINT).setProject(APPWRITE_PROJECT)

  const session = (await cookies()).get('user-session')

  if (!session || !session.value) {
    throw new Error('No session')
  }

  client.setSession(session.value)

  return {
    get account() {
      return new Account(client)
    },
  }
}

export async function createAdminClient() {
  const client = new Client().setEndpoint(APPWRITE_ENDPOINT).setProject(APPWRITE_PROJECT).setKey(APPWRITE_KEY)

  return {
    get account() {
      return new Account(client)
    },
  }
}

export async function createDatabaseAdminClient() {
  const client = new Client().setEndpoint(APPWRITE_ENDPOINT).setProject(APPWRITE_PROJECT).setKey(APPWRITE_KEY)

  const databases = new Databases(client)

  return {
    get databases() {
      return databases
    },
  }
}

export async function getUserEmail(userId: string) {
  const client = new Client().setEndpoint(APPWRITE_ENDPOINT).setProject(APPWRITE_PROJECT).setKey(APPWRITE_KEY)
  const users = new Users(client)
  const user = await users.get(userId)
  return user.email
}

export async function createStorageAdminClient() {
  const client = new Client().setEndpoint(APPWRITE_ENDPOINT).setProject(APPWRITE_PROJECT).setKey(APPWRITE_KEY)
  const storage = new Storage(client)
  return { storage, client }
}
