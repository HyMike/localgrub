import { useState } from "react";
import { SignUpUser } from "../services/authService";
import { useNavigate } from "react-router-dom";


const SignUp = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const navigate = useNavigate();


    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await SignUpUser(email, password,
                { email, firstName, lastName });
            navigate("/success");

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