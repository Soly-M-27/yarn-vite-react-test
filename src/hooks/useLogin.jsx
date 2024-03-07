import { useState } from 'react';
import { projectAuth } from '../firebase/config';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useAuthContext } from './useAuthContext';

export const useLogin = () => { // if we use this hook in a component, 
                                 // then we're going to get all these states.
    //const [ isCancelled, setIsCanceled ] = useState(false);
    //const [ isPending, setIsPending ] = useState(false);
    const [ error, setError ] = useState(null);
    const { dispatch } = useAuthContext();

    const login = async (email, password) => { // If we call this function, 
                                 // it's going to try and login the user, 
                                 // update the state, etcetera, while also
                                 // firing the cleanup function right away. 
        setError(null);
        //setIsPending(true);

        signInWithEmailAndPassword(projectAuth, email, password).then((res) => {
            console.log("user logged in: ", res.user);
            dispatch({ type: 'LOGIN', payload: res.user })
        }).catch((err) => {
            setError(err.message);
        });

    }

    return { login, error }
}