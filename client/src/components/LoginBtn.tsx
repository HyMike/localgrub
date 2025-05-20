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

    return <button onClick={handleLogin}>Log In</button>;
};

export default LoginBtn;
