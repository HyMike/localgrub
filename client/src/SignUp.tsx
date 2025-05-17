import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "./authentication/firebase";
import { doc, setDoc } from "firebase/firestore";


const SignUp = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");


    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const userCred = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCred.user;

            await setDoc(doc(db, "users", user.uid), {
                email: user.email,
                firstName: firstName,
                lastName: lastName,
                createdAt: new Date(),
            });
            //need to redirect to success page.
            alert("Signup successful!");

        } catch (error) {
            console.error(error);
        }

    };

    return (
        <form onSubmit={handleSignUp}>
            <input
                placeholder="First Name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
            />
            <input
                placeholder="Last Name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
            />
            <input
                placeholder="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
            />
            <input
                placeholder="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
            />
            <button>Sign Up</button>
        </form>

    );
};

export default SignUp;