import { SignIn, SignUp} from '../components/Login'
import {useState} from 'react'
type Props = {}

export function Login({}: Props) {
  const [signUp, setSignUp] = useState(false)
  if (signUp) {
    return (
      <>
        <SignUp />
        <button onClick={() => setSignUp(false)}>Sign In</button>
      </>
    )
  }
  return (
    <>
      <SignIn/>
      <button onClick={() => setSignUp(true)}>Sign Up</button>
    </>    
  )
}
