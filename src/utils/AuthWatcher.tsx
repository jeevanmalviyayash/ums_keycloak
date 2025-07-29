// components/AuthWatcher.tsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { jwtDecode } from "jwt-decode";
import { AppDispatch, RootState } from "../app/store";
import { clearToken, setIsAuthentication } from "../features/token/tokenSlice";


interface JwtPayload {
  exp: number;
}

const AuthWatcher = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { token } = useSelector((state: RootState) => state.token);



  useEffect(() => {
    //const token = localStorage.getItem("token");
    if (token) {
      const decoded = jwtDecode<JwtPayload>(token);
      if (decoded.exp * 1000 < Date.now()) {
        alert("Session expired. Please log in again.");
            dispatch(setIsAuthentication(false));
            dispatch(clearToken());
        navigate("/login");
      } else {
        const timeout = decoded.exp * 1000 - Date.now();
        setTimeout(() => {
          alert("Session expired. Please log in again.");
             dispatch(setIsAuthentication(false));
            dispatch(clearToken());
             navigate("/login");
        }, timeout);
      }
    }
  }, []);

  return null;
};

export default AuthWatcher;
