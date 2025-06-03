import { useAuth } from "../authentication/AuthContext";
import { useNavigate } from "react-router-dom";

const LoginBtn = () => {
    const navigate = useNavigate();
    const { user } = useAuth();

    const handleLogin = async () => {
        try {
            navigate("/login");
        } catch (error) {
            console.error("Error Logging Out", error);
        }
    };

    return <button className="text-white bg-gray-600 px-4 py-2 rounded-full hover:bg-gray-700 transition duration-200"
 onClick={handleLogin}>Sign In</button>;

};

export default LoginBtn;
