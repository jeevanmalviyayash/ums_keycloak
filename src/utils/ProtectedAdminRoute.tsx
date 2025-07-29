import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { RootState } from "../app/store";

const ProtectedAdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useSelector((state: RootState) => state.token);
  const { role } = useSelector((state: RootState) => state.login);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return role === "ADMIN" || role === "SUPER_ADMIN" ? (
    children
  ) : (
    <Navigate to="/" replace />
  );
};

export default ProtectedAdminRoute;
