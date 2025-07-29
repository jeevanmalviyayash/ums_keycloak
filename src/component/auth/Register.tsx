import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { validation } from "../../utils/validation";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../app/store";
import {
  fetchGroupForRegisterPage,
  fetchRoleForRegisterPage,
} from "../../features/role/roleAction";
import {
  clearFieldError,
  setError,
  setFieldError,
  setShouldRedirect,
} from "../../features/register/registerSlice";
import { registerUser } from "../../features/register/registerAction";
import {
  closeModal,
  setIsOpen,
  setMessage,
} from "../../features/modal/modalSlice";
import AlertModal from "../../utils/AlertModal";
import { setToken } from "../../features/token/tokenSlice";

interface Role {
  id: number;
  name: string;
  description: string;
}

export interface Group {
  id: number;
  name: string;
  description: string;
}

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [userRoles, setUserRoles] = useState<Role[]>([]);
  const [groupRoles, setGroupRoles] = useState<Group[]>([]);
  const [selectedGroup, setSelectedgroup] = useState<Group | null>(null);
  const { error, fieldError, shouldRedirect } = useSelector(
    (state: RootState) => state.register
  );

  const { message, isOpen } = useSelector(
    (state: RootState) => state.alertModal
  );

  const { token } = useSelector((state: RootState) => state.token);
  const [registerForm, setRegisterForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    city: "",
    company: "",
    address: "",
    password: "",
    confirmPassword: "",
    role: "",
    roleId: 0,
    loading: false,
    error: null,
    fieldError: {},
    group: "",
    groupId: 0,
  });

  const [isRoleDropDown, setIsRoleDropDown] = useState(true);

  // Fetching the Group here
  useEffect(() => {
    const fetchGroupRole = async () => {
      try {
        const response = await dispatch(fetchGroupForRegisterPage());

        console.log("Group : ", response.payload);
        setGroupRoles(response.payload);
      } catch (error) {
        dispatch(setError("Failed to fetch role"));
      }
    };
    fetchGroupRole();
  }, [dispatch]);
  console.log("Selected Role:", selectedGroup);
  // Fetching the Role here

  useEffect(() => {
    if (!selectedGroup) return;

    const fetchRoles = async (selectedGroup) => {
      console.log("selected G", selectedGroup);
      try {
        const response = await dispatch(
          fetchRoleForRegisterPage(selectedGroup)
        );
        console.log(response.payload);

        const allRoles = response.payload;

        // Filter roles to exclude Admin and Super Admin
        const filteredRoles = allRoles.filter(
          (role: Role) => !["ADMIN", "SUPER_ADMIN"].includes(role.name)
        );

        setUserRoles(filteredRoles);
      } catch (error) {
        dispatch(setError("Failed to fetch roles"));
      }
    };
    fetchRoles(selectedGroup);
  }, [selectedGroup]);

  useEffect(() => {
    if (selectedGroup !== null) {
      dispatch(clearFieldError());
    }
  }, [selectedGroup]);

  //Restrict user after authentication to go back on Register page
  useEffect(() => {
    if (token) {
      dispatch(setToken(token));
      navigate("/dashboard");
    }
  }, [dispatch]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;

    let trimmedValue = value;

    const hasOnlySpaces = value.length > 0 && trimmedValue === "";

    const forbiddenChars = /[`~!#$%^&*():{}=]/;

    if (hasOnlySpaces || forbiddenChars.test(value)) return;

    if (
      ["company", "address", "city"].includes(name) &&
      value.startsWith(" ")
    ) {
      return;
    }

    if (["email", "firstName", "lastName"].includes(name)) {
      trimmedValue = value.replace(/\s+/g, ""); // Removes all spaces
    }

    if (["groupId"].includes(name)) {
      if (value == "") {
        setIsRoleDropDown(true);
        registerForm.role = "";
        registerForm.roleId = 0;
        registerForm.groupId = 0;
      } else {
        setIsRoleDropDown(false);
      }
      setSelectedgroup(value);
    }

    if (
      [
        "email",
        "firstName",
        "lastName",
        "password",
        "confirmPassword",
      ].includes(name)
    ) {
      trimmedValue = value.replace(/\s+/g, ""); // remove all space
    }

    if (name === "phoneNumber") {
      const onlyDigits = value.replace(/\D/g, ""); // remove non-digits
      if (onlyDigits.length <= 10) {
        setRegisterForm({
          ...registerForm,
          [name]: onlyDigits,
        });
      }
    } else if (name === "roleId") {
      setRegisterForm({
        ...registerForm,
        roleId: parseInt(value),
        role: trimmedValue !== "" ? "role" : "",
      });
    } else if (name === "groupId") {
      setRegisterForm({
        ...registerForm,
        groupId: parseInt(value),
        group: trimmedValue !== "" ? "group" : "",
      });
    } else {
      setRegisterForm({
        ...registerForm,
        [name]: trimmedValue, // storing trimmed value to clean up trailing/leading whitespace
      });
    }
  };

  const handleCloseModal = () => {
    dispatch(closeModal());

    if (shouldRedirect) {
      navigate("/");
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const isValid = validation(registerForm, dispatch); // Pass registerForm directly

    if (isValid) {
      console.log(registerForm);

      try {
        const resultAction = await dispatch(registerUser(registerForm));

        if (registerUser.fulfilled.match(resultAction)) {
          console.log("Registration Successfull: ", resultAction.payload);
          dispatch(setIsOpen(true));
          dispatch(setMessage(resultAction.payload.message));
          dispatch(setShouldRedirect(true));
          setRegisterForm({
            firstName: "",
            lastName: "",
            email: "",
            phoneNumber: "",
            city: "",
            company: "",
            address: "",
            password: "",
            confirmPassword: "",
            role: "",
            roleId: 0,
            loading: false,
            error: null,
            fieldError: "",
            group: "",
            groupId: 0,
          });
        } else if (registerUser.rejected.match(resultAction)) {
          const payload = resultAction.payload;

          if (payload && typeof payload === "object") {
            if ("passoword" in payload || "confirmPassword" in payload) {
              dispatch(setFieldError(payload));
            } else if (
              "address" in payload ||
              "city" in payload ||
              "company" in payload
            ) {
              dispatch(setFieldError(payload));
            } else if ("message" in payload) {
              dispatch(setIsOpen(true));
              dispatch(setMessage(resultAction.payload.message));
              dispatch(setError(payload.message as string));
            }
            setTimeout(() => {
              dispatch(clearFieldError());
            }, 3000);
          } else {
            dispatch(setError("Registeration failed"));
          }
        }
      } catch (error) {
        console.error("Unexpected error:", error);
      }
    } else {
      console.log("Validation failed");
    }
  };

  return (
    <div className="    md:mx-auto sm:mx-auto mt-[80px]   w-[100%] sm:w-[100%] md:w-[50%]  sm:px-6 lg:px-8  ">
      <form
        className=" space-y-3 border border-gray-500 rounded-lg shadow-lg px-6 pt-2 mb-2 pb-2 "
        onSubmit={handleSubmit}
      >
        <p className="text-center text-2xl text-purple-900 font-bold">
          Create Account
        </p>
        {/* Grid Section 1 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {/* First Name */}
          <div>
            <label
              htmlFor="firstName"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              First Name
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={registerForm.firstName}
              onChange={handleChange}
              className="block w-full p-2.5 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
              placeholder="Enter First Name"
            />
            <small
              className={`text-red-500 block text-xs leading-tight min-h-[0.5rem] overflow-hidden break-words   ${
                !fieldError.firstName ? "invisible" : ""
              }`}
            >
              {fieldError.firstName || "Placeholder"}
            </small>
          </div>

          {/* Last Name */}
          <div>
            <label
              htmlFor="lastName"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Last Name
            </label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={registerForm.lastName}
              onChange={handleChange}
              className="block w-full p-2.5 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
              placeholder="Enter Last Name"
            />
            <small
              className={`text-red-500 block text-xs leading-tight min-h-[0.5rem] overflow-hidden break-words   ${
                !fieldError.lastName ? "invisible" : ""
              }`}
            >
              {fieldError.lastName || "Placeholder"}
            </small>
          </div>

          {/* Email */}
          <div>
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
              value={registerForm.email}
              onChange={handleChange}
              className="block w-full p-2.5 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
              placeholder="Enter Email"
            />
            <small
              className={`text-red-500 block text-xs leading-tight min-h-[0.5rem] overflow-hidden break-words   ${
                !fieldError.email ? "invisible" : ""
              }`}
            >
              {fieldError.email || "Placeholder"}
            </small>
          </div>
        </div>
        {/* Grid Section 2 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {/* Contact */}
          <div>
            <label
              htmlFor="phoneNumber"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Contact
            </label>
            <input
              type="text"
              inputMode="numeric"
              maxLength={10}
              name="phoneNumber"
              value={registerForm.phoneNumber}
              onChange={handleChange}
              placeholder="Contact Number"
              className="block w-full p-2.5 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
            />
            <small
              className={`text-red-500 block text-xs max-w-[150px] leading-tight min-h-[0.5rem] overflow-hidden break-words   ${
                !fieldError.phoneNumber ? "invisible" : ""
              }`}
            >
              {fieldError.phoneNumber || "Placeholder"}
            </small>
          </div>
          {/* Contact */}
          <div>
            <label
              htmlFor="Company"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Company
            </label>
            <input
              type="text"
              id="company"
              name="company"
              value={registerForm.company}
              onChange={handleChange}
              className="block w-full p-2.5 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
              placeholder="Enter Company"
            />
            <small
              className={`text-red-500 block text-xs leading-tight min-h-[0.5rem] overflow-hidden break-words   ${
                !fieldError.company ? "invisible" : ""
              }`}
            >
              {fieldError.company || "Placeholder"}
            </small>
          </div>
          {/* City */}
          <div>
            <label
              htmlFor="City"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              City
            </label>
            <input
              type="text"
              id="city"
              name="city"
              value={registerForm.city}
              onChange={handleChange}
              className="block w-full p-2.5 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
              placeholder="Enter City"
            />
            <small
              className={`text-red-500 block text-xs leading-tight min-h-[0.5rem] overflow-hidden break-words   ${
                !fieldError.city ? "invisible" : ""
              }`}
            >
              {fieldError.city || "Placeholder"}
            </small>
          </div>
        </div>
        {/* Grid Section 3 */}
        <div className="grid grid-cols-1 sm:grid-cols-2   md:grid-cols-3 gap-4">
          {/* Address */}
          <div>
            <label
              htmlFor="address"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Address
            </label>
            <textarea
              id="address"
              name="address"
              rows={1}
              value={registerForm.address}
              onChange={handleChange}
              className="block w-full p-2.5 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
              placeholder="Enter Address"
            />
            <small
              className={`text-red-500 block text-xs leading-tight min-h-[0.5rem] overflow-hidden break-words   ${
                !fieldError.address ? "invisible" : ""
              }`}
            >
              {fieldError.address || "Placeholder"}
            </small>
          </div>
          {/* Group */}
          <div>
            <label
              htmlFor="role"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Select Group
            </label>
            <select
              id="group"
              name="groupId"
              value={registerForm.groupId}
              onChange={handleChange}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
            >
              <option value="">Choose a group</option>
              {groupRoles.map((role) => (
                <option key={role.id} value={role.id}>
                  {role.name}
                </option>
              ))}
            </select>
            <small
              className={`text-red-500 block text-xs leading-tight min-h-[0.5rem] overflow-hidden break-words   ${
                !fieldError.group ? "invisible" : ""
              }`}
            >
              {fieldError.group || "Placeholder"}
            </small>
          </div>
          {/* Role */}
          <div>
            <label
              htmlFor="role"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Select Role
            </label>
            <select
              id="role"
              name="roleId"
              value={registerForm.roleId}
              onChange={handleChange}
              disabled={isRoleDropDown}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
            >
              <option value="">Choose a role</option>
              {userRoles.map((role) => (
                <option key={role.id} value={role.id}>
                  {role.name}
                </option>
              ))}
            </select>
            <small
              className={`text-red-500 block text-xs leading-tight min-h-[0.5rem] overflow-hidden break-words   ${
                !fieldError.role ? "invisible" : ""
              }`}
            >
              {fieldError.role || "Placeholder"}
            </small>
          </div>
        </div>

        {/* Grid Section 4 */}
        <div className="grid grid-cols-1 sm:grid-cols-2   md:grid-cols-2 gap-4">
          {/* Password */}
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
              value={registerForm.password}
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
          {/* confirmPassword */}
          <div className="relative">
            <label
              htmlFor="password"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Confirm Password
            </label>
            <input
              type={showConfirmPassword ? "text" : "password"}
              id="confirmPassword"
              name="confirmPassword"
              value={registerForm.confirmPassword}
              onChange={handleChange}
              className="block w-full p-2.5 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
              placeholder="Enter Confirm Password"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute top-9 right-3 text-gray-600 dark:text-gray-300"
            >
              {showConfirmPassword ? (
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
                !fieldError.confirmPassword ? "invisible" : ""
              }`}
            >
              {fieldError.confirmPassword || "Placeholder"}
            </small>
          </div>
        </div>

        {/* Submit Button */}
        <div className="text-center  mt-2  ">
          <button
            type="submit"
            className=" cursor-pointer w-[30%] text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
          >
            Register
          </button>
          <div>
            <small className="text-black font-semibold">
              If you have already account !!
            </small>
            <Link to="/" className="text-sm text-blue-900 font-bold ml-2 ">
              Login
            </Link>
          </div>
        </div>
      </form>
      {isOpen && (
        <AlertModal
          message={message}
          onClose={handleCloseModal}
          duration={1000}
        />
      )}
    </div>
  );
};

export default Register;
