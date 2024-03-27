import { useCreateUserWithEmailAndPassword, useSignInWithGoogle } from 'react-firebase-hooks/auth';
import { useState } from 'react';
import { projectAuth } from '../../firebase';
import { useNavigate } from 'react-router-dom';

export const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [
    createUserWithEmailAndPassword,
    user,
    loading,
    error,
  ] = useCreateUserWithEmailAndPassword(projectAuth);

  const [signInWithGoogle, ..._] = useSignInWithGoogle(projectAuth);
  if (error) {
    return (
      <div>
        <p>Error: {error.message}</p>
      </div>
    );
  }
  if (loading) {
    return <p>Loading...</p>;
  }
  if (user) {
    const signOut = () => {
      const navigate = useNavigate()
      projectAuth.signOut()
      navigate('/')

    }
    return (
      <div>
        <p>Registered User: {user.user.email}</p>
        <button onClick={signOut}>Sign Out</button>
      </div>
    );
  }
  return (
    <>

      <div className="flex flex-col gap-4 items-center">
        <label>Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <label>Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <button onClick={() => signInWithGoogle()}>Google</button>
      <button onClick={() => createUserWithEmailAndPassword(email, password)}>
        Register
      </button>
      
    </>
  );
};
