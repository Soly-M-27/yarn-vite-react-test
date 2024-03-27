import { signInWithEmailAndPassword } from 'firebase/auth';
import { useAuthState, useSignInWithGoogle } from 'react-firebase-hooks/auth';
import { projectAuth } from '../../firebase';
import { useState } from 'react';
import { Navigate } from 'react-router-dom';


const login = (email: string, password: string) => {
  signInWithEmailAndPassword(projectAuth, email, password);
};



export const SignIn = () => {
  const [user, loading, error] = useAuthState(projectAuth);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [signInWithGoogle, ..._] = useSignInWithGoogle(projectAuth);


  if (loading) {
    return (
      <div>
        <p>Initialising User...</p>
      </div>
    );
  }
  if (error) {
    return (
      <div>
        <p>Error: {error.message}</p>
      </div>
    );
  }
  if (user) {

    return (
      <Navigate to="/" />
    );
  }



  return (
    <div className=" lg:px-96">
      <div className="flex flex-col items-center">
          <label>Email</label>
          <input
            className="w-96 h-10 border-2 border-gray-600 active:border-gray-300 rounded-md"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <label>password</label>
          <input
            className="w-96 h-10 border-2 border-gray-600 active:border-gray-300 rounded-md"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        <button onClick={() => login(email, password)}>Log in</button>

        <button onClick={() => signInWithGoogle()}>Google</button>
      </div>

    </div>
  );
};
