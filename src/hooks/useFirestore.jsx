import { useReducer, useState, useEffect } from 'react';
import { db, timestamp } from "../firebase/config";
import { collection, doc, deleteDoc } from 'firebase/firestore';
//import { useAuthContext } from './useAuthContext';

let initialState = {
    document: null,
    isPending: false,
    error: null,
    success: null
}

const firestoreReducer = (state, action) => {
    switch (action.type) {
        case 'IS_PENDING':
            return { isPending: true, document: null, success: false, error: null}
        case 'ADDED_DOCUMENT':
            return { isPending: false, document: action.payload, success: true, error: null }
        case 'DELETED_DOCUMENT':
            return { isPending: false, document: null, success: true, error: null }
        case 'UPDATED_DOCUMENT':
            return { isPending: false, document: action.payload, success: true, error: null }
        case 'ERROR':
            return { isPending: false, document: null, success: false, error: action.payload }
        default:
            return state;
    }
}

export const useFirestore = (c) => {

//    const { user } = useAuthContext();
    
    const [response, dispatch] = useReducer(firestoreReducer, initialState)
    const [isCancelled, setIsCancelled] = useState(false)

    console.log("response from useFirestore.js: ", response);
    console.log("collection (c) in useFirestore.js: ", c);

    // collection ref
    const ref = collection(db, c);

    // only dispatch is not cancelled
    const dispatchIfNotCancelled = (action) => {
        if (!isCancelled) {
            dispatch(action);
        }
    }

    // add a document
    const addDocument = async (doc) => {
        dispatch({ type: 'IS_PENDING' })

        try {
            const createdAt = timestamp.fromDate(new Date())
            const addedDocument = await ref.add({ ...doc, createdAt });
            dispatchIfNotCancelled({ type: 'ADDED_DOCUMENT', payload: addedDocument })

        } catch (err) {
            console.log("err in try/catch of useFirestore function: ", err);
            console.log("err msg in useFirestore.js: ", err.message);
            dispatchIfNotCancelled({ type: 'ERROR', payload: err.message });

        }
    } 


    const deleteDocument = async (id) => {
      dispatch({ type: "IS_PENDING" });
      
      try {
        const doc_ref = doc(db, "profile_info", id);
        await deleteDoc(doc_ref);
        console.log("Document deleted successfully!");

        dispatchIfNotCancelled({ type: "DELETED_DOCUMENT" });

      } catch (err) {
        console.log("Caught error in deleting document: ", err);
        dispatchIfNotCancelled({
          type: "ERROR",
          payload: "could noy delete doc",
        });
      }
    };

    // update documents
    const updateDocument = async (id, updates) => {
        dispatch({ type: 'IS_PENDING'})
        try {
            const updatedDocument = await ref.doc(id).update(updates);
            dispatchIfNotCancelled({ type: 'UPDATED_DOCUMENT', payload: updatedDocument});
            return updatedDocument;
        } catch (err) {
            dispatchIfNotCancelled({ type: 'ERROR', payload: err });
            return null;
        }
    }

    useEffect(() => {
        return () => setIsCancelled(true);
    }, []);

    return { addDocument, deleteDocument, updateDocument, response }
}