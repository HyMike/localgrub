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

    return <button onClick={handleLogOut}>Log Out</button>;
};

export default LogOutBtn;
