import { signOut } from "firebase/auth";
import { auth } from "../firebase/FirebaseConfig";
import { useAuth } from "../authentication/AuthContext";
import { useNavigate } from "react-router-dom";

const LogOutBtn = () => {
    const navigate = useNavigate();
    const { user } = useAuth();

    const handleLogOut = async () => {
        try {
            await signOut(auth);
            navigate("/");
        } catch (error) {
            console.error("Error Logging Out", error);
        }
    };

    if (!user) return null;

//     return <button onClick={handleLogOut} className="text-white px-4 py-2 rounded-full hover:bg-orange-600 transition">
//     Log Out
// </button>


    return <button className="text-white bg-gray-600 px-4 py-2 rounded-full hover:bg-gray-700 transition duration-200" 
    onClick={handleLogOut}>Sign Out</button>;
};

export default LogOutBtn;
