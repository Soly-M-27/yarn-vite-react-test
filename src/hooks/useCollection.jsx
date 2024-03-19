import { useState, useEffect, useRef } from 'react';
import { db } from '../firebase/config';
import { collection, onSnapshot, query, where, orderBy } from 'firebase/firestore';

export const useCollection = (c, _q, _orderBy, userId) => {
    const [documents, setDocuments] = useState({});    
    const [errorC, setError] = useState(null);    

    console.log("tyepof userId in useCollection: ", typeof userId);
    console.log("userId in useCollection: ", userId);
    
    // if we don't use a ref --> infinite loop. In useEffect,
    // _query is an array and is "different" on every function call
    const q = useRef(_q).current;
    console.log("What is q in useCollection.jsx: ", q)
    const orderByField = useRef(_orderBy?.field).current;
    const orderByDirection = useRef(_orderBy?.direction).current;

    // Fires once and whenever the collection changes

    /* UseEffect Hook is because I want this code to 
       run right away as soon as the component mounts. */
    useEffect(() => {
        let ref = collection(db, c); //realtime listener for collection change

        if (q) {
            ref = query(ref, where(...q));
            console.log("What is ref after checking q: ", ref);
        }
        if (orderByField && orderByDirection) {
            ref = orderBy(ref, orderByField, orderByDirection); //fiel is point A and direction is point B on which direction the array organizes itself
            console.log("What is ref after checking orderByField/orderByDirection: ", ref);
        }

        const unsub = onSnapshot(ref, (snapshot) => {
            let results = []
            snapshot.docs.forEach(doc => {
                results.push({ ...doc.data(), id: doc.id });
            });
            console.log("Unsub in useCollection.jsx setting results to document: ", results);
            // update state
            setDocuments(results);
            setError(null);
        }, (error) => {
            console.log('could not fetch data: ', error);
            setError('could not fetch the data: ', error);
        });

        //unsubscribe on unmount
        return () => unsub();

    }, [c, q, orderByField, orderByDirection, userId])

    return { documents, errorC };
}