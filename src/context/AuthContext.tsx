// src/context/AuthContext.tsx


import { createContext, useState, useEffect, useContext, type ReactNode } from "react";
import { onAuthStateChanged, type User } from "firebase/auth";
import { auth } from "../lib/firebase/firebase";

// adding in typescript
interface AuthContextType {
    user: null | User;
    loading: boolean;
}


const AuthContext = createContext<AuthContextType>({
    user: null,
    loading: true,
})

// every context needs a provider (prodvider is going to make the state global)
// anything the AuthProvider wraps will have access to the AuthContext, which is the children
export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    // this is for when the app loads, we want to check if the user is logged in or not
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
            setUser(firebaseUser);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);
    
    return (
        // user and setUser are now global and available to any component wrapped in AuthProvider
        <AuthContext.Provider value={{ user, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

// custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);
// import useAuth will give access to user and loading in any component