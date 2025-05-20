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

            <div className="flex items-center gap-4">
                {userName ? (
                    <>
                        <span className="font-medium">Signed in as {userName}</span>
                        <LogOutBtn />
                    </>
                ) : (
                    <LoginBtn />
                )}

                {/* <button
                    onClick={onLogout}
                    className="bg-white text-blue-600 px-4 py-1 rounded hover:bg-gray-100 transition"
                >
                    Log Out
                </button> */}
            </div>
        </nav>
    );
};

export default Navbar;
