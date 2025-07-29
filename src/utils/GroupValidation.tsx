import { AppDispatch } from "../app/store";

import { clearGroupFieldError, GroupFieldError, GroupState, setGroupFieldError } from "../features/group/groupSlice";

export const GroupValidation = (
  roleForm: GroupState,
  dispatch: AppDispatch
) => {
  const errors: GroupFieldError = {};

  if (!roleForm.name) errors.name = "GroupName is required";
  if (!roleForm.description) errors.description = "Description is required";

  if (Object.keys(errors).length > 0) {
    dispatch(setGroupFieldError(errors));
    return false;
  }

  dispatch(clearGroupFieldError());
  return true;
};
