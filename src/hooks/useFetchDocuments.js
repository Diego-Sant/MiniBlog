import { useState, useEffect } from "react";
import { db } from "../firebase/config";
import { collection, query, orderBy, onSnapshot, where} from "firebase/firestore";

export const useFetchDocuments = (docCollection, search = null, uid = null) => {
    const [documents, setDocuments] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(null);
    const [cancelled, setCancelled] = useState(false)

    useEffect(() => {
        async function loadData() {
            if(cancelled) return

            setLoading(true)

            const collectionRef = await collection(db, docCollection)

            try {
                let querys
                
                if (search) {
                    querys = await query(collectionRef, where("tags", "array-contains", search), orderBy("createdAt", "desc"));
                } else if (uid) {
                    querys = await query(collectionRef, where("uid", "==", uid), orderBy("createdAt", "desc"));
                } else {
                    querys = await query(collectionRef, orderBy("createdAt", "desc"));
                }
                
                await onSnapshot(querys, (QuerySnapshot) => {
                    setDocuments(QuerySnapshot.docs.map((doc) => ({id: doc.id, ...doc.data()})))
                });

                setLoading(false);
            } catch (error) {
                setError(error.message);

                setLoading(false);
            }

        }
        loadData();
    }, [docCollection, search, uid, cancelled]);

    useEffect(() => {
        return () => setCancelled(true);
    }, []);

    return {documents, loading, error};
}