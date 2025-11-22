import { auth, db } from "../utils/firebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import type { NewUser } from "../types/user";

export const SignUpUser = async (
  email: string,
  password: string,
  userData: NewUser,
) => {
  const userCred = await createUserWithEmailAndPassword(auth, email, password);

  const user = userCred.user;

  await setDoc(doc(db, "users", user.uid), {
    ...userData,
    email: user.email,
    createdAt: new Date(),
  });

  return user;
};
