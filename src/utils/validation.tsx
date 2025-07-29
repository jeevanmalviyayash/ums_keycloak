import {
  setFieldError,
  type RegisterFieldErrors,
  type RegisterState,
} from "../features/register/registerSlice";
import type { AppDispatch } from "../app/store";

export const validation = (
  registerForm: RegisterState,
  dispatch: AppDispatch
) => {
  const errors: RegisterFieldErrors = {};

  if (!registerForm.firstName) errors.firstName = "Firstname is required !!";
  if (!registerForm.lastName) errors.lastName = "Lastname is required !!";
  if (!registerForm.email) errors.email = "Email is required.";
  if (!registerForm.password) errors.password = "Password is required.";
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
  if (!registerForm.role) errors.role = "Role is required.";
  if (!registerForm.roleId) errors.role = "Role  is required.";
  if (!registerForm.groupId) errors.group = "Group   is required.";
  if (!registerForm.confirmPassword)
    errors.confirmPassword = "Confirm password is required.";

  if (!registerForm.roleId) {
    errors.roleId = 0;
  }

  if (registerForm.password !== registerForm.confirmPassword) {
    errors.confirmPassword = "Passwords does not match.";
  }

  if (Object.keys(errors).length > 0) {
    dispatch(setFieldError(errors));
    return false;
  }

  // dispatch(clearFieldError());
  return true;
};



export const validationForAdmin = (
  registerForm: RegisterState,
  dispatch: AppDispatch
) => {
  const errors: RegisterFieldErrors = {};

  if (!registerForm.firstName) errors.firstName = "Firstname is required !!";
  if (!registerForm.lastName) errors.lastName = "Lastname is required !!";
  if (!registerForm.email) errors.email = "Email is required.";
  if (!registerForm.password) errors.password = "Password is required.";
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
  if (!registerForm.role) errors.role = "Role is required.";
  if (!registerForm.roleId) errors.role = "Role  is required.";
  //if (!registerForm.groupId) errors.group = "Group   is required.";
  if (!registerForm.confirmPassword)
    errors.confirmPassword = "Confirm password is required.";

  if (!registerForm.roleId) {
    errors.roleId = 0;
  }

  if (registerForm.password !== registerForm.confirmPassword) {
    errors.confirmPassword = "Passwords does not match.";
  }

  if (Object.keys(errors).length > 0) {
    dispatch(setFieldError(errors));
    return false;
  }

  // dispatch(clearFieldError());
  return true;
};
