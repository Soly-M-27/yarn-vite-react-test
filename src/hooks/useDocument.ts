import { useEffect, useState } from "react";
import { db } from "../firebase/config";
import { doc, DocumentSnapshot, DocumentData, Firestore, onSnapshot } from "firebase/firestore";

type UseDocumentReturnType = {
  document: DocumentData | null;
  error: string | null;
};

export const useDocument = (collectionName: string, documentId: string): UseDocumentReturnType => {
  const [document, setDocument] = useState<DocumentData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const ref = doc(db, collectionName, documentId);

    const unsubscribe = onSnapshot(
      ref,
      (snapshot: DocumentSnapshot<DocumentData>) => {
        if (snapshot.exists()) {
          setDocument({ ...snapshot.data(), id: snapshot.id });
          setError(null);
        } else {
          setError('No such document exists');
        }
      },
      (err) => {
        console.error(err.message);
        setError("Failed to get document");
      }
    );

    return () => unsubscribe();

  }, [collectionName, documentId]);

  return { document, error };
};

