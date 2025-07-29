import { useEffect, useState } from "react";
import Pagination from "./Pagination";
import { useDispatch, useSelector } from "react-redux";
import {
  createRole,
  deleteRole,
  fetchRole,
  fetchRoleForRegisterPage,
  updateRole,
} from "../features/role/roleAction";
import { RootState } from "../app/store";
import EditRoleModal from "../utils/EditRoleModal";
import {
  clearFieldError,
  RoleFieldError,
  setFieldError,
  setShouldRedirect,
} from "../features/role/roleSlice";
import {
  closeModal,
  setIsOpen,
  setMessage,
} from "../features/modal/modalSlice";
import AlertModal from "../utils/AlertModal";
import { Navigate, useNavigate } from "react-router-dom";
import AddNewRoleModal from "./AddNewRoleModal";
import Breadcrumb from "../utils/Breadcrumb";
import { setTimeout } from "timers/promises";

type Role = {
  id: number;
  name: string;
  description: string;
};
const AddNewRole = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { role } = useSelector((state: RootState) => state.login);
  const { token } = useSelector((state: RootState) => state.token);
  const { shouldRedirect, fieldError } = useSelector(
    (state: RootState) => state.roleReducer
  );
  const { user } = useSelector((state: RootState) => state.login);

  const [userRoles, setUserRoles] = useState<Role[]>([]);
  const [userRolesDropDown, setUserRolesDropDown] = useState<Role[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isNewRoleAddModalOpen, setIsNewRoleAddModalOpen] = useState(false);

  const [selectRole, setSelectedRole] = useState(null);

  const { isOpen, message } = useSelector(
    (state: RootState) => state.alertModal
  );

  console.log("User Roles: ", userRoles);

  const [editingRole, setEditingRole] = useState<{
    id?: number;
    groupId?: number;
    name: string;
    description: string;
  }>({
    name: "",
    description: "",
  });

  useEffect(() => {
    dispatch(clearFieldError());
   // editingRole.groupId = user.groupId;
  }, []);

  const fetchAndFilterRoles = async () => {
    try {
      const response = await dispatch(fetchRole(token));
      console.log("Role: ", response);
      const result = response.payload;

      let filterDropDown = result;
      const currentUserRole = role;

      if (currentUserRole === "SUPER_ADMIN") {
        filterDropDown = result.filter(
          (role: any) => role.name !== "SUPER_ADMIN"
        );
      } else if (currentUserRole === "ADMIN") {
        filterDropDown = result.filter(
          (role: any) => role.name !== "SUPER_ADMIN" && role.name !== "ADMIN"
        );
      }
      setUserRoles(filterDropDown);
      setUserRolesDropDown(filterDropDown);
    } catch (error) {
      console.error("Error fetching roles: ", error);
    }
  };

  useEffect(() => {
    fetchAndFilterRoles();
    setEditingRole({
      name: "",
      description: "",
    });
  }, []);

  const handleEdit = (roleEdit) => {
    console.log(roleEdit);
    console.log("in HandleEdit");
    console.log(isModalOpen);
    fetchAndFilterRoles();
    setEditingRole(roleEdit);
    setSelectedRole(editingRole.id);
    setIsModalOpen(true);
  };

  const handleChangeRoleDropDown = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;

    setEditingRole({
      ...editingRole,
      [name]: value,
    });
  };

  const validate = () => {
    // Map RolesFormState errors to RegisterFormState keys if needed
    const errors: RoleFieldError = {};
    if (!editingRole.name) errors.name = "Role name is required !";
    if (!editingRole.description)
      errors.description = "Description is required !";

    if (Object.keys(errors).length > 0) {
      dispatch(setFieldError(errors));
      return true;
    }

    // setFieldError(errors);

    // dispatch(clearFieldError());
    return true;
  };
  
  const validateForSuperAdmin = () => {
    // Map RolesFormState errors to RegisterFormState keys if needed
    const errors: RoleFieldError = {};
    if (!editingRole.name) errors.name = "Role name is required !";
    if (!editingRole.description)
      errors.description = "Description is required !";
    if (!editingRole.groupId) errors.groupId = "Group is required";

    if (Object.keys(errors).length > 0) {
      dispatch(setFieldError(errors));
      return true;
    }

    return true;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const trimmedValue = value.trim();

    const hasOnlySpaces = value.length > 0 && trimmedValue === "";

    // Combined forbidden character check
    const forbiddenChars = /[`~!#$%^&*():{}=]/;
    if (hasOnlySpaces || forbiddenChars.test(value)) return;

    if (name === "name") {
      setEditingRole({
        ...editingRole,
        [name]: trimmedValue.toUpperCase(),
      });
      return;
    }
    setEditingRole({
      ...editingRole,
      [name]: value,
    });
  };

  // adjust the import path

  const handleSave = async (e: any) => {
    e.preventDefault();
    if (validate()) {
      try {
        if (editingRole.id) {
          const resultAction = await dispatch(
            updateRole({ token, data: editingRole })
          );

          if (updateRole.fulfilled.match(resultAction)) {
            const updatedRole = resultAction.payload;

            dispatch(setIsOpen(true));
            dispatch(setMessage(resultAction.payload.message));
            dispatch(setShouldRedirect(true));

            fetchAndFilterRoles();
          } else if (updateRole.rejected.match(resultAction)) {
            const result = resultAction.payload;

            console.log(result);
          }
        }
      } catch (error) {
        console.error("Error saving role:", error);
      }
    }
  };

  const handleAddRole = async (e: any) => {
       let valid = false
    if(role=="SUPER_ADMIN"){
       valid = validateForSuperAdmin();
    }else{
      valid = validate();
    }
 ;
    if (valid) {
      try {
        const resultAction = await dispatch(
          createRole({ token, data: editingRole })
        );

        if (createRole.fulfilled.match(resultAction)) {
          const response = resultAction.payload;
          console.log("FullFilled: ", response);

          dispatch(setIsOpen(true));
          dispatch(setMessage(resultAction.payload.message));
          dispatch(setShouldRedirect(true));
          setEditingRole({
            name: "",
            description: "",
          });
          dispatch(clearFieldError())
        } else if (createRole.rejected.match(resultAction)) {
          const response = resultAction.payload;
          console.log("Reject: ", response);
          dispatch(setIsOpen(true));
          dispatch(setMessage(response));
          dispatch(setShouldRedirect(true));
        }
      } catch (error) {
      } finally {
        fetchAndFilterRoles();
      }
    }
  };

  const handleAddRoleClick = () => {
    setIsNewRoleAddModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    dispatch(closeModal());
    setEditingRole({
      name: "",
      description: "",
    });
    dispatch(setFieldError({}));
    dispatch(clearFieldError());
    // if (shouldRedirect) {
    //   navigate("/admin/addRole");
    // }
  };

  const handleClose = () => {
    setIsNewRoleAddModalOpen(false);
    dispatch(closeModal());
  };

  const handledelete = async (id: number) => {
    try {
      const result = await dispatch(deleteRole({ token, id }));
      if (deleteRole.fulfilled.match(result)) {
        setUserRoles((prev) => prev.filter((role) => role.id !== id));
      } else {
        dispatch(setIsOpen(true));
        dispatch(setMessage("Deleted success"));
        dispatch(setShouldRedirect(true));
      }
    } catch (error) {
      console.error("Failed to delete", error);
    }
  };

  const [currentPage, setCurrentPage] = useState(1);
  const rolesPerPage = 6;

  const indexOfLastUser = currentPage * rolesPerPage;
  const indexOfFirstUser = indexOfLastUser - rolesPerPage;
  const currentRoles = userRoles.slice(indexOfFirstUser, indexOfLastUser);

  const totalPages = Math.ceil(userRoles.length / rolesPerPage);

  return (
    <div className="     md:mx-auto sm:mx-auto mt-[5%]   w-[100%] sm:w-[100%] md:w-[100%] md:h-[50vh]  sm:px-6 lg:px-8 ">
      <Breadcrumb />
      {isModalOpen || isNewRoleAddModalOpen ? (
        ""
      ) : (
        <div className=" mt-3  relative overflow-x-auto  border p-3       shadow-lg    sm:rounded-lg">
          <h1 className="text-center text-2xl text-purple-900 font-bold">Role Management</h1>
          <button
            type="button"
            onClick={() => handleAddRoleClick()}
            className="mx-2 my-2 p-2 text-xs font-medium text-center cursor-pointer   text-white bg-purple-500 rounded-lg hover:bg-yellow-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            Add New Role
          </button>
          <table className="w-full text-sm text-left   rtl:text-right text-gray-500 dark:text-gray-400   ">
            <thead className="text-xs bg-yellow-900     text-white uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="px-6 py-2">
                  ID
                </th>
                 {role === "SUPER_ADMIN" && (
                  <th scope="col" className="px-6 py-2">
                    Group Name
                  </th>
                )}
                <th scope="col" className="px-6 py-2">
                  Role Name
                </th>
                <th scope="col" className="px-6 py-2">
                  Description
                </th>

               

                <th scope="col" className="px-6 py-2">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {currentRoles.map((roles, index) => (
                <tr
                  key={roles.id}
                  className=" text-black font-semibold  odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700 border-gray-200"
                >
                  <th
                    scope="row"
                    className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                  >
                    {index + 1 + indexOfFirstUser}
                  </th>
                   {role === "SUPER_ADMIN" && (
                    <td className="px-6 py-2">{roles.groupName}</td>
                  )}
                  <td className="px-6 py-2   ">{roles.name} </td>
                  <td className="px-6 py-2">{roles.description} </td>
                 

                  <td className="px-6 py-2 flex">
                    {/* Edit */}
                    <button
                      onClick={() => handleEdit(roles)}
                      className="font-medium   hover:underline mr-3"
                    >
                      <svg
                        className="w-6 h-6 text-purple-500 cursor-pointer hover:text-red-900  dark:text-white"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke="currentColor"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="m14.304 4.844 2.852 2.852M7 7H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-4.5m2.409-9.91a2.017 2.017 0 0 1 0 2.853l-6.844 6.844L8 14l.713-3.565 6.844-6.844a2.015 2.015 0 0 1 2.852 0Z"
                        />
                      </svg>
                    </button>
                    <button
                      onClick={() => handledelete(roles.id)}
                      className="font-medium  text-red-500  mr-3"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        x="0px"
                        y="0px"
                        color="red"
                        viewBox="0 0 24 24"
                        className="w-6 h-6  cursor-pointer  dark:text-white"
                      >
                        <path d="M 10 2 L 9 3 L 3 3 L 3 5 L 4.109375 5 L 5.8925781 20.255859 L 5.8925781 20.263672 C 6.023602 21.250335 6.8803207 22 7.875 22 L 16.123047 22 C 17.117726 22 17.974445 21.250322 18.105469 20.263672 L 18.107422 20.255859 L 19.890625 5 L 21 5 L 21 3 L 15 3 L 14 2 L 10 2 z M 6.125 5 L 17.875 5 L 16.123047 20 L 7.875 20 L 6.125 5 z"></path>
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <Pagination
            setCurrentPage={setCurrentPage}
            currentPage={currentPage}
            totalPages={totalPages}
          />
        </div>
      )}

      {isModalOpen && (
        <EditRoleModal
          handleCloseModal={handleCloseModal}
          userRolesDropDown={userRolesDropDown}
          editingRole={editingRole}
          handleChangeRoleDropDown={handleChangeRoleDropDown}
          handleChange={handleChange}
          handleSave={handleSave}
          fieldError={fieldError}
        />
      )}

      {isNewRoleAddModalOpen && (
        <AddNewRoleModal
          editingRole={editingRole}
          handleChange={handleChange}
          handleAddRole={handleAddRole}
          handleClose={handleClose}
        />
      )}

      {isOpen && (
        <AlertModal
          message={message}
          onClose={handleCloseModal}
          duration={3000}
        />
      )}
    </div>
  );
};

export default AddNewRole;
