"use server";
import { Client, Account, Databases, ID } from "node-appwrite";
import { cookies } from "next/headers";
import { InnovationRequest } from "../types";

const APPWRITE_ENDPOINT = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!;
const APPWRITE_PROJECT = process.env.NEXT_PUBLIC_APPWRITE_PROJECT!;
const APPWRITE_KEY = process.env.NEXT_APPWRITE_KEY!;

function validateEnvironmentVariables() {
  if (!APPWRITE_ENDPOINT || !APPWRITE_PROJECT || !APPWRITE_KEY) {
    throw new Error("Missing required Appwrite environment variables");
  }
}

validateEnvironmentVariables();

export async function createSessionClient() {
  const client = new Client()
    .setEndpoint(APPWRITE_ENDPOINT)
    .setProject(APPWRITE_PROJECT);

  const session = (await cookies()).get("user-session");

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

export async function createInnovationRequest(innovationRequest: InnovationRequest) {
  const client = new Client()
  .setEndpoint(APPWRITE_ENDPOINT)
  .setProject(APPWRITE_PROJECT)
  .setKey(APPWRITE_KEY);

  const databases = new Databases(client);
  const promise = databases.createDocument(
    '67aa7414000f83ae7018',
    '67aa745800179944f652',
    ID.unique(),
    innovationRequest
  );

  promise.then(function (response) {
    return response;
  }, function (error) {
    return { error: true, message: error };
  });
}

export async function getInnovationRequests() {
  const client = new Client()
  .setEndpoint(APPWRITE_ENDPOINT)
  .setProject(APPWRITE_PROJECT)
  .setKey(APPWRITE_KEY);

  const databases = new Databases(client);

  const promise = databases.listDocuments(
    "67aa7414000f83ae7018",
    "67aa745800179944f652"
  );

  return promise.then(function (response) {
    return response;
  }, function (error) {
    return { error: true, message: error };
  });
}

export async function getInnovationRequest(id: string) {
  const client = new Client()
  .setEndpoint(APPWRITE_ENDPOINT)
  .setProject(APPWRITE_PROJECT)
  .setKey(APPWRITE_KEY);

  const databases = new Databases(client);

  const promise = databases.getDocument(
    "67aa7414000f83ae7018",
    "67aa745800179944f652",
    id
  );

  return promise.then(function (response) {
    return response;
  }, function (error) {
    return { error: true, message: error };
  });
}