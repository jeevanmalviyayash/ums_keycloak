import type { AppDispatch } from "../app/store";
import {
  clearFieldError,
  EditUserFieldErrors,
  setFieldError,
} from "../features/editUser/editUser";

export const editUservalidation = (registerForm, dispatch: AppDispatch) => {
  const errors: EditUserFieldErrors = {};

  if (!registerForm.firstName) errors.firstName = "Firstname is required !!";
  if (!registerForm.lastName) errors.lastName = "Lastname is required !!";
  if (!registerForm.email) errors.email = "Email is required.";

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
  //if (!registerForm.role) errors.role = "Role is required.";
  if (!registerForm.roleId) errors.role = "Role  is required.";

  if (!registerForm.roleId) {
    errors.roleId = 0;
  }

  if (Object.keys(errors).length > 0) {
    dispatch(setFieldError(errors));
    return false;
  }

  dispatch(clearFieldError());
  return true;
};
