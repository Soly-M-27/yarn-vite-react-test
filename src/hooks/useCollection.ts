import { useState, useEffect, useRef } from 'react';
import { db } from '../firebase/config';
import {
  collection,
  onSnapshot,
  query,
  where,
  orderBy,
  QueryConstraint,
  QuerySnapshot,
  DocumentData,
  OrderByDirection,
} from 'firebase/firestore';

type OrderByType = {
  field: string;
  direction: OrderByDirection;
};

type UseCollectionReturnType = {
  documents: Array<DocumentData>;
  error: string | null;
};

export const useCollection = (
  collectionName: string,
  constraints: QueryConstraint[] | null,
  orderByOptions: OrderByType | null,
  userId: number
): UseCollectionReturnType => {
  const [documents, setDocuments] = useState<DocumentData[]>([]);
  const [error, setError] = useState<string | null>(null);

  const q = useRef<QueryConstraint[] | null>(constraints).current;
  const orderByField = useRef<string | undefined>(orderByOptions?.field).current;
  const orderByDirection = useRef<OrderByDirection | undefined>(orderByOptions?.direction).current;

  useEffect(() => {
    let queryRef = collection(db, collectionName);
    console.log('queryRef:', queryRef);

//    if (q) {
//      q.forEach((constraint) => {
//        queryRef = query(queryRef, where(constraint));
//      });
//    }
//    if (orderByField && orderByDirection) {
//      queryRef = query(queryRef, orderBy(orderByField, orderByDirection));
//    }

    const unsubscribe = onSnapshot(
      queryRef,
      (snapshot: QuerySnapshot<DocumentData>) => {
        const results: DocumentData[] = [];
        snapshot.docs.forEach((doc) => {
          results.push({ ...doc.data(), id: doc.id });
        });
        setDocuments(results);
        setError(null);
      },
      (error) => {
        console.log('Could not fetch data:', error);
        setError(`Could not fetch the data: ${error}`);
      }
    );

    return () => unsubscribe();
  }, [collectionName, q, orderByField, orderByDirection, userId]);

  return { documents, error };
};

