import { useContext, type JSX } from 'react';
import { AuthContext } from '../authentication/AuthContext';
import { Navigate } from "react-router-dom";


type ChildrenProp = {
    children: JSX.Element

}
const ProtectedRoute = ({ children }: ChildrenProp) => {
    const { user } = useContext(AuthContext);

    return user ? children : <Navigate to="/login" replace />;

};

export default ProtectedRoute; 