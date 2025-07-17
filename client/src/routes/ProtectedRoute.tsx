import { useContext, type JSX } from "react";
import { useAuth } from "../authentication/AuthContext";
import { Navigate, useLocation } from "react-router-dom";

type ChildrenProp = {
  children: JSX.Element;
};
const ProtectedRoute = ({ children }: ChildrenProp) => {
  const { user } = useAuth();
  const location = useLocation();

  return user ? (
    children
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
};

export default ProtectedRoute;
