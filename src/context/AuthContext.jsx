import { createContext, useReducer } from "react";
import { projectAuth } from "../firebase/config";
import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";

export const AuthContext = createContext();

export const authReducer = (state, action) => { // function to update and return the state
    console.log("authReducer begins in AuthContext.js");
    switch (action.type) {
        /* When we in the future dispatch a login action 
        whereby the type of the action is going to be LOGIN,
        we're returning a new object to represent out state */
        case 'LOGIN': //Dispatch this action in the user sign up 
        /* We take the current state and spread 
           those properties and then we say update 
           the user property so it's no longer going 
           to be null. But whatever we pass it in as the 
           upload on the action. */
            return { ...state, user: action.payload } 
        
        case 'LOGOUT':
            return { ...state, user: null }

        case 'AUTH_IS_READY':
            return { ...state, user: action.payload, authIsReady: true }

        default:
            return state
    }
}

/* Fires some code when our React application first renders.
   So when this component is first evaluated, find
   some code once to perform a check with Firebase on
   wether the user . */
export const AuthContextProvider = ({ children }) => {

    const [state, dispatch] = useReducer(authReducer, {
        /* Do we have a user currently logged in?
           Firebase is either going to say yes or no, 
           and we update our user property right here 
           appropriately */
        user: null, //initial state of the user
        authIsReady: false // This is what tells how now we know whether there's a user logged in or logged out for sure.
    })

    console.log("dispatch came through");
    //console.log("user?: ", user);
    console.log('AuthContext state before unsub:', state);

    /* Update state change with Firebase
       When function fires checks if user is 
       null or if there are any users at all */
    useEffect(() => {
        const unsub = onAuthStateChanged(projectAuth, (user) => { // Fires every time some kind of authentication state change occurs and dispatches AUTH_IS_READY
            dispatch({ type: 'AUTH_IS_READY', payload: user }) 
            console.log("user before unsub?: ", user);
            //console.log("action.payload before unsub?: ", action.payload);
            unsub();
            console.log("user after unsub?: ", user);
            //console.log("action.payload after unsub?: ", action.payload);
        });

    }, []); 
    console.log("Unsub through with auth_is_ready state.");
    console.log('AuthContext state:', state);


    return (
        <AuthContext.Provider value={{ ...state, dispatch }}>
            { children }
        </AuthContext.Provider>
    )
}