import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { getIdTokenResult, onAuthStateChanged } from "firebase/auth";
import type { User } from "firebase/auth";
import { auth } from "../firebase/FirebaseConfig";

type AuthContextType = {
    user: User | null;
    superuser: boolean;
    loading: boolean;

}
type AuthProviderProps = {
    children: ReactNode;
};

export const AuthContext = createContext<AuthContextType>({
    user: null,
    superuser: false,
    loading: true

});

export const AuthProvider = (
    { children }: AuthProviderProps) => {
    const [user, setUser] = useState<User | null>(null);
    const [superuser, setSuperuser] = useState(false); 
    const [loading, setLoading] = useState(true);

    useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
        setUser(currentUser);
        if (currentUser) {
        const tokenResult = await getIdTokenResult(currentUser);
        setSuperuser(tokenResult.claims.superuser === true);
        } else {
        setSuperuser(false);
        }
        setLoading(false);
    });

    return unsubscribe;
    }, []);


    return <AuthContext.Provider value={{ user, superuser, loading }}>{children}</AuthContext.Provider>

};


export const useAuth = () => {
    return useContext(AuthContext);
};


