import { Client, Account, Databases, Storage } from 'appwrite'

const APPWRITE_ENDPOINT = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!
const APPWRITE_PROJECT = process.env.NEXT_PUBLIC_APPWRITE_PROJECT!

export function createClient() {
  const client = new Client()
    .setEndpoint(APPWRITE_ENDPOINT)
    .setProject(APPWRITE_PROJECT)
  
  return {
    get account() {
      return new Account(client)
    },
    get databases() {
      return new Databases(client)
    },
    get storage() {
      return new Storage(client)
    },
    client
  }
}

const STORAGE_BUCKET_ID = '67ca3da70007a46d3511'

export async function getImagesUrl(fileIds: string[]) {
  const { storage } = createClient()
  const urls: Record<string, string> = {}
  
  await Promise.all(fileIds.map(async (fileId) => {
    const url = await storage.getFileView(STORAGE_BUCKET_ID, fileId)
    urls[fileId] = url
  }))
  
  return urls
}
