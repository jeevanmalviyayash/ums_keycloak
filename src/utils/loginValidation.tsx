import { AppDispatch } from "../app/store";
import {
  LoginFieldErrors,
  LoginState,
  setFieldError,
} from "../features/login/loginSlice";

export const loginValidation = (
  loginForm: LoginState,
  dispatch: AppDispatch
) => {
  const errors: LoginFieldErrors = {};

  if (!loginForm.email) errors.email = "Email is required";
  if (!loginForm.password) errors.password = "Password is required";

  if (Object.keys(errors).length > 0) {
    dispatch(setFieldError(errors));
    return false;
  }

  return true;
};
