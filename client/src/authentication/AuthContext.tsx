import { createContext, useContext } from "react";
import { AuthContextType, AuthProviderProps } from "../types/AuthContext";
import useAuthProvider from "../hooks/useAuthProvider";

export const AuthContext = createContext<AuthContextType>({
  user: null,
  superuser: false,
  loading: true,
});

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const { user, superuser, loading } = useAuthProvider();
  return (
    <AuthContext.Provider value={{ user, superuser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
