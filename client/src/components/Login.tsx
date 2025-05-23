import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/firebaseConfig";
import { useLocation, useNavigate } from "react-router-dom";
import SignUpBtn from "./SignUpBtn";
import { sendData, FormData } from "../utils/sendData.utils";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const location = useLocation();

    const state = location.state as { formData?: FormData; from?: string } || {};
    const formData = state.formData;
    const from = state.from;

    const handleLogin = async () => {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            if (formData && from) {
                const token = await user.getIdToken();
                navigate(from);
                await sendData(formData, token);

            } else {
                navigate("/");
            }
        } catch (error) {
            console.error("Login failed:", error);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="w-full max-w-md bg-white text-gray-900 p-8 rounded-lg shadow-md">
                <h1 className="text-2xl font-bold mb-6 text-center">
                    Sign In To Complete Your Purchase
                </h1>

                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full mb-4 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />

                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full mb-6 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />

                <button
                    onClick={handleLogin}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded transition duration-200"
                >
                    Login
                </button>

                <div className="mt-4 text-center">
                    <SignUpBtn />
                </div>
            </div>
        </div>
    );
};

export default Login;


// import { useState } from "react";
// import { signInWithEmailAndPassword } from "firebase/auth";
// import { auth } from "../firebase/firebaseConfig";
// import { useLocation, useNavigate } from "react-router-dom";
// import SignUpBtn from "./SignUpBtn";
// import { sendData } from "../utils/sendData.utils";


// const Login = () => {
//     const [email, setEmail] = useState("");
//     const [password, setPassword] = useState("");
//     const navigate = useNavigate();
//     const location = useLocation();

//     const { formData, from } = location.state || {};


//     const handleLogin = async () => {
//         try {
//             const userCredential = await signInWithEmailAndPassword(auth, email, password);
//             const user = userCredential.user;

//             if (formData && from) {
//                 const token = await user.getIdToken();
//                 await sendData(formData, token);
//                 navigate(from);
//             } else {
//                 navigate("/");
//             }
//         } catch (error) {
//             console.error(error);
//         }
//     };
//     //     try {
//     //         await signInWithEmailAndPassword(auth, email, password);
//     //         navigate("/");
//     //     } catch (error) {
//     //         console.error(error);
//     //     }
//     // };

//     return (
//         <div className="flex items-center justify-center min-h-screen ">
//             <div className="w-full max-w-md bg-white text-gray-900 p-8 rounded-lg shadow-md">
//                 <h1 className="text-2xl font-bold mb-6 text-center">
//                     Sign In To Complete Your Purchase
//                 </h1>

//                 <input
//                     type="email"
//                     placeholder="Email"
//                     value={email}
//                     onChange={(e) => setEmail(e.target.value)}
//                     className="w-full mb-4 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                 />

//                 <input
//                     type="password"
//                     placeholder="Password"
//                     value={password}
//                     onChange={(e) => setPassword(e.target.value)}
//                     className="w-full mb-6 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                 />

//                 <button
//                     onClick={handleLogin}
//                     className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded transition duration-200"
//                 >
//                     Login
//                 </button>

//                 <div className="mt-4 text-center">
//                     <SignUpBtn />
//                 </div>
//             </div>
//         </div>

//     );
// };

// export default Login;
