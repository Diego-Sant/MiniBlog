import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile, signOut } from 'firebase/auth'
import {db} from "../firebase/config"
import { useState, useEffect } from 'react'
import { collection, doc, getDocs, query, setDoc, where } from 'firebase/firestore';

export const useAuthentication = () => {
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(null);

    const [cancelled, setCancelled] = useState(false);
    const auth = getAuth();

    function checkIfIsCancelled() {
        if (cancelled) {
            return;
        }
    }
    
    // Criar usuário
    const createUser = async (data) => {
        checkIfIsCancelled()

        setLoading(true)
        setError(null)

        try {
            const usersRef = collection(db, "users");
            const querySnapshot = await getDocs(query(usersRef, where("username", "==", data.displayName)));
        
            if (querySnapshot.size > 0) {
              setLoading(false);
              setError("Nome do usuário já está em uso!");
              return null;
            }
        
            const { user } = await createUserWithEmailAndPassword(auth, data.email, data.password);
        
            const userDocRef = doc(usersRef, user.uid);
        
            await setDoc(userDocRef, {
              email: data.email,
              username: data.displayName
            });
        
            await updateProfile(user, { displayName: data.displayName });
        
            setLoading(false);
        
            return user;
          } catch (error) {
            console.log(error.message);
        
            let systemErrorMessage;
        
            if (error.message.includes("Password")) {
              systemErrorMessage = "A senha precisa conter pelo menos 6 caracteres!";
            } else if (error.message.includes("email-already")) {
              systemErrorMessage = "Email já cadastrado!";
            } else {
              systemErrorMessage = "Ocorreu um erro, tente novamente mais tarde!";
            }
        
            setLoading(false);
            setError(systemErrorMessage);
            return null;
          }
        };

    // Logout
    const logout = () => {
        checkIfIsCancelled();

        signOut(auth)
    }

    // Logar com a conta
    const login = async(data) => {
        checkIfIsCancelled()

        setLoading(true)
        setError(null)

        try {
            await signInWithEmailAndPassword(auth, data.email, data.password)
            setLoading(false)
        } catch (error) {
            let systemErrorMessage

            if (error.message.includes("user-not-found")) {
                systemErrorMessage = "Email não encontrado!"
            } else if (error.message.includes("wrong-password")) {
                systemErrorMessage = "Senha incorreta!"
            } else {
                systemErrorMessage = "Ocorreu um erro, tente mais tarde novamente!"
            }

            setLoading(false)
            setError(systemErrorMessage)
        }
    }

    useEffect(() => {
        return () => setCancelled(true);
    }, [])

    return {auth, createUser, error, loading, logout, login};
}