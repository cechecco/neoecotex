  import { redirect } from "next/navigation";
  import { signOut, getLoggedInUser } from "@/app/actions";
  
  export default async function HomePage() {
    const user = await getLoggedInUser();
    if (!user) redirect("/signup");
  
    return (
      <>
        <ul>
          <li>
            <strong>Email:</strong> {user?.email}
          </li>
          <li>
            <strong>Name:</strong> {user?.name}
          </li>
          <li>
            <strong>ID: </strong> {user?.$id}
          </li>
        </ul>
      </>
    );
  }
  