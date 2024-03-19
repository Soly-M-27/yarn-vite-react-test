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
        console.log("photoURL before Firebase upload: ", user.photoURL);

        try {
            if (!user) {
                throw new Error('User is not authenticated');
            }

            console.log("user? in try bf upl: ", user);
            console.log("user name?: ", user.displayName);

            try {
                console.log("trying to create new items within user ID");
                await addDoc(collection(db, 'profile_info'), {
                    Name: project.legal_name,
                    WorkEmail: project.work_email,
                    Location: project.location,
                    NameOfProfession: project.name_of_profession,
                    NameBusiness: project.name_business,
                    PhoneNum: project.phone_num,
                    Social_Media_Links: project.social_media_link,
                    Link_Tree_Link: project.link_tree_link,
                    CreatedBy: project.created_by,
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

    return { error, profileInfo } 

}