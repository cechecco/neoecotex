"use server";
import { Client, Account } from "node-appwrite";
import { cookies } from "next/headers";

const APPWRITE_ENDPOINT = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!;
const APPWRITE_PROJECT = process.env.NEXT_PUBLIC_APPWRITE_PROJECT!;
const APPWRITE_KEY = process.env.NEXT_APPWRITE_KEY!;

// function validateEnvironmentVariables() {
//   if (!APPWRITE_ENDPOINT || !APPWRITE_PROJECT || !APPWRITE_KEY) {
//     throw new Error("Missing required Appwrite environment variables");
//   }
// }

// validateEnvironmentVariables();

export async function createSessionClient() {
  const client = new Client()
    .setEndpoint(APPWRITE_ENDPOINT)
    .setProject(APPWRITE_PROJECT);

  console.log("cookies", (await cookies()).getAll());

  const session = (await cookies()).get("my-custom-session");

  if (!session || !session.value) {
    throw new Error("No session");
  }

  client.setSession(session.value);

  return {
    get account() {
      return new Account(client);
    },
  };
}

export async function createAdminClient() {
  const client = new Client()
    .setEndpoint(APPWRITE_ENDPOINT)
    .setProject(APPWRITE_PROJECT)
    .setKey(APPWRITE_KEY);

  return {
    get account() {
      return new Account(client);
    },
  };
}

export async function getLoggedInUser() {  
  try {
    const { account } = await createSessionClient();
    return await account.get();
  } catch (error) {
    return null;
  }
}
