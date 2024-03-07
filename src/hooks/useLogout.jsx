import { projectAuth } from '../firebase/config';
import { useState } from 'react';
import { signOut } from 'firebase/auth';
import { useAuthContext } from './useAuthContext';

export const useLogout = () => { // if we use this hook in a component, 
                                 // then we're going to get all these states.
    //const [ isCancelled, setIsCanceled ] = useState(false);
    const [ error, setError ] = useState(null);
    //const [ isPending, setIsPending ] = useState(false);
    const { dispatch } = useAuthContext();

    /* create a log out function because we don't automatically 
    want to log the user out when they use this hook inside a component.
    We might want to use this hook in a component and then only log 
    the user out in that component when they click on a button. */
    const logout = async () => { // If we call this function, 
                                 // it's going to try and sign the user 
                                 // in, update the state, etcetera, while
                                 // also firing the cleanuo function right away. 
        setError(null)
        //setIsPending(true)

        signOut(projectAuth).then(() => {
            console.log('user signed out');
            dispatch({ type: 'LOGOUT' });
        }).catch((err) => {
            console.log(err.message);
            setError(err.message);
        });
    }

    return { logout, error }
}