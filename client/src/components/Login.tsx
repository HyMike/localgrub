import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/FirebaseConfig";
import { useLocation, useNavigate } from "react-router-dom";
import SignUpBtn from "./SignUpBtn";
import { sendData } from "../services/orderService";
import { OrderFormData } from "../types/orderformdata";
import { useForm, SubmitHandler, SubmitErrorHandler } from "react-hook-form";

const Login = () => {
  // const [email, setEmail] = useState("");
  // const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  type UserForm = {
    email: string;
    password: string;
    login_incorrect?: string;
  };

  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<UserForm>();

  const state =
    (location.state as { OrderFormData?: OrderFormData; from?: string }) || {};
  const OrderFormData = state.OrderFormData;
  const from = state.from;

  // const handleError: SubmitErrorHandler<UserForm>= (errors) => console.log(errors)

  const handleLogin = async (data: UserForm) => {
    const { email, password } = data;
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password,
      );
      const user = userCredential.user;

      if (OrderFormData && from) {
        const token = await user.getIdToken();
        navigate(from);
        await sendData(OrderFormData, token);
      } else {
        navigate("/");
      }
    } catch (error) {
      setError("login_incorrect", {
        type: "Login Error",
        message: "Email & Password Are Incorrect. Please Try Again",
      });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-full max-w-md bg-white text-gray-900 p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-6 text-center">
          Sign In To Complete Your Purchase
        </h1>
        <form onSubmit={handleSubmit(handleLogin)}>
          {errors.login_incorrect && (
            <p className="text-red-500">{errors.login_incorrect.message}</p>
          )}

          <input
            className="w-full mb-4 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
            type="email"
            placeholder="Enter Your Email"
            {...register("email", {
              required: true,
              onChange: () => clearErrors("login_incorrect"),
            })}
          />
          <input
            className="w-full mb-6 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
            type="password"
            placeholder="Enter Your Password"
            {...register("password", {
              required: true,
              onChange: () => clearErrors("login_incorrect"),
            })}
          />

          <input
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded transition duration-200"
          />
        </form>

        {/* <input
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
        </button> */}

        <div className="mt-4 text-center">
          <SignUpBtn />
        </div>
      </div>
    </div>
  );
};

export default Login;
