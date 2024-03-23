import { db, projectStorage } from '../firebase/config';
import { useState } from 'react';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { updateProfile } from 'firebase/auth';
import { useAuthContext } from './useAuthContext';
import { collection, addDoc, updateDoc } from "firebase/firestore";
import { UserProfile, ProfileInfo } from '../types/docsRef';



interface ProfileInfoFunctions {
  error: string | null;
  profileInfo: (project: ProfileInfo) => void;
  MindFile: (mindFile: File) => void;
  UpdateProfileInfo: (project_updated: ProfileInfo) => void;
}

export const useProfileInfo = (): ProfileInfoFunctions => {
  const [error, setError] = useState<string | null>(null);
  const { user }: { user: UserProfile | null } = useAuthContext();

  const MindFile = async (mindFile: File) => {
    try {
      if (user) {
        const uploadPath = `mind/${user.uid}/${mindFile.name}`;
        const storageRef = ref(projectStorage, uploadPath);
        await uploadBytes(storageRef, mindFile);
        const imgUrl = await getDownloadURL(storageRef);
        await updateProfile(user, { mindFileURL: imgUrl });
      }
    } catch (err) {
      console.log("Error with mindFile in useProfileInfo.jsx: ", err);
    }
  };

  const profileInfo = async (project: ProfileInfo) => {
    setError(null);

    try {
      if (!user) {
        throw new Error("User is not authenticated");
      }

      try {
        await addDoc(collection(db, "profile_info"), project); // Pass the document data directly
      } catch (e:any) {
        console.log("Error adding document: ", e);
        setError(e.message);
      }
    } catch (err:any) {
      console.log(err);
      setError(err.message);
    }
  };

  const UpdateProfileInfo = async (project_updated: ProfileInfo) => {
    setError(null);

    try {
      if (!user) {
        throw new Error("User is not authenticated");
      }

      try {
        // Use updateDoc if you intend to update an existing document
        await updateDoc(collection(db, "profile_info"), project_updated);
      } catch (e:any) {
        console.log("Error updating document: ", e);
        setError(e.message);
      }
    } catch (err:any) {
      console.log(err);
      setError(err.message);
    }
  };

  return { error, profileInfo, MindFile, UpdateProfileInfo };
}

