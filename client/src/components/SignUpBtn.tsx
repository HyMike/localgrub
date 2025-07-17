import { useNavigate } from "react-router-dom";

const SignUpBtn = () => {
  const navigate = useNavigate();

  const handleSignUp = async () => {
    try {
      navigate("/signup");
    } catch (error) {
      console.error("Error Logging Out", error);
    }
  };

  return <button onClick={handleSignUp}>Sign Up</button>;
};

export default SignUpBtn;
