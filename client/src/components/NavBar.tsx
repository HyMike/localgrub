import React from "react";
import LogOutBtn from "./LogOutBtn";
import LoginBtn from "./LoginBtn";

interface NavbarProps {
    userName: string;
    onLogout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ userName }) => {
    return (
        <nav className="bg-grey-600 text-white px-6 py-4 flex justify-between items-center shadow-md">
            <div className="text-xl font-bold">
                <a href="/">LocalGrub</a>
            </div>

            <div className="flex text-black items-center gap-4">
                {userName ? (
                    <>
                        <span className="font-medium">Hi, {userName}</span>
                        <LogOutBtn />
                    </>
                ) : (
                    <LoginBtn />
                )}

            </div>
        </nav>
    );
};

export default Navbar;
