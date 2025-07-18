import { useState, useEffect } from "react";
import { User } from "firebase/auth";
import { onAuthStateChanged, getIdTokenResult } from "firebase/auth";
import { auth } from "../firebase/FirebaseConfig";

const useAuthProvider = () => {
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

  return { user, superuser, loading };
};

export default useAuthProvider;
