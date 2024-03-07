import { useEffect, useState } from "react";
import { db } from "../firebase/config";

export const useDocument = (c, id) => {

    const [document, setDocument] = useState(null);
    const [error, setError] = useState(null);

    //realtime data for document
    useEffect(() => {
        const ref = db.collection(c).doc(id);

        const unsub = ref.onSnapshot((snapshot) => {
            if (snapshot.data()) {
                setDocument({ ...snapshot.data(), id: snapshot.id })
                setError(null);
            } else {
                setError('no such document exists');
            }
        }, (err) => {
            console.log(err.message);
            setError("failed to get document in useDocument.js hook");
        });

        return () => unsub();

    }, [c, id]);

    return { document, error }
}