import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../app/store";
import {
  clearFieldError,
  RoleFieldError,
  setFieldError,
} from "../features/role/roleSlice";
import { roleValidation } from "../utils/roleValidation";
import { Group } from "./auth/Register";
import { fetchGroupForRegisterPage } from "../features/role/roleAction";
import { setError } from "../features/register/registerSlice";

const AddNewRoleModal = ({
  editingRole,
  handleChange,
  handleAddRole,
  handleClose,
}) => {
  useEffect(() => {}, [editingRole]);
  const { fieldError, shouldRedirect } = useSelector(
    (state: RootState) => state.roleReducer
  );
  const { role } = useSelector((state: RootState) => state.login);
  const { user } = useSelector((state: RootState) => state.login);
  const dispatch = useDispatch();
  const [groupRoles, setGroupRoles] = useState<Group[]>([]);

  const validate = () => {
    // Map RolesFormState errors to RegisterFormState keys if needed
    const errors: RoleFieldError = {};
    if (!editingRole.name) errors.name = "Role name is required !";
    if (!editingRole.description)
      errors.description = "Description is required !";

    if (Object.keys(errors).length > 0) {
      dispatch(setFieldError(errors));
      return false;
    }

    // setFieldError(errors);

    // dispatch(clearFieldError());
    return true;
  };
  const handleSave = async (e: any) => {
    e.preventDefault();
    let roleApiFormValid = false;
    if (role === "SUPER_ADMIN") {
      roleApiFormValid = roleValidation(editingRole, dispatch);
    } else {
      roleApiFormValid = validate();
    }
    // const isValid = roleValidation(editingRole, dispatch);
    if (roleApiFormValid) {
      try {
        handleAddRole();
      } catch (error) {
        console.error("Error saving role:", error);
      }
    }
  };

  useEffect(() => {
    dispatch(clearFieldError());
  }, []);

  // Fetching the Group here
  useEffect(() => {
    const fetchGroupRole = async () => {
      try {
        const response = await dispatch(fetchGroupForRegisterPage());

        setGroupRoles(response.payload);
      } catch (error) {
        dispatch(setError("Failed to fetch role"));
      }
    };
    fetchGroupRole();
  }, [dispatch]);

  return (
    <>
      <div className="fixed  mt-18 inset-0 z-50 flex items-center justify-center bg-transparent bg-opacity-50">
        <div
          id="authentication-modal"
          tabIndex={-1}
          aria-hidden="false"
          className="overflow-y-auto overflow-x-hidden w-full max-w-md max-h-full"
        >
          <div className="relative p-4 w-full">
            <div className="relative bg-white rounded-lg shadow-md border   ring-1 dark:bg-gray-700">
              <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600 border-gray-200">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Add Role
                </h3>
                <button
                  type="button"
                  onClick={handleClose}
                  className=" cursor-pointer  text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
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
              </div>

              <div className="p-4 md:p-5">
                <form className="space-y-4" action="#">
                  {/* Group */}
                  {user?.roleName == "SUPER_ADMIN" && (
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
                        value={editingRole.groupId}
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
                          !fieldError.groupId ? "invisible" : ""
                        }`}
                      >
                        {fieldError.groupId || "Placeholder"}
                      </small>
                    </div>
                  )}
                  <div>
                    <label
                      htmlFor="role"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Role Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      id="name"
                      value={editingRole.name}
                      onChange={handleChange}
                      placeholder="Enter role name"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                    />

                    <small
                      className={`text-red-500 block text-xs leading-tight min-h-[0.5rem] overflow-hidden break-words   ${
                        !fieldError.name ? "invisible" : ""
                      }`}
                    >
                      {fieldError.name || "Placeholder"}
                    </small>
                  </div>
                  <div>
                    <label
                      htmlFor="description"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Description
                    </label>
                    <input
                      type="text"
                      name="description"
                      id="description"
                      value={editingRole.description}
                      onChange={handleChange}
                      placeholder="Enter role description"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                    />
                    <small
                      className={`text-red-500 block text-xs leading-tight min-h-[0.5rem] overflow-hidden break-words   ${
                        !fieldError.description ? "invisible" : ""
                      }`}
                    >
                      {fieldError.description || "Placeholder"}
                    </small>
                  </div>

                  <button
                    type="submit"
                    className="cursor-pointer w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                    onClick={handleSave}
                  >
                    Add
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddNewRoleModal;
