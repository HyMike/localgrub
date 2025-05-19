import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { onAuthStateChanged } from "firebase/auth";
import type { User } from "firebase/auth";
import { auth } from "../firebase/firebaseConfig";

type AuthContextType = {
    user: User | null;
    loading: boolean;

}
type AuthProviderProps = {
    children: ReactNode;
};

export const AuthContext = createContext<AuthContextType>({
    user: null,
    loading: true

});

export const AuthProvider = (
    { children }: AuthProviderProps) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setLoading(false);
        });

        return unsubscribe;

    }, []);


    return <AuthContext.Provider value={{ user, loading }}>{children}</AuthContext.Provider>

};


export const useAuth = () => {
    return useContext(AuthContext);
};


