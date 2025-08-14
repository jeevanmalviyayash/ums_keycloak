import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { isAdminSelector } from "../utils/roleIdentifier";
import { RootState } from "../app/store";
import { clearToken, setIsAuthentication } from "../features/token/tokenSlice";
import { Link, useNavigate } from "react-router-dom";

import usmlogo from "../../src/assets/vite.svg";

const Navbar: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state: RootState) => state.token);
  const { user } = useSelector((state: RootState) => state.login);

  console.log(isAuthenticated);

  const isAdmin = useSelector(isAdminSelector);

  const handleLogout = () => {
    sessionStorage.removeItem("token");
    sessionStorage.clear();
    dispatch(clearToken());
    navigate("/login");
  };

  useEffect(() => {
    console.log("It will first check admin or normal user");
  }, [isAdmin]);

  useEffect(() => {
    if (!isAuthenticated) {
      setMenuOpen(false);
    }
  }, [isAuthenticated]);

  return (
    <nav className="bg-purple-500 text-white dark:bg-gray-900 fixed w-full z-20 top-0 start-0 border-b border-gray-200 dark:border-gray-600">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between  mx-10 p-2">
        <a
          href="/"
          className="    flex items-center space-x-1 rtl:space-x-reverse"
        >
          <img src={usmlogo} className="h-10 w-10" alt="usmlogo" />
          <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
            User Management System
          </span>
        </a>

        <div className="flex md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
          {isAuthenticated ? (
            <div>
              {isAuthenticated && (
                <div className="flex ">
                  <ol className="inline-flex    mr-3 items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
                    <li className=" items-center">
                      <Link className="flex " to="/profile">
                        <div className=" w-8 h-8 mx-2 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs font-semibold ring-2 ring-gray-300">
                          {user.firstName?.substring(0, 2).toUpperCase()}
                        </div>

                        <span className="pt-1  text-center text-sm font-semibold  ">
                          {user.roleName}
                        </span>
                      </Link>
                    </li>
                  </ol>
                  <button
                    type="button"
                    className=" relative left-10 flex cursor-pointer outline rounded-full  text-white bg-transparent hover:bg-yellow-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium   text-sm px-4   py-2 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                    onClick={handleLogout}
                  >
                    <svg
                      className="w-5 pr-1 h-5 text-white dark:text-white"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke="currentColor"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M20 12H8m12 0-4 4m4-4-4-4M9 4H7a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h2"
                      />
                    </svg>
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : null}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            type="button"
            className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
            aria-controls="navbar-sticky"
            aria-expanded={menuOpen}
          >
            <span className="sr-only">Open main menu</span>
            <svg
              className="w-5 h-5"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 17 14"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M1 1h15M1 7h15M1 13h15"
              />
            </svg>
          </button>
        </div>

        <div
          className={`items-center justify-between w-full  md:flex md:w-auto md:order-1 ${
            menuOpen ? "block" : "hidden"
          }`}
          id="navbar-sticky"
        >
          <ul className="flex   p-4 md:p-0 mt-4 font-medium border border-gray-100 rounded-lg bg-black md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
            {isAdmin && isAuthenticated && (
              <div className="flex bg-purple-500  ">
                {/* all user */}
                <li className="mx-4  ">
                  <a
                    href="/admin/users"
                    className="block py-2 px-3 text-white rounded hover:bg-red-600 md:hover:bg-transparent md:hover:text-yellow-400  hover:underline  md:p-0 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white"
                  >
                    All Users
                  </a>
                </li>
                {/* Role Management */}
                <li className="mx-4  ">
                  <Link
                    to="/admin/addRole"
                    className="block py-2 px-3 text-white rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-yellow-400  hover:underline md:p-0 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white"
                  >
                    Role Management
                  </Link>
                </li>
                {/* Group Management */}
                {user?.roleName == "SUPER_ADMIN" && (
                  <li className="mx-4  ">
                    <Link
                      to="/admin/addGroup"
                      className="block py-2 px-3 text-white rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-yellow-400  hover:underline md:p-0 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white"
                    >
                      Group Management
                    </Link>
                  </li>
                )}
              </div>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
