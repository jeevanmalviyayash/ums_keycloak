import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { RootState, AppDispatch } from "../../app/store";
import AlertModal from "../../utils/AlertModal";
import {
  closeModal,
  setIsOpen,
  setMessage,
} from "../../features/modal/modalSlice";

import { loginUser } from "../../features/login/loginAction";
import {
  clearFieldError,
  LoginState,
  setError,
  setFieldError,
  setRole,
  setUser,
} from "../../features/login/loginSlice";
import { loginValidation } from "../../utils/loginValidation";
import { setIsAuthentication, setToken } from "../../features/token/tokenSlice";
import ChangePasswordModal from "../ChangePassModal";
import { jwtDecode } from "jwt-decode";
import { getFilterdUser } from "../../features/register/registerAction";
import { fetchRole } from "../../features/role/roleAction";

const Login = () => {
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();
  const { message, isOpen } = useSelector(
    (state: RootState) => state.alertModal
  );
  const [showPassword, setShowPassword] = useState(false);
  const [userRoles, setUserRoles] = useState<Role[]>([]);

  const { fieldError, shouldRedirect } = useSelector(
    (state: RootState) => state.login
  );

    const [filters, setFilters] = useState({
    email: "",
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    company: "",
    phoneNumber: "",
    roleId: "",
  });
  useEffect(() => {
    dispatch(clearFieldError());
  }, []);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCloseModal = () => {
    dispatch(closeModal());
  };

  const [loginForm, setLoginForm] = useState<LoginState>({
    email: "",
    password: "",
    isAuthenticated: false,
    loading: false,
    error: null,
    fieldError: {},
    shouldRedirect: false,
    role: "",
    user: {},
  });

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    let trimmedValue = value;
    const hasOnlySpaces = value.length > 0 && trimmedValue === "";
    const forbiddenChars = /[`~!#$%^&*():{}=]/;
    if (hasOnlySpaces || forbiddenChars.test(value)) return;

    if (["email", "password"].includes(name)) {
      trimmedValue = value.replace(/\s+/g, "");
    }

    setLoginForm({
      ...loginForm,
      [name]: trimmedValue,
    });
  };
  
  const fetchUsers = async (token, searchFilers = {}) => {
      try {
        const data = await getFilterdUser(token, searchFilers);
  
      // Handle known error structure from Java backend
      if (data?.status === "INTERNAL_SERVER_ERROR" || data?.message === "No users found") {
        console.warn("Backend response:", data.message || "No users found.");
        dispatch(setIsOpen(true));
        dispatch(setMessage(data?.message));
       // setUsers([]); // Show empty list
        return;
      }
        return data;
  
      } catch (error) {
        console.error("Failed to fetch users:", error);
      }
    };
    
      const fetchAndFilterRoles = async (token) => {
        try {
          const response = await dispatch(fetchRole(token));
          const result = response.payload;
    
          let filterDropDown = result;
          const currentUserRole = role;
    
          if (currentUserRole === "SUPER_ADMIN") {
            filterDropDown = result.filter(
              (role: any) => role.name !== "SUPER_ADMIN"
            );
          } else if (currentUserRole === "ADMIN") {
            filterDropDown = result.filter(
              (role: any) => role.name !== "SUPER_ADMIN" && role.name !== "ADMIN"
            );
          }
          setUserRoles(filterDropDown);
        } catch (error) {
          console.error("Error fetching roles: ", error);
        }
      };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log(loginForm);

    const isValid = loginValidation(loginForm, dispatch);

    if (isValid) {
      try {
        const resultAction = await dispatch(loginUser(loginForm));

        if (loginUser.fulfilled.match(resultAction)) {
          if (resultAction.payload.mustChangePassword) {
            loginForm.password = "";
            navigate("/changepass");
            console.log("Login Successfull", resultAction.payload);
            dispatch(setUser(resultAction.payload));
            // dispatch(setIsAuthentication(true));
            const { token, role } = resultAction.payload;
            dispatch(setRole(role));
            // store the token in redux
            dispatch(setToken(resultAction.payload.token));
          } else {
            console.log("Login Successfull", resultAction.payload);
            const decoded = jwtDecode(resultAction.payload.access_token);
            filters.email =loginForm.email;
            const data = await fetchUsers(resultAction.payload.access_token, filters);
          //  const roles = await fetchAndFilterRoles(resultAction.payload.access_token);
          const rolesss = await dispatch(fetchRole(resultAction.payload.access_token));
          const result = rolesss.payload;
           dispatch(setUser(data[0]));
           dispatch(setRole(data[0].roleName));

            dispatch(setIsAuthentication(true));

            //const { token, role } = resultAction.payload;
            //dispatch(setRole(role));

            // store the token in redux
            dispatch(setToken(resultAction.payload.access_token));
            if (matchedRole === "ADMIN" || matchedRole === "SUPER_ADMIN") {
              navigate("/admin/users");
              //  return;
            }
            // store in sessionStorage
            // sessionStorage.setItem("token", token);
            // sessionStorage.setItem("role", role);

            //navigate("/");
            navigate("/admin/users");
            setLoginForm({
              email: "",
              password: "",
              isAuthenticated: false,
              loading: false,
              error: null,
              fieldError: {},
              shouldRedirect: false,
              role: "",
              user: {},
            });
          }
        } else if (loginUser.rejected.match(resultAction)) {
          const payload = resultAction.payload;
          console.log("payload Rejected", payload);

          if (payload && typeof payload === "object") {
            dispatch(setIsOpen(true));
            dispatch(setMessage(payload?.message as string));
            dispatch(setError(payload?.message as string));
          }
          setTimeout(() => {
            dispatch(clearFieldError());
          }, 3000);
        } else {
          dispatch(setError("Registration Failed"));
        }
      } catch (error) {
        console.error("Unexpected error:", error);
      }
    } else {
      console.log("Validation failed");
    }
  };

  //Restrict user after authentication to go back on login page
  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (token) {
      dispatch(setToken(token));
      navigate("/dashboard");
    }
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="  w-full md:w-[50%]     max-w-4xl shadow-lg border ring-0 ring-gray-800 border-gray-600 rounded-lg p-10 bg-white flex flex-col md:flex-row items-center gap-0 ">
        <div className="w-full   md:w-1/2 flex justify-center">
          <svg
            className="w-full max-w-md h-auto  "
            width="800.012"
            height="793.179"
            viewBox="0 0 800.012 793.179"
            role="img"
            style={{ width: "60%", height: "auto" }}
          >
            <g transform="translate(-571.203 -218.417)">
              <path
                d="M981.632,982.127H424.5V410.494c0-121.619,98.944-220.563,220.563-220.563H761.069c121.619,0,220.563,98.944,220.563,220.563Z"
                transform="translate(244.764 28.486)"
                fill="#f2f2f2"
              />
              <path
                d="M865.627,982.125H424.5V410.492a218.856,218.856,0,0,1,42.122-129.658c1.013-1.381,2.024-2.744,3.066-4.092a220.511,220.511,0,0,1,46.943-45.564c1.007-.733,2.018-1.453,3.044-2.173a220.046,220.046,0,0,1,48.039-25.123c1.009-.382,2.036-.765,3.063-1.133a219.832,219.832,0,0,1,47.484-11.2c1-.137,2.035-.244,3.065-.352a223.293,223.293,0,0,1,47.479,0c1.028.107,2.059.215,3.074.353a219.788,219.788,0,0,1,47.471,11.2c1.027.367,2.055.75,3.066,1.134A219.5,219.5,0,0,1,769.9,228.635c1.025.7,2.051,1.424,3.062,2.144a222.832,222.832,0,0,1,28.06,23.757,220.263,220.263,0,0,1,19.423,22.21c1.039,1.344,2.049,2.707,3.061,4.086a218.858,218.858,0,0,1,42.124,129.66Z"
                transform="translate(244.764 28.488)"
                fill="#ccc"
              />
              <circle
                cx="24.422"
                cy="24.422"
                r="24.422"
                transform="translate(1050.098 564.909)"
                fill="#6c63ff"
              />
              <path
                d="M1064.222,710.828H266.783c-.71,0-1.286-.814-1.286-1.817s.576-1.818,1.286-1.818h797.439c.71,0,1.286.814,1.286,1.818S1064.933,710.828,1064.222,710.828Z"
                transform="translate(305.707 300.768)"
                fill="#e6e6e6"
              />
              <path
                d="M705.852,759.927H507.422a9.869,9.869,0,0,1-9.922-9.792V307.223a9.869,9.869,0,0,1,9.921-9.792H705.852a9.869,9.869,0,0,1,9.921,9.792V750.135a9.869,9.869,0,0,1-9.922,9.792Z"
                transform="translate(283.19 85.073)"
                fill="#fff"
              />
              <rect
                width="218.274"
                height="3.053"
                transform="translate(780.69 525.816)"
                fill="#ccc"
              />
              <rect
                width="218.274"
                height="3.053"
                transform="translate(781.453 699.995)"
                fill="#ccc"
              />
              <rect
                width="3.053"
                height="464.023"
                transform="translate(849.378 382.505)"
                fill="#ccc"
              />
              <rect
                width="3.053"
                height="464.023"
                transform="translate(925.697 382.505)"
                fill="#ccc"
              />
              <g transform="translate(1075.599 381.07)">
                <path
                  d="M532.06,220.925a23,23,0,0,1-.621,5.294l-17.588,74.846a19.759,19.759,0,0,1-23.787,14.714l-70.488-21.872-3.442-1.063a20.41,20.41,0,0,1-15.462,3.21c-10.231-1.81-17.314-10.136-15.82-18.609s11-13.862,21.23-12.062a20.45,20.45,0,0,1,13.441,8.294l.052.01.179.032,61.352,7.589,5.157-62.226a22.937,22.937,0,0,1,45.8,1.842Z"
                  transform="translate(-384.654 -92.478)"
                  fill="#ed9da0"
                />
                <path
                  d="M523.778,220.925a23,23,0,0,1-.621,5.294l-14.431,78a19.759,19.759,0,0,1-23.787,14.714l-70.488-19.6,3.158-30.523h0l53.679,7.368,6.694-57.1a22.937,22.937,0,0,1,45.8,1.842Z"
                  transform="translate(-376.371 -92.478)"
                  fill="#6c63ff"
                />
                <rect
                  width="21.152"
                  height="21.152"
                  transform="translate(221.929 552.023) rotate(-36.399)"
                  fill="#ed9da0"
                />
                <path
                  d="M601.519,570.531l-36.191,26.681a25.93,25.93,0,0,1-10.5,4.579l-9.036,1.712a4.978,4.978,0,0,1-4.842-7.965l10.957-13.956,14.423-29.737.083.076c2.085,1.906,5.251,4.772,5.488,4.912,4.454.986,7.875.432,10.167-1.646,4-3.624,3.193-10.733,3.184-10.8l-.007-.055.047-.028a3.561,3.561,0,0,1,3.119-.427c2.082.76,3.168,3.492,3.324,3.911,2.032.285,7.318,6.345,7.743,6.836,3.041.551,5.135,1.693,6.223,3.393a6.917,6.917,0,0,1,.548,5.635A12.556,12.556,0,0,1,601.519,570.531Z"
                  transform="translate(-341.504 3.596)"
                  fill="#2f2e43"
                />
                <rect
                  width="21.152"
                  height="21.152"
                  transform="translate(71.799 589.151)"
                  fill="#ed9da0"
                />
                <path
                  d="M469.188,615.868H424.225a25.933,25.933,0,0,1-11.168-2.545l-8.289-3.984a4.978,4.978,0,0,1,.829-9.284l17.1-4.732,29.255-15.377.022.111c.547,2.771,1.395,6.957,1.5,7.211,3,3.437,6.082,5.021,9.16,4.708,5.369-.544,8.938-6.744,8.974-6.807l.027-.048.055.006a3.561,3.561,0,0,1,2.764,1.507c1.225,1.847.478,4.691.355,5.12,1.467,1.435,2.125,9.45,2.176,10.1,2.121,2.248,3.129,4.409,3,6.424a6.918,6.918,0,0,1-2.9,4.861,12.557,12.557,0,0,1-7.893,2.733Z"
                  transform="translate(-379.847 13.676)"
                  fill="#2f2e43"
                />
                <path
                  d="M550.486,317.714H449.111L432.951,654.023h35.7l23.066-152.868,92.559,122.294,33.792-30.574-67.584-91.721Z"
                  transform="translate(-371.229 -59.214)"
                  fill="#2f2e43"
                />
                <path
                  d="M522.94,162.995a37.361,37.361,0,1,0-48.555,35.653l7.223,47.733,36.82-30.683s-7.954-10.131-12.22-21.556A37.321,37.321,0,0,0,522.94,162.995Z"
                  transform="translate(-366.985 -112.605)"
                  fill="#ed9da0"
                />
                <path
                  d="M524.276,281.639l16.557,48.79-93.675-1.053,13.967-44.58Z"
                  transform="translate(-367.28 -69.241)"
                  fill="#ed9da0"
                />
                <path
                  d="M518.46,184.739l-41.541,14.442L437.647,401.925l80.814,9.867h39.5l-30.18-201.615a67.286,67.286,0,0,0-9.323-25.438h0Z"
                  transform="translate(-369.923 -96.176)"
                  fill="#6c63ff"
                />
                <path
                  d="M497.342,378.487l.723-33.325-19.458-.422-.723,33.325a20.428,20.428,0,0,0-6.155,14.543c-.225,10.388,6.561,18.96,15.158,19.147s15.749-8.083,15.974-18.471a20.428,20.428,0,0,0-5.519-14.8Z"
                  transform="translate(-360.452 -51.702)"
                  fill="#ed9da0"
                />
                <path
                  d="M421.883,197.209c1.943.331,4.223-4.377,6.4-8.963,4.562-9.6,7.462-15.7,7.682-24.328.188-7.352-1.854-5.422-3.841-21.767-.655-5.391-9.865-5.381-11.74-7.941-3.166-4.324,1.692-6.107-6.186-8.7-14.756-4.865-21.428,2.693-30.8,3.344-.237.016-4.882,4.56-7.477,4.795-4.546.412-11.1-.3-14.043-7.222-2.749-6.476-4.57,12.448-2.113,14.789a49.753,49.753,0,0,1,5.776,7.342c.1.411-4.331-12.944-5.776-8.99-1.04,2.845-1.991,21.244.654,21.794,2.212.46,20.594,7.52,40.974-6.4.723-.494.04.294,2.561,6.4,3.179,7.7,3.9,8.121,3.841,10.243-.12,4.593-3.569,5.946-2.561,8.963a6.2,6.2,0,0,0,6.4,3.841c2.7-.558,3.165-3.9,5.122-3.841,1.676.051,3.664,2.575,3.841,5.122.373,5.366-7.571,6.842-8.963,14.085-.786,4.088,8.458-2.865,10.243-2.561Z"
                  transform="translate(-274.113 -123.882)"
                  fill="#090814"
                />
              </g>
            </g>
          </svg>
        </div>
        <form className="w-full md:w-1/2" onSubmit={handleSubmit}>
          <h4 className="text-center text-2xl text-purple-900 font-bold">
            Login
          </h4>
          <div className="mb-5">
            <label
              htmlFor="email"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={loginForm.email}
              onChange={handleChange}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Enter email"
            />
            <small
              className={`text-red-500 block text-xs leading-tight min-h-[0.5rem] overflow-hidden break-words   ${
                !fieldError.email ? "invisible" : ""
              }`}
            >
              {fieldError.email || "Placeholder"}
            </small>
          </div>
          <div className="relative">
            <label
              htmlFor="password"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              value={loginForm.password}
              onChange={handleChange}
              className="block w-full p-2.5 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
              placeholder="Enter Password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute top-9 right-3 text-gray-600 dark:text-gray-300"
            >
              {showPassword ? (
                <svg
                  viewBox="0 0 24 24"
                  width="24"
                  height="24"
                  stroke="currentColor"
                  strokeWidth="2"
                  fill="none"
                >
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                  <circle cx="12" cy="12" r="3"></circle>
                </svg>
              ) : (
                <svg
                  viewBox="0 0 24 24"
                  width="24"
                  height="24"
                  stroke="currentColor"
                  strokeWidth="2"
                  fill="none"
                >
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                  <line x1="1" y1="1" x2="23" y2="23"></line>
                </svg>
              )}
            </button>
            <small
              className={`text-red-500 block text-xs leading-tight min-h-[0.5rem] overflow-hidden break-words   ${
                !fieldError.password ? "invisible" : ""
              }`}
            >
              {fieldError.password || "Placeholder"}
            </small>
          </div>

          <div className="text-center py-4">
            <button
              type="submit"
              className="cursor-pointer  w-[30%] text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
            >
              Login
            </button>
            <div>
              <small className="text-black font-semibold">
                If you don't have account !!
              </small>
              <Link
                to="/register"
                className="text-sm text-blue-900 font-bold ml-2 "
              >
                Register
              </Link>
            </div>
          </div>
        </form>
      </div>

      {isOpen && (
        <AlertModal
          message={message}
          onClose={handleCloseModal}
          duration={1000}
        />
      )}
      {/* Modal Required
            {isModalOpen && (
              <ChangePasswordModal
                setIsModalOpen={setIsModalOpen}
              />
            )} */}
    </div>
  );
};

export default Login;
