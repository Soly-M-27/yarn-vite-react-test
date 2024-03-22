import { useReducer, useState, useEffect } from 'react';
import { db, timestamp } from "../firebase/config";
import { collection, doc, deleteDoc, updateDoc, addDoc, DocumentReference, DocumentData } from 'firebase/firestore';

interface FirestoreResponse {
  document: DocumentData | null;
  isPending: boolean;
  error: string | null;
  success: boolean | null;
}

type ActionType =
  | { type: 'IS_PENDING' }
  | { type: 'ADDED_DOCUMENT'; payload: DocumentReference<DocumentData> }
  | { type: 'DELETED_DOCUMENT' }
  | { type: 'UPDATED_DOCUMENT'; payload: DocumentReference<DocumentData> }
  | { type: 'ERROR'; payload: string };

const initialState: FirestoreResponse = {
  document: null,
  isPending: false,
  error: null,
  success: null,
};

const firestoreReducer = (state: FirestoreResponse, action: ActionType): FirestoreResponse => {
  switch (action.type) {
    case 'IS_PENDING':
      return { ...state, isPending: true, document: null, success: false, error: null };
    case 'ADDED_DOCUMENT':
      return { ...state, isPending: false, document: null, success: true, error: null };
    case 'DELETED_DOCUMENT':
      return { ...state, isPending: false, document: null, success: true, error: null };
    case 'UPDATED_DOCUMENT':
      return { ...state, isPending: false, document: null, success: true, error: null };
    case 'ERROR':
      return { ...state, isPending: false, document: null, success: false, error: action.payload };
    default:
      return state;
  }
};

export const useFirestore = (collectionName: string) => {
  const [response, dispatch] = useReducer(firestoreReducer, initialState);
  const [isCancelled, setIsCancelled] = useState(false);

  // collection ref
  const ref = collection(db, collectionName);

  // only dispatch if not cancelled
  const dispatchIfNotCancelled = (action: ActionType) => {
    if (!isCancelled) {
      dispatch(action);
    }
  };

  // add a document
  const addDocument = async (data: DocumentData) => {
    dispatch({ type: 'IS_PENDING' });

    try {
      const createdAt = timestamp.fromDate(new Date());
      const addedDocument = await addDoc(ref, { ...data, createdAt });
      dispatchIfNotCancelled({ type: 'ADDED_DOCUMENT', payload: addedDocument });
    } catch (err:any) {
      dispatchIfNotCancelled({ type: 'ERROR', payload: err.message });
    }
  };

  // delete a document
  const deleteDocument = async (id: string) => {
    dispatch({ type: 'IS_PENDING' });

    try {
      const docRef = doc(db, collectionName, id);
      await deleteDoc(docRef);
      dispatchIfNotCancelled({ type: 'DELETED_DOCUMENT' });
    } catch (err) {
      dispatchIfNotCancelled({ type: 'ERROR', payload: 'Could not delete document' });
    }
  };

  // update a document
  const updateDocument = async (id: string, updates: Partial<DocumentData>) => {
    dispatch({ type: 'IS_PENDING' });

    try {
      const docRef = doc(db, collectionName, id);
      await updateDoc(docRef, updates);
      dispatchIfNotCancelled({ type: 'UPDATED_DOCUMENT', payload: docRef });
    } catch (err:any) {
      dispatchIfNotCancelled({ type: 'ERROR', payload: err.message });
    }
  };

  useEffect(() => {
    return () => setIsCancelled(true);
  }, []);

  return { addDocument, deleteDocument, updateDocument, response };
};

