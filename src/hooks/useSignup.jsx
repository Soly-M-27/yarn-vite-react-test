import { projectAuth, projectStorage, db } from '../firebase/config';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { useState } from 'react';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { useAuthContext } from './useAuthContext';
import { setDoc, doc} from "firebase/firestore";

export const useSignup = () => {
    const [error, setError] = useState(null);
    const { dispatch } = useAuthContext();

    const signup = async (email, password, displayName, thumbnail) => { //use this instead of promises
        console.log("signup function begins in useSignup.js");
        console.log("projectAuth obj:", projectAuth);
        console.log("API key: ", projectAuth.config.apiKey);
        console.log("authDomain: ", projectAuth.config.authDomain);
        console.log("API Host: ", projectAuth.config.apiHost);
        setError(null);

        try {
            console.log("trying to create user with email and password");
            const res = await createUserWithEmailAndPassword(projectAuth, email, password);
            console.log("user signed up: ", res.user);
            
            console.log("updateProfile attempt");
            await updateProfile(res.user, { displayName });
 
            console.log("dispatch LOGIN with payload as user");
            dispatch({ type: 'LOGIN', payload: res.user });

            console.log("creating uploadPath by adding thumbnail dir to storage");
            const uploadPath = `thumbnails/${res.user.uid}/${thumbnail.name}`;

            console.log("create storageRef var to access storage and upload the thumbnail path");
            const storageRef = ref(projectStorage, uploadPath);

            console.log("uploadingBytes");
            await uploadBytes(storageRef, thumbnail);

            console.log("Downloaded imgUrl");
            const imgUrl = await getDownloadURL(storageRef);

            console.log("imgURL?: ", imgUrl);
            
            await updateProfile(res.user, { photoURL: imgUrl });
            console.log("displayName before Firebase upload: ", res.user.displayName);
            console.log("photoURL before Firebase upload: ", res.user.photoURL);

            console.log("Checking db from Firestore: ", db);
            try {
                console.log("trying to create new collection for Firestore Database titled 'users'");
                await setDoc(doc(db, "users", res.user.uid), {
                    online: true,
                    displayName,
                    photoURL: imgUrl
                });
                console.log("Document photo with res.user ID: ", res.user.photoURL);
                console.log("Document written with ID: ", res.user.uid);

            } catch (e) {
                console.log("CAUGHT ERROR IN FIRESTORE ADD DOC");
                console.log("Error adding document: ", e);
                setError("Error adding document: ", e.message);
            }
        } catch (err) {
            console.log("CAUGHT ERROR IN SIGNUP");
            console.log(err);
            console.log(err.message);
            setError(err.message);
        }

    }

    return { error, signup }
}