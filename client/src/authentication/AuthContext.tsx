import { createContext, useEffect, useState, ReactNode } from "react";
import { onAuthStateChanged } from "firebase/auth";
import type { User } from "firebase/auth";
import { auth } from "./firebase";

type AuthProviderProps = {
    children: ReactNode;
};

export const AuthContext = createContext<{ user: User | null }>({ user: null });

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        return onAuthStateChanged(auth, setUser);
    }, []);


    return <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>

};


