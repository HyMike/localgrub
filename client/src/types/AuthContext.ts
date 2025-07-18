import { User } from "firebase/auth";
import { ReactNode } from "react";

export type AuthContextType = {
  user: User | null;
  superuser: boolean;
  loading: boolean;
};
export type AuthProviderProps = {
  children: ReactNode;
};
