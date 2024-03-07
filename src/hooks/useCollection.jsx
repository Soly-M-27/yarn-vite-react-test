import { useState, useEffect, useRef } from 'react';
import { db } from '../firebase/config';
import { collection, onSnapshot, query, where, orderBy } from 'firebase/firestore';

export const useCollection = (c, id, _q, _orderBy) => {
    const [documents, setDocuments] = useState(null);    
    const [errorC, setError] = useState(null);    
    
    // if we don't use a ref --> infinite loop in useEffect
    // _query is an array and is "different" on every function call
    const q = useRef(_q).current;
    const orderByField = useRef(_orderBy.field).current;
    const orderByDirection = useRef(_orderBy.direction).current;

    // Fires once and whenever the collection changes
    useEffect(() => {
        let ref = collection(db, c); //realtime listener for collection change

        if (q) {
            ref = query(ref, where(...q));
        }
        if (orderByField && orderByDirection) {
            ref = orderBy(ref, orderByField, orderByDirection); //fiel is point A and direction is point B on which direction the array organizes itself
        }

        const unsub = onSnapshot(ref, (snapshot) => {
            let results = []
            snapshot.docs.forEach(doc => {
                results.push({ ...doc.data(), id: doc.id });
            });
            console.log("Unsub in useCollection.js setting results to document: ", results);
            setDocuments(results);
            setError(null);
        }, (error) => {
            console.log(error);
            setError('could not fetch the data: ', error);
        });

        //unsubscribe on unmount
        return () => unsub();

    }, [c, q, orderByField, orderByDirection])

    return { documents, errorC };
}