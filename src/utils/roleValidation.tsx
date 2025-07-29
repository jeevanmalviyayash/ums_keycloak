import { AppDispatch } from "../app/store";

import { RoleFieldError, roleState, setFieldError } from "../features/role/roleSlice";

export const roleValidation = (
  roleForm: roleState,
  dispatch: AppDispatch
) => {
  const errors: RoleFieldError = {};

  if (!roleForm.name) errors.name = "Role is required";
  if (!roleForm.description) errors.description = "Description is required";
  if (!roleForm.groupId) errors.groupId = "Group is required";

  if (Object.keys(errors).length > 0) {
    dispatch(setFieldError(errors));
    return false;
  }

  dispatch(setFieldError({}));
  return true;
};
