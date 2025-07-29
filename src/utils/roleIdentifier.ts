import { RootState } from "../app/store";

export const isAdminSelector = (state: RootState) => {
  const token = state.token;
  if (!token) return false;
  const role = state.login.role;
  return role === "ADMIN" || role === "SUPER_ADMIN";
};

export const isUser = (state: RootState): boolean => {
  const role = state.login.role;
  // return sessionStorage.getItem("role") === "USER";
  return role === "USER";
};
