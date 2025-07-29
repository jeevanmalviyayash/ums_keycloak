import { useSelector } from "react-redux";
import { RootState } from "../app/store";
import { Navigate } from "react-router-dom";

const RedirectIfAuthenticate = ({ children }) => {
  const { isAuthenticated } = useSelector((state: RootState) => state.token);

  return isAuthenticated ? <Navigate to={"/"} replace /> : children;
};

export default RedirectIfAuthenticate;
