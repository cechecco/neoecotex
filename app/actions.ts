"use server";

import { createAdminClient, createSessionClient } from "@/lib/server/appwrite";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { OAuthProvider } from "node-appwrite";
import { cookies } from "next/headers";
import { ID } from "node-appwrite";

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
	} catch (error) {
	  return null;
	}
  }