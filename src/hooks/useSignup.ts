import { projectAuth, projectStorage, db } from '../firebase/config';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { useState } from 'react';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { useAuthContext } from './useAuthContext';
import { setDoc, doc} from "firebase/firestore";

export const useSignup = () => {
    const [error, setError] = useState(null);
    const { dispatch } = useAuthContext();

    const signup = async (email:string, password:string, displayName:string, thumbnail:File) => {
      //use this instead of promises
      setError(null);

      try {
        const res = await createUserWithEmailAndPassword(
          projectAuth,
          email,
          password
        );

        await updateProfile(res.user, { displayName });

        dispatch({ type: "LOGIN", payload: res.user });

        const uploadPath = `thumbnails/${res.user.uid}/${thumbnail.name}`;

        const storageRef = ref(projectStorage, uploadPath);

        await uploadBytes(storageRef, thumbnail);

        const imgUrl = await getDownloadURL(storageRef);

        await updateProfile(res.user, { photoURL: imgUrl });
       try {
          await setDoc(doc(db, "users", res.user.uid), {
            online: true,
            displayName,
            photoURL: imgUrl,
          });
        } catch (e:any) {
          setError(e.message);
        }
      } catch (err:any) {
        setError(err.message);
      }
    };

    return { error, signup }
}
