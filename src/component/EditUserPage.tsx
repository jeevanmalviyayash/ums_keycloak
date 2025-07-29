import { useEffect, useState } from "react";

import {
  clearFieldError,
  setError,
  setFieldError,
  setShouldRedirect,
} from "../features/register/registerSlice";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../app/store";
import { useNavigate, useParams } from "react-router-dom";
import {
  closeModal,
  setIsOpen,
  setMessage,
} from "../features/modal/modalSlice";
import { registerUser } from "../features/register/registerAction";
import { setToken } from "../features/token/tokenSlice";
import {
  fetchRole,
  fetchRoleForRegisterPage,
} from "../features/role/roleAction";
import axios from "axios";
import AlertModal from "../utils/AlertModal";
import { updateUser } from "../features/editUser/editUseraction";
import { editUservalidation } from "../utils/editUserValidation";
import Breadcrumb from "../utils/Breadcrumb";
import configApi from "../configApi/configApi";

interface Role {
  id: number;
  name: string;
  description: string;
}

const EditUserPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [userRoles, setUserRoles] = useState<Role[]>([]);

  const { error, fieldError, shouldRedirect } = useSelector(
    (state: RootState) => state.editUser
  );

  const { message, isOpen } = useSelector(
    (state: RootState) => state.alertModal
  );

  const { token } = useSelector((state: RootState) => state.token);
  const { role } = useSelector((state: RootState) => state.login);

  // Fetching the Role here
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const res = await axios.get(`${configApi.apiBaseUrl}/auth/getRoles`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const allRoles = res.data;
        console.log("all Roles: ", allRoles);
        // const currentRole = localStorage.getItem("role");
        const currentRole = role;

        // filter roles  to exclude the Admin and super admin
        if (currentRole === "SUPER_ADMIN") {
          const filteredRoles = allRoles.filter(
            (role: Role) => !["SUPER_ADMIN"].includes(role.name)
          );
          setUserRoles(filteredRoles);
        } else {
          const filteredRoles = allRoles.filter(
            (role: Role) => !["ADMIN", "SUPER_ADMIN"].includes(role.name)
          );
          setUserRoles(filteredRoles);
        }
        //setRoles(res.data);
      } catch (error) {
        console.error("Failed to fetch roles", error);
      }
    };
    fetchRoles();
    fetchUser();
  }, [id]);

  useEffect(() => {
    if (userRoles.length && registerForm.roleId) {
      const matchedRole = userRoles.find(
        (role) => role.id === registerForm.roleId
      );
      if (matchedRole && registerForm.role !== matchedRole.name) {
        setRegisterForm((prev) => ({ ...prev, role: matchedRole.name }));
      }
    }
  }, [userRoles]);

  //Restrict user after authentication to go back on Register page
  // useEffect(() => {
  //   if (token) {
  //     dispatch(setToken(token));
  //     navigate("/admin/editUser");
  //   }
  // }, []);

  const [registerForm, setRegisterForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    city: "",
    company: "",
    address: "",
    // password: "",
    // confirmPassword: "",
    role: "",
    roleId: 0,
    loading: false,
    error: null,
    fieldError: {},
  });

  // fetch user
  const fetchUser = async () => {
    try {
      const res = await axios.get(`${configApi.apiBaseUrl}/user/get/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRegisterForm(res.data);
    } catch (error) {
      console.error("Failed to fetch user", error);
    } finally {
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    let trimmedValue = value; // trim trailing whitespace

    // Optional: reject values that contain internal spaces (e.g. "John Doe")
    const hasOnlySpaces = value.length > 0 && trimmedValue === "";
    // const hasAnySpaces = /\s/.test(value); // matches spaces anywhere

    // Combined forbidden character check
    const forbiddenChars = /[`~!#$%^&*():{}=]/;
    if (hasOnlySpaces || forbiddenChars.test(value)) return; // block if any match

    if (
      ["company", "address", "city"].includes(name) &&
      value.startsWith(" ")
    ) {
      return;
    }

    if (["email", "firstName", "lastName"].includes(name)) {
      trimmedValue = value.replace(/\s+/g, ""); // Removes all spaces
    }

    if (name === "phoneNumber") {
      if (/^\d{0,10}$/.test(value)) {
        setRegisterForm({
          ...registerForm,
          [name]: value,
        });
      }
    } else if (name === "roleId") {
      const selectedRole = userRoles.find((r) => r.id === parseInt(value));

      setRegisterForm({
        ...registerForm,
        roleId: parseInt(value),
        role: selectedRole ? selectedRole.name : "",
      });
    } else {
      setRegisterForm({
        ...registerForm,
        [name]: trimmedValue, // storing trimmed value to clean up trailing/leading whitespace
      });
    }
    // const { name, value } = e.target;
    // setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCloseModal = () => {
    dispatch(closeModal());

    // if (shouldRedirect) {
    //   navigate("/admin/users");
    // }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const selectedRole = userRoles.find((r) => r.name === registerForm.role);
    const roleId = selectedRole?.id;

    const isValid = editUservalidation(registerForm, dispatch); // Pass registerForm directly

    console.log("is valid", isValid);
    if (isValid) {
      console.log("In Update ", registerForm);

      try {
        // const payload = { ...registerForm, roleId };
        const payload = registerForm;
        console.log("token in payload", payload);

        const resultAction = await dispatch(updateUser({ token, id, payload }));

        if (updateUser.fulfilled.match(resultAction)) {
          console.log("Update Successfull: ", resultAction.payload);
          dispatch(setIsOpen(true));
          dispatch(setMessage(resultAction.payload.message));
          // dispatch(setShouldRedirect(true));
          setTimeout(() => {
            navigate("/admin/users");
          }, 3000);
        } else if (updateUser.rejected.match(resultAction)) {
          const payload = resultAction.payload;

          if (payload && typeof payload === "object") {
            console.log("In rejected", payload);
            if ("passoword" in payload || "confirmPassword" in payload) {
              dispatch(setFieldError(payload));
            } else if (
              "address" in payload ||
              "city" in payload ||
              "company" in payload ||
              "role" in payload
            ) {
              dispatch(setFieldError(payload));
            } else if ("message" in payload) {
              dispatch(setIsOpen(true));
              dispatch(setMessage(resultAction.payload.message));
              dispatch(setError(payload.message as string));
              // console.log(payload);
              dispatch(setFieldError(resultAction.payload.message));
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
    <>
      <div className="text-left ml-4 mt-21">
        <Breadcrumb />
      </div>
      <div className="container  md:mx-auto sm:mx-auto mt-[30px]  w-[100%] sm:w-[100%] md:w-[50%]  sm:px-6 lg:px-8  ">
        <form
          className="space-y-3 border ring-1  rounded-lg shadow-lg px-6 pt-3 mb-5 pb-5"
          onSubmit={handleSubmit}
        >
          <h4 className="text-center text-2xl    text-blue-500 font-bold   ">
            Edit User
          </h4>
          {/* Grid Section 1 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
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
                className="block w-full p-2.5 text-gray-500 border border-gray-300 rounded-lg bg-gray-200 text-sm cursor-not-allowed"
                placeholder="Enter Email"
                disabled={true}
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
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
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
          <div className="grid grid-cols-1 sm:grid-cols-2   md:grid-cols-2 gap-2">
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
                className="bg-gray-50  cursor-not-allowed  border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                disabled
              >
                <option value="">Choose a role</option>
                {userRoles.map((role) => (
                  <option
                    key={role.id}
                    value={role.id}
                    defaultValue={"select Role"}
                  >
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

          {/* Submit Button */}
          <div className="text-center pt-2  ">
            <button
              type="submit"
              className=" w-[30%] cursor-pointer text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
            >
              Submit
            </button>
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
    </>
  );
};

export default EditUserPage;
