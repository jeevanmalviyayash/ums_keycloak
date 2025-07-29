import { useEffect } from "react";
import type { AppDispatch } from "../app/store";
import {
  clearFieldError,
  ProfileFieldError,
  setFieldError,
} from "../features/profile/profileSlice";

export const ProfileValidation = (registerForm, dispatch: AppDispatch) => {
  const errors: ProfileFieldError = {};

  if (!registerForm.phoneNumber) errors.phoneNumber = "Contact is required.";

  if (
    registerForm.phoneNumber.length > 10 ||
    registerForm.phoneNumber.length < 10
  ) {
    errors.phoneNumber =
      "Phone number should not be greater/less than 10 digit";
  }
  if (!registerForm.address) errors.address = "Address is required.";
  if (!registerForm.city) errors.city = "City is required.";
  if (!registerForm.company) errors.company = "Company is required.";

  if (Object.keys(errors).length > 0) {
    dispatch(setFieldError(errors));
    return false;
  }

  // dispatch(clearFieldError());
  return true;
};
