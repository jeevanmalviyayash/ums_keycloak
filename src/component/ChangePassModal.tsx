import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { RootState, AppDispatch } from "../app/store";
import { changePassword } from "../features/changePassword/changePasswordAction";
import {
  setIsOpen,
  setMessage,
  closeModal,
} from "../features/modal/modalSlice";
import AlertModal from "../utils/AlertModal";

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

const ChangePasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { token } = useSelector((state: RootState) => state.token);
  const { message, isOpen } = useSelector(
    (state: RootState) => state.alertModal
  );

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  const [errors, setErrors] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  useEffect(() => {
    document.title = "Change Password";
  }, []);

  //Restrict user after authentication to go back on login page
  // useEffect(() => {
  //   const token = sessionStorage.getItem("token");
  //   if (!token) {
  //     navigate("/login");
  //   }
  // }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateFields = (data: ChangePasswordData) => {
    const errors: Partial<ChangePasswordData> = {};
    if (data.newPassword !== data.confirmNewPassword) {
      errors.confirmNewPassword =
        "New password & Confirm password does not match!";
    }
    return errors;
  };

  const handleChangePassword = async (data: ChangePasswordData) => {
    const fieldErrors = validateFields(data);
    if (Object.keys(fieldErrors).length > 0) {
      dispatch(setIsOpen(true));
      dispatch(setMessage(Object.values(fieldErrors).join(" | ")));
      return;
    }

    try {
      const result = await dispatch(
        changePassword({ token, payload: formData })
      ).unwrap();
      console.log("Password changed successfully", result);

      if (result === "Password changed successfully.") {
        dispatch(setIsOpen(true));
        dispatch(setMessage(`${result} Please login with new password.`));
        setTimeout(() => navigate("/login"), 1500);
      } else {
        let message = "Failed to change password";
        if (typeof result === "string") {
          message = result;
        } else if (result?.newPassword) {
          message = result.newPassword;
        } else if (result?.message) {
          message = result.message;
        }
        dispatch(setIsOpen(true));
        dispatch(setMessage(`${message} Please try again.`));
      }
    } catch (error) {
      console.error("Error changing password:", error);
    }
  };

  const handleSubmit = () => {
    const newErrors = {
      currentPassword: formData.currentPassword
        ? ""
        : "Current password is required",
      newPassword: formData.newPassword ? "" : "New password is required",
      confirmNewPassword: formData.confirmNewPassword
        ? ""
        : "Confirm password is required",
    };

    setErrors(newErrors);

    const hasErrors = Object.values(newErrors).some((msg) => msg);
    if (hasErrors) return;

    handleChangePassword(formData);
  };

    const handleClose = () => {
      setFormData({ currentPassword: "", newPassword: "", confirmNewPassword: "" });
       setErrors({ currentPassword: "", newPassword: "", confirmNewPassword: "" });
  
      // Optional: close modal or redirect if needed
      navigate("/profile"); // if you want to go back somewhere
    };
  

 return (
  <div className="min-h-screen flex items-center justify-center px-4 bg-gray-50 dark:bg-gray-900">
   <div className="container mx-auto border ring-1 rounded-sm py-10 px-4 max-w-lg relative">
      {/* Close Button */}
      <button
            type="button"
            onClick={handleClose}
           className="absolute top-4 right-4 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
          >
            <svg
              className="w-3 h-3"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 14 14"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
              />
            </svg>
            <span className="sr-only">Close modal</span>
          </button>

      <h2 className="text-2xl font-bold text-center mb-8 text-gray-800 dark:text-white">
        🔐 Change Password
      </h2>

      <div className="space-y-6">
        {/* Current Password */}
        <div className="relative">
          <input
            type={showCurrent ? "text" : "password"}
            name="currentPassword"
            value={formData.currentPassword}
            onChange={handleInputChange}
            placeholder="Current Password"
            className="w-full px-4 py-3 text-sm border rounded-lg focus:ring focus:ring-blue-400 bg-gray-100 dark:bg-gray-700 dark:text-white"
          />
          <small
            className={`text-red-500 block text-xs leading-tight min-h-[0.5rem] ${
              !errors.currentPassword ? "invisible" : ""
            }`}
          >
            {errors.currentPassword || "Placeholder"}
          </small>
          <button
            type="button"
            onClick={() => setShowCurrent(!showCurrent)}
            className="absolute top-3 right-3 text-gray-600 dark:text-gray-300"
          >
            👁️
          </button>
        </div>

        {/* New Password */}
        <div className="relative">
          <input
            type={showNew ? "text" : "password"}
            name="newPassword"
            value={formData.newPassword}
            onChange={handleInputChange}
            placeholder="New Password"
            className="w-full px-4 py-3 text-sm border rounded-lg focus:ring focus:ring-blue-400 bg-gray-100 dark:bg-gray-700 dark:text-white"
          />
          <small
            className={`text-red-500 block text-xs leading-tight min-h-[0.5rem] ${
              !errors.newPassword ? "invisible" : ""
            }`}
          >
            {errors.newPassword || "Placeholder"}
          </small>
          <button
            type="button"
            onClick={() => setShowNew(!showNew)}
            className="absolute top-3 right-3 text-gray-600 dark:text-gray-300"
          >
            👁️
          </button>
        </div>

        {/* Confirm New Password */}
        <div className="relative">
          <input
            type={showConfirm ? "text" : "password"}
            name="confirmNewPassword"
            value={formData.confirmNewPassword}
            onChange={handleInputChange}
            placeholder="Confirm New Password"
            className="w-full px-4 py-3 text-sm border rounded-lg focus:ring focus:ring-blue-400 bg-gray-100 dark:bg-gray-700 dark:text-white"
          />
          <small
            className={`text-red-500 block text-xs leading-tight min-h-[0.5rem] ${
              !errors.confirmNewPassword ? "invisible" : ""
            }`}
          >
            {errors.confirmNewPassword || "Placeholder"}
          </small>
          <button
            type="button"
            onClick={() => setShowConfirm(!showConfirm)}
            className="absolute top-3 right-3 text-gray-600 dark:text-gray-300"
          >
            👁️
          </button>
        </div>
      </div>

      <div className="mt-8 text-center">
        <button
          onClick={handleSubmit}
          className="px-5 py-2 text-sm font-semibold text-white bg-gradient-to-r from-blue-500 to-indigo-600 rounded-sm hover:from-blue-600 hover:to-indigo-700 focus:ring focus:ring-blue-400 transition-all"
        >
          Submit
        </button>
      </div>

      {isOpen && (
        <AlertModal
          message={message}
          onClose={() => dispatch(closeModal())}
          duration={1000}
        />
      )}
    </div>
  </div>
);
};

export default ChangePasswordPage;
