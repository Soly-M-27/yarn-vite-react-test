import { createContext, useReducer } from "react";
import { projectAuth } from "../firebase/config";
import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { User } from "firebase/auth";

export const AuthContext = createContext<{
  user: User | null;
  authIsReady: boolean;
  dispatch: React.Dispatch<Action>;
}>({
  user: null,
  authIsReady: false,
  dispatch: () => {},
});

type Action =
  | { type: "LOGIN"; payload: User | null }
  | { type: "LOGOUT" }
  | { type: "AUTH_IS_READY"; payload: User | null };

type State = {
  user: User | null;
  authIsReady: boolean;
};

const authReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "LOGIN":
      return { ...state, user: action.payload };
    case "LOGOUT":
      return { ...state, user: null };
    case "AUTH_IS_READY":
      return { ...state, user: action.payload, authIsReady: true };
    default:
      return state;
  }
};

type AuthContextProviderProps = {
  children: React.ReactNode;
};

export const AuthContextProvider = ({
  children,
}: AuthContextProviderProps): JSX.Element => {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
    authIsReady: false,
  });

  useEffect(() => {
    const unsub = onAuthStateChanged(projectAuth, (user) => {
      dispatch({ type: "AUTH_IS_READY", payload: user });
    });
    return () => unsub();
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};

