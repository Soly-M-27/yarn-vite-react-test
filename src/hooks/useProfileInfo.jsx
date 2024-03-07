import { db } from '../firebase/config';
//import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { useState } from 'react';
//import { updateProfile } from 'firebase/auth';
import { useAuthContext } from './useAuthContext';
import { collection, addDoc } from "firebase/firestore";

export const useProfileInfo = () => {
    const [error, setError] = useState(null);
    const { user } = useAuthContext();

    const profileInfo = async (project) => {
        console.log("Profile Info function begins in useProfileInfo.js");
        setError(null);

        console.log("displayName before Firebase upload: ", user.displayName);
        console.log("photoURL before Firebase upload: ", user.name);

        try {
            if (!user) {
                throw new Error('User is not authenticated');
            }

            console.log("user? in try bf upl: ", user);
            console.log("user name?: ", user.displayName);

            try {
                console.log("trying to create new items within user ID");
                await addDoc(collection(db, 'profile_info'), {
                    project,
                    uid: user.uid
                });
                console.log("Document written with ID " + user.uid + " from user: ", user.displayName);
            } catch (e) {
                console.log("CAUGHT ERROR IN FIRESTORE ADD DOC FOR USER INFO");
                console.log("Error adding document: ", e);
                setError("Error adding document: ", e.message);
            }

        } catch (err) {
            console.log("CAUGHT ERROR USE_PROFILE_INFO");
            console.log(err);
            console.log(err.message);
            setError(err.message);
        }

    }

   const socialMediaLinks = async (linkInputs) => {
        //Manage social media links from SocialMediaTree.js
        console.log("Social Media links function begins in useProfileInfo.js");
        setError(null);

        if (!user) {
            throw new Error('User is not authenticated');
        }

        console.log("Trying to add social media links for user:", user.displayName);

        // Assuming linkInputs is a dictionary with keys as social media titles and values as links
        console.log("Link inputs:", linkInputs);

        try {
            console.log("trying to create new items within user ID");
            await addDoc(collection(db, "profile_info"), {
                social_media_links: linkInputs, 
                uid: user.uid
            });
            console.log("Social media links written with ID " + user.uid + " from user: ", user.displayName);

        } catch (e) {
            console.log("CAUGHT ERROR IN FIRESTORE ADD DOC FOR SOCIAL MEDIA LINKS");
            console.log("Error adding link to document: ", e);
            setError("Error adding link to document: ", e.message);
        }

    }

    return { error, profileInfo, socialMediaLinks }

}