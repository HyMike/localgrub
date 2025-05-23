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
        <form
            onSubmit={handleSignUp}
            className="max-w-md mx-auto mt-16 bg-white p-10 rounded-2xl shadow-xl space-y-6"
        >
            <h1 className="text-3xl font-bold text-center text-gray-800">
                Sign Up To Order Food
            </h1>

            <input
                type="text"
                placeholder="First Name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
                className="w-full px-5 py-4 text-lg border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400"
            />

            <input
                type="text"
                placeholder="Last Name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
                className="w-full px-5 py-4 text-lg border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400"
            />

            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-5 py-4 text-lg border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400"
            />

            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-5 py-4 text-lg border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400"
            />

            <button
                type="submit"
                className="w-full py-4 bg-orange-500 text-white text-lg font-semibold rounded-xl hover:bg-orange-600 transition duration-200"
            >
                Sign Up
            </button>
        </form>


    );
};

export default SignUp;