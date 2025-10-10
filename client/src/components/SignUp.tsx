import { useState } from "react";
import { SignUpUser } from "../services/authService";
import { useNavigate } from "react-router-dom";
import { useForm, SubmitHandler } from "react-hook-form";

const SignUp = () => {
  const navigate = useNavigate();

  const handleSignUp = async (data: SignUpUser) => {
    const { firstName, lastName, email, password } = data;

    if (!firstName || !lastName || !email || !password) {
      console.error("Please fill in all fields");
      return;
    }

    try {
      await SignUpUser(email, password, { email, firstName, lastName });
      navigate("/success");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  type SignUpUser = {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpUser>({
    defaultValues: {
      email: "",
      password: "",
      firstName: "",
      lastName: "",
    },
  });

  return (
    <form
      className="max-w-md mx-auto mt-70 h-[50%] bg-white p-10 rounded-2xl shadow-xl space-y-6"
      data-testid="signup-form"
      onSubmit={handleSubmit(handleSignUp)}
    >
      <h1 className="text-3xl font-bold text-center text-gray-800">
        Sign Up To Order Food
      </h1>

      <input
        className="w-full px-5 py-4 text-lg border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400"
        type="text"
        placeholder="First Name"
        {...register("firstName", {
          required: true,
          minLength: {
            value: 2,
            message: "Must contain more than 2 characters.",
          },
          maxLength: {
            value: 50,
            message: "Name is too Long",
          },
        })}
      />
      {errors.firstName?.message && (
        <p className="text-red-500">{errors.firstName.message}</p>
      )}
      <input
        className="w-full px-5 py-4 text-lg border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400"
        type="text"
        placeholder="Last Name"
        {...register("lastName", {
          required: true,
          minLength: {
            value: 2,
            message: "Must contain more than 2 characters.",
          },
          maxLength: {
            value: 50,
            message: "Name is too Long",
          },
        })}
      />
      {errors.lastName?.message && (
        <p className="text-red-500">{errors.lastName.message}</p>
      )}
      <input
        className="w-full px-5 py-4 text-lg border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400"
        type="email"
        placeholder="Enter Your Email"
        {...register("email", { required: true })}
      />
      <input
        className="w-full px-5 py-4 text-lg border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400"
        type="password"
        placeholder="Enter Your Password"
        {...register("password", { required: true })}
      />
      <input
        className="w-full py-4 bg-orange-500 text-white text-lg font-semibold rounded-xl hover:bg-orange-600 transition duration-200"
        type="submit"
      />
    </form>
  );
};

export default SignUp;
