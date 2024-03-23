import { z } from 'zod';
import { DocumentReference, DocumentData } from '@firebase/firestore-types';
import { User } from 'firebase/auth';

export const docsRef = z.object({}).refine(
  (x:object): x is DocumentReference => x instanceof DocumentReference,
);


export const firebaseUserSchema = z.object({
  uid: z.string(),
  email: z.string().email().nullable(),
  displayName: z.string().nullable(),
  photoURL: z.string().nullable(),
  mindFileURL: z.string().nullable(),

});

export type FirebaseUser = z.infer<typeof firebaseUserSchema>;


export interface ProfileInfo extends DocumentData {
  legal_name: string;
  work_email: string;
  location: string;
  name_of_profession: string;
  name_business: string;
  phone_num: string;
  social_media_link: string;
  link_tree_link: string;
  created_by: string;
}

export interface UserProfile extends User {
  mindFileURL?: string;
}




