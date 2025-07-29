import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const EditRoleModal = ({
  handleCloseModal,
  editingRole,
  userRolesDropDown,
  handleChangeRoleDropDown,
  handleChange,
  handleSave,
  fieldError,
}) => {
  const dispatch = useDispatch();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-transparent bg-opacity-50">
      <div
        id="authentication-modal"
        tabIndex={-1}
        aria-hidden="false"
        className="overflow-y-auto overflow-x-hidden w-full max-w-md max-h-full"
      >
        <div className="relative p-4 w-full">
          <div className="relative bg-white rounded-lg shadow-lg ring-1 dark:bg-gray-700">
            <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600 border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Edit Role
              </h3>
              <button
                type="button"
                onClick={handleCloseModal}
                className="cursor-pointer  text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
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
                    value={editingRole.id}
                    onChange={handleChangeRoleDropDown}
                    disabled
                    className="bg-gray-50 border cursor-not-allowed  border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                  >
                    <option value="">Choose a role</option>
                    {userRolesDropDown.map((role) => (
                      <option key={role.name} value={role.id}>
                        {role.name}
                      </option>
                    ))}
                  </select>
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
                  className=" cursor-pointer w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                  onClick={handleSave}
                >
                  Update
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditRoleModal;
