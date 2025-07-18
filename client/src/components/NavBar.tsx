import React from "react";
import LogOutBtn from "./LogOutBtn";
import LoginBtn from "./LoginBtn";

interface NavbarProps {
  userName: string;
}

const Navbar: React.FC<NavbarProps> = ({ userName }) => {
  return (
    <nav className="bg-white shadow-md px-4 py-2 w-full">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <a href="/" className="flex items-center space-x-2">
          <img
            src="/Localgrub_logo.png"
            alt="LocalGrub"
            className="h-17 w-auto"
          />
        </a>

        <div className="flex items-center gap-4">
          {userName ? (
            <>
              <span className="text-sm text-gray-600 font-medium bg-gray-100 px-4 py-1.5 rounded-full">
                Welcome, {userName}
              </span>
              <LogOutBtn />
            </>
          ) : (
            <LoginBtn />
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
