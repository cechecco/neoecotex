"use server";

import { createAdminClient, createDatabaseAdminClient, createSessionClient } from "@/lib/server/appwrite";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { OAuthProvider } from "node-appwrite";
import { cookies } from "next/headers";
import { ID } from "node-appwrite";
import { InnovationRequest } from "@/lib/types";

export async function signUpWithGoogle() {
	const { account } = await createAdminClient();

	const origin = (await headers()).get("origin");

	const redirectUrl = await account.createOAuth2Token(
		OAuthProvider.Google,
		`${origin}/oauth`,
		`${origin}/signup`,
	);

	redirect(redirectUrl);
};

export async function signOut() {
	const { account } = await createSessionClient();

	(await cookies()).delete("user-session");
	await account.deleteSession("current");

	redirect("/signup");
}

export async function signUpWithEmail(formData: FormData) {
	const email = formData.get("email") as string;
	const password = formData.get("password") as string;
	const name = formData.get("name") as string;

	const { account } = await createAdminClient();

	await account.create(ID.unique(), email, password, name);
	const session = await account.createEmailPasswordSession(email, password);

	(await cookies()).set("user-session", session.secret, {
		path: "/",
		httpOnly: true,
		sameSite: "strict",
		secure: true,
	});

	redirect("/account");
}

export async function getLoggedInUser() {  
	try {
	  const { account } = await createSessionClient();
	  return await account.get();
	} catch {
	  return null;
	}
  }

export async function createInnovationRequest(innovationRequest: InnovationRequest) {
	const { databases } = await createDatabaseAdminClient();
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
	const { databases } = await createDatabaseAdminClient();
  
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
	const { databases } = await createDatabaseAdminClient();
  
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
  
  export async function updateInnovationRequest(id: string, innovationRequest: InnovationRequest) {
	const { databases } = await createDatabaseAdminClient();
  
	const promise = databases.updateDocument(
	  "67aa7414000f83ae7018",
	  "67aa745800179944f652",
	  id,
	  innovationRequest
	);
  
	return promise.then(function (response) {
	  return response;
	}, function (error) {
	  return { error: true, message: error };
	});
  }
  