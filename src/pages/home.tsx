import { useAuthState } from "react-firebase-hooks/auth"
import { projectAuth } from "../firebase"
import {Navigate} from 'react-router-dom'
import { signOut } from "firebase/auth";
type Props = {}

export function Home({ }: Props) {

  const [user, loading, error] = useAuthState(projectAuth);
  if (loading) {
    return <p>Loading...</p>
  }
  if (error) {
    return <p>Error: {error.message}</p>
  }
  if (!user) {
    return <Navigate to="/login"/>
  }
  return (
    <div>
      <p>Logged in as: {user.email}</p>
      <button onClick={() => signOut(projectAuth)}>Sign Out</button>
    </div>
  )

}
