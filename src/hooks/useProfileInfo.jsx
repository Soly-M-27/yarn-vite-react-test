import { db, projectStorage } from '../firebase/config';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { useState } from 'react';
import { updateProfile } from 'firebase/auth';
import { useAuthContext } from './useAuthContext';
import { collection, addDoc, updateDoc, doc } from "firebase/firestore";

/**
 * useProfileInfo - Handles submitted user info and takes 
 * it to the according Firebase service
 * 
 * @returns : error, profileInfo, MindFile, UpdateProfileInfo 
 */
export const useProfileInfo = () => {

    const [error, setError] = useState(null);
    const { user } = useAuthContext();

    /**
     * MindFile - function to take in Image Target for Business Card
     * 
     * @param {*} mindFile - image to be converted later into .mind file
     * Currently stored in Firebase Storage /mind directory
     */
    const MindFile = async (mindFile) => {
      try {
        if (user) {
          console.log("creating uploadPath by adding MIND dir to storage");
          const uploadPath = `mind/${user.uid}/${mindFile.name}`;

          console.log(
            "create storageRef var to access storage and upload the mindFile path"
          );
          const storageRef = ref(projectStorage, uploadPath);

          console.log("uploadingBytes");
          await uploadBytes(storageRef, mindFile);

          console.log("Downloaded MindimgUrl");
          const MindImgUrl = await getDownloadURL(storageRef);

          console.log("MindimgURL?: ", MindImgUrl);

          await updateProfile(user, { mindFileURL: MindImgUrl });
          console.log("displayName before Firebase upload: ", user.displayName);
          console.log("photoURL before Firebase upload: ", user.mindFileURL);

          try {
            console.log(
              "trying to add mind image url to 'users'"
            );
            await setDoc(doc(db, "users", user.uid), {
              mindFileURL: MindImgUrl,
            });
            console.log("Document photo with res.user ID: ", user.mindFileURL);
          } catch (e) {
            console.log("CAUGHT ERROR IN FIRESTORE ADD DOC IN UPDATEPROFILEINFO");
            console.log("Error adding document: ", e);
            setError("Error adding document: ", e.message);
          }
        }
      } catch (err) {
        console.log("Error with mindFile in useProfileInfo.jsx: ", err);
      }
    };

    /**
     * profileInfo - Takes obj called project from Home.jsx and creates
     * the fields that exists
     * 
     * @param {*} project - obj containing business card info
     */
    const profileInfo = async (project) => {
      console.log("Profile Info function begins in useProfileInfo.js");
      setError(null);

      console.log("displayName before Firebase upload: ", user.displayName);
      console.log("photoURL before Firebase upload: ", user.photoURL);

      try {
        if (!user) {
          throw new Error("User is not authenticated");
        }

        console.log("user? in try bf upl: ", user);
        console.log("user name?: ", user.displayName);

        try {
          console.log("trying to create new items within user ID");
          await addDoc(collection(db, "profile_info"), {
            Name: project.legal_name,
            WorkEmail: project.work_email,
            Location: project.location,
            NameOfProfession: project.name_of_profession,
            NameBusiness: project.name_business,
            PhoneNum: project.phone_num,
            Social_Media_Links: project.social_media_link,
            Link_Tree_Link: project.link_tree_link,
            CreatedBy: project.created_by,
            uid: user.uid,
          });
          console.log(
            "Document written with ID " + user.uid + " from user: ",
            user.displayName
          );
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
    };


    /**
     * FUNCTION NOT OPTIMIZED YET FOR USE
     * CHECK: https://firebase.google.com/docs/firestore/manage-data/add-data#web-modular-api_8
     * 
     * @param {*} project_updated - obj containing updated states from EditUpdatePage.jsx
     */
    const UpdateProfileInfo = async (project_updated, id) => {
      console.log("UpdateProfileInfo function updates in useProfileInfo.js");
      setError(null);

      try {
        if (!user) {
          throw new Error("User is not authenticated");
        }

        console.log("user? in try bf upl: ", user);
        console.log("user name?: ", user.displayName);

        try {
          console.log("trying to update new items within profile_info docID");
          await updateDoc(doc(db, "profile_info", id), { //This should be updateDoc instead. Later we will deal with it
            Name: project_updated.legal_name,
            WorkEmail: project_updated.work_email,
            Location: project_updated.location,
            NameOfProfession: project_updated.name_of_profession,
            NameBusiness: project_updated.name_business,
            PhoneNum: project_updated.phone_num,
            Social_Media_Links: project_updated.social_media_link,
            Link_Tree_Link: project_updated.link_tree_link,
            CreatedBy: project_updated.created_by,
            uid: user.uid,
          });
          console.log(
            "Document written with ID " + user.uid + " from user: ",
            user.displayName
          );
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
    };


    return { error, profileInfo, MindFile, UpdateProfileInfo } 

}