import { redirect } from "next/navigation";
import { signUpWithGoogle, signUpWithEmail, getLoggedInUser } from "@/app/actions";

export default async function SignUpPage() {
  const user = await getLoggedInUser();
  if (user) redirect("/account");

  return (
    <>
    { user }
      <form action={signUpWithEmail}>
        <input
          id="email"
          name="email"
          placeholder="Email"
          type="email"
        />
        <input
          id="password"
          name="password"
          placeholder="Password"
          minLength={8}
          type="password"
        />
        <input
          id="name"
          name="name"
          placeholder="Name"
          type="text"
        />
        <button type="submit">Sign up</button>
      </form>
      <form action={signUpWithGoogle}>
        <button type="submit">Sign up with Google</button>
      </form>
    </>
  );
}
