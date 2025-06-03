import React from "react";
import LogOutBtn from "./LogOutBtn";
import LoginBtn from "./LoginBtn";

interface NavbarProps {
    userName: string;
    onLogout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ userName, onLogout }) => {
    return (
        <nav className="bg-white shadow-md px-4 py-2 w-full">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
                
          
                <a href="/" className="flex items-center space-x-2">
                    <img
                        src="../src/assets/Localgrub_logo.png"
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

// import React from "react";
// import LogOutBtn from "./LogOutBtn";
// import LoginBtn from "./LoginBtn";

// interface NavbarProps {
//     userName: string;
//     onLogout: () => void;
// }
// const Navbar: React.FC<NavbarProps> = ({ userName, onLogout }) => {
//     return (
//         <nav className="bg-gradient-to-r text-white px-6 py-4 shadow-lg">
//             <div className="max-w-7xl mx-auto flex justify-between items-center">
//                 {/* Logo/Brand Section */}
//                 <div className="flex items-center space-x-2">
//                     <div className="text-2xl font-bold tracking-tight">
//                         <a 
//                             href="/" 
//                             className="hover:text-orange-100 transition-colors duration-200"
//                         >
//                         <img src='../src/assets/Localgrub_logo.png' style={{maxWidth: "100px"}}/>
//                         </a>
//                     </div>
//                 </div>

             
//                 <div className="flex items-center gap-4">
//                     {userName ? (
//                         <div className="flex items-center gap-4">
//                             <div className="bg-white bg-opacity-20 px-4 py-2 rounded-full backdrop-blur-sm">
//                                 <span className="font-medium text-black">
//                                     Welcome, {userName}
//                                 </span>
//                             </div>
//                             <LogOutBtn />
//                         </div>
//                     ) : (
//                         <LoginBtn />
//                     )}
//                 </div>
//             </div>
//         </nav>
//     );
// };

// export default Navbar;

