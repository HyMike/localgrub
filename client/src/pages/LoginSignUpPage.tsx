import React from "react";
import SignUp from "../components/SignUp";
import {useState} from 'react';
import Login from "../components/Login";

const LoginSignUpPage = () => {
  
const [isActiveBtn, setIsActiveBtn] = useState<'login' | 'signUp'>('login');

  const handleClickLogin = () => {
    setIsActiveBtn("login");
  }
  const handleClickSignUp = () => {
    setIsActiveBtn("signUp");
  }

  return (
    <div className="grid grid-cols-2 full-width h-screen w-full"> 

      { isActiveBtn == 'login' ?  <Login /> : <SignUp /> }

      <div className="relative overflow-hidden w-full h-full"> 
        <img className='object-cover w-full h-full z-0' src='../public/food_login.jpeg' alt='food on table'/>
          <div className="absolute top-[350px] left-[-40px] flex flex-col z-10 space-y-4">
            <button 
              className="bg-black text-white w-[250px] px-4 py-2 h-14" 
              style={{
                borderRadius: '9999px', 
                backgroundColor: isActiveBtn == "login" ? "rgba(0, 0, 0, 0)" : "rgba(0, 0, 0, 1)",
                fontWeight: isActiveBtn == 'login' ? "900" : "normal",
                fontSize: isActiveBtn == 'login' ? "20px" : "17px",
                }}
              onClick={handleClickLogin}
                >Login
            </button>
            <button className="bg-black text-white w-[250px] px-4 py-2 h-14" 
              style={{
              borderRadius: '9999px',
              fontWeight: isActiveBtn == 'signUp' ? "900": "normal",
              backgroundColor: isActiveBtn == "signUp" ? "rgba(0, 0, 0, 0)" : "rgba(0, 0, 0, 1)",
              fontSize: isActiveBtn == 'signUp' ? "20px" : "17px",
              }}
              onClick={handleClickSignUp}
              >Sign Up</button>
        </div>
    
      </div>
   
    </div>
  );
};

export default LoginSignUpPage;
