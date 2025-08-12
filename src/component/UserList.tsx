import { useEffect, useState } from "react";
import {
  deleteUser,
  fetchRole,
  getFilterdUser,
} from "../features/register/registerAction";
import { RootState } from "../app/store";
import { useDispatch, useSelector } from "react-redux";
import SearchBox from "./SearchBox";
import Pagination from "./Pagination";
import { useNavigate } from "react-router-dom";

import axios from "axios";
import {
  closeModal,
  setIsOpen,
  setMessage,
} from "../features/modal/modalSlice";
import AlertModal from "../utils/AlertModal";
import { updateUser } from "../features/editUser/editUseraction";
import Breadcrumb from "../utils/Breadcrumb";

import EditRoleModal from "./EditRoleModal";
import configApi from "../configApi/configApi";

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  company: string;
  phoneNumber: string;
  roleId: string;
  status: string; // Assuming status is a string, adjust as necessary
}
type Role = {
  id: number;
  name: string;
  description: string;
};
const UserList = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [users, setUsers] = useState<User[]>([]);
  const [userRoles, setUserRoles] = useState<Role[]>([]);
  const { isOpen, message } = useSelector(
    (state: RootState) => state.alertModal
  );
  const { token } = useSelector((state: RootState) => state.token);
  const { role, user } = useSelector((state: RootState) => state.login);

  //   const currentUser = stored ? JSON.parse(stored) : null;
  const currentUser = user;

  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 6;

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);

  const totalPages = Math.ceil(users.length / usersPerPage);

  const [filters, setFilters] = useState({
    email: "",
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    company: "",
    phoneNumber: "",
    roleId: "",
  });
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingStatus, setEditingStatus] = useState<{
    id?: number;
    email?: string;
    firstName: string;
    lastName: string;
    role: string;
    password?: string;
    phoneNumber?: string;
    company?: string;
    address?: string;
    city?: string;
    roleId?: number;
    status?: string;
  }>({
    email: "",
    firstName: "",
    lastName: "",
    role: "",
    password: "",
    phoneNumber: "",
    company: "",
    address: "",
    city: "",
    roleId: 0,
    status: "",
  });

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let trimmedValue = value;
    const hasOnlySpaces = value.length > 0 && trimmedValue === "";

    const forbiddenChars = /[`~!#$%^&*():{}=]/;

    if (hasOnlySpaces || forbiddenChars.test(value)) return;
    if (
      ["email", "firstName", "lastName"].includes(name) &&
      value.startsWith(" ")
    ) {
      return;
    }
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  useEffect(() => {
    if (role !== "ADMIN" && role !== "SUPER_ADMIN") {
      navigate("/");
    } else {
      fetchUsers(filters);
    }
  }, [userRoles]);

  useEffect(() => {
    if (token) {
      dispatch(fetchRole(token));
    }
  }, [token]);

  const resetForm = () => {
    setFilters({
      firstName: "",
      lastName: "",
      email: "",
      address: "",
      city: "",
      company: "",
      phoneNumber: "",
      roleId: "",
    });
    fetchUsers();
  };

  const handleDelete = async (id: string) => {
    console.log("In delete", id);
    // e.preventDefault();
    // if (!window.confirm("Are you sure to delete this user? ")) return;
    try {
      const response = await dispatch(deleteUser({ token, id }));

      if (deleteUser.fulfilled.match(response)) {
        console.log("delete response", response);
        dispatch(setIsOpen(true));
        dispatch(setMessage(response.payload.message));
        console.log(response);
      } else if (deleteUser.rejected.match(response)) {
        dispatch(setIsOpen(true));
        dispatch(setMessage(response.payload.message));
      }
    } catch (error) {
      console.error("error deleting user: ", error);
    }
  };

  // useEffect(() => {
  //   fetchUsers();
  // }, [users]);

  //fetch User
  // useEffect(() => {
 const fetchUsers = async (searchFilers = {}) => {
    try {
      const data = await getFilterdUser(token, searchFilers);

    // Handle known error structure from Java backend
    if (data?.status === "INTERNAL_SERVER_ERROR" || data?.message === "No users found") {
      console.warn("Backend response:", data.message || "No users found.");
      dispatch(setIsOpen(true));
      dispatch(setMessage(data?.message));
      setUsers([]); // Show empty list
      return;
    }
      console.log(data);
      const currentUserRole = role;

      let filterUsers = data;

      if (currentUserRole !== "SUPER_ADMIN" && userRoles.length > 0) {
        filterUsers = data.filter((user: User) => {
          const roleName = userRoles.find(
            (role) => role.id === Number(user.roleId)
          )?.name;
          return roleName !== "ADMIN" && roleName !== "SUPER_ADMIN";
        });
      }

      filterUsers.sort((a: User, b: User) =>
        a.email.toLowerCase().localeCompare(b.email.toLowerCase())
      );

      filterUsers = data.filter((user: User) => {
        return currentUser.email !== user.email;
      });

      setUsers(filterUsers);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    }
  };

  // Fetch Role
  useEffect(() => {
    try {
      const data = async () => {
        if (!token) return;
        const response = await dispatch(fetchRole(token));
        console.log(response);
        setUserRoles(response.payload);
      };
      data();
    } catch (error) {}
  }, []);

  // Modal related
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);

  const fetchUser = async (id: any) => {
    try {
      const res = await axios.get(`${configApi.apiBaseUrl}/user/get/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEditingStatus(res.data);
    } catch (error) {
      console.error("Failed to fetch user", error);
    } finally {
    }
  };

  const handleCloseModal = () => {
    dispatch(closeModal());

    fetchUsers();
  };

  const handleOpenOpenPopup = (userId) => {
    setSelectedUserId(userId);
    setIsModalOpen(true);
    setEditingStatus({ ...editingStatus, id: userId });
    fetchUser(userId);
  };

  const handleChangeStatus = async (id: any, status: any) => {
    try {
      editingStatus.status = status;
      editingStatus.id = id;
      const result = await dispatch(
        updateUser({ token, id, payload: editingStatus })
      );
      console.log("User status updated:", result);
      setIsModalOpen(false);
      fetchUsers(filters); // Refresh the page
    } catch (error) {
      console.error("Error updating user status: ", error);
    } finally {
      setShowAddModal(false); // Close the modal
      setEditingStatus({
        email: "",
        firstName: "",
        lastName: "",
        role: "",
        password: "",
        phoneNumber: "",
        company: "",
        address: "",
        city: "",
        roleId: 0,
        status: "",
      });
    }
  };

  const handleAddUser = () => {
    navigate("/admin/adduser");
  };

  return (
    <div className="     sm:mx-auto mt-[5%]  w-[100%] sm:w-[100%] md:w-full sm:px-6 lg:px-8  ">
      <Breadcrumb />
      <div className="   relative       ">
        <caption className="flex pb-1 justify-center items-center py-2 text-2xl   text-purple-800 font-bold bg-white dark:text-white dark:bg-gray-800">
          User List
        </caption>

        <SearchBox
          filters={filters}
          handleFilterChange={handleFilterChange}
          setCurrentPage={setCurrentPage}
          fetchUsers={fetchUsers}
          resetForm={resetForm}
          handleAddUser={handleAddUser}
        />
        <table className=" rounded-lg shadow-md   w-full text-sm text-center rtl:text-right text-gray-500 dark:text-gray-400     ">
          <thead className="text-xs text-white uppercase bg-yellow-900  dark:bg-gray-700 dark:text-gray-400">
            <tr className=" ">
              <th scope="col" className="px-6 py-2">
                Email
              </th>
              <th scope="col" className="px-6 py-2">
                FirstName
              </th>
              <th scope="col" className="px-6 py-2">
                Lastname
              </th>
              <th scope="col" className="px-6 py-2">
                Contact
              </th>
              <th scope="col" className="px-6 py-2">
                Company
              </th>
              <th scope="col" className="px-6 py-2">
                City
              </th>
              <th scope="col" className="px-6 py-2">
                Address
              </th>
              <th scope="col" className="px-6 py-2  ">
                Status
              </th>
               {/* {role === "SUPER_ADMIN" && (
              <th scope="col" className="px-6 py-2">
                Group Name
              </th>
                )} */}
              <th scope="col" className="px-6 py-2">
                Role
              </th>
              <th scope="col" className="px-6 py-2">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {currentUsers.map((user) => (
              <tr
                key={user.id}
                className="bg-white    font-base border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200 hover:bg-gray-200 text-black"
              >
                <td
                  scope="row"
                  className="px-6 py-1 font-medium  whitespace-nowrap dark:text-white"
                >
                  {user.email}
                </td>
                <td className="px-6 py-1">{user.firstName} </td>
                <td className="px-6 py-1"> {user.lastName} </td>
                <td className="px-6 py-1"> {user.phoneNumber} </td>
                <td className="px-6 py-1"> {user.company} </td>
                <td className="px-6 py-1"> {user.city} </td>
                <td className="px-6 py-1"> {user.address} </td>
                <td className="px-6 py-1  ">
                  {user.status === "PENDING" ? (
                    <a
                      onClick={() => handleOpenOpenPopup(user.id)}
                      className={`text-yellow-900 font-semibold cursor-pointer bg-yellow-100 ring-2 ring-yellow-500 rounded-full px-3 py-0`}
                    >
                      {user.status}
                    </a>
                  ) : user.status === "APPROVED" ? (
                    <button
                      disabled
                      className="text-green-900 font-semibold cursor-not-allowed bg-green-200 ring-2 ring-green-800 rounded-full px-2 py-0"
                    >
                      {user.status}
                    </button>
                  ) : user.status === "REJECT" ? (
                    <button
                      disabled
                      className="text-red-700 font-semibold cursor-not-allowed bg-red-200 ring-2 ring-red-700 rounded-full px-5 py-0"
                    >
                      {user.status}
                    </button>
                  ) : null}
                </td>
                  {/* {role === "SUPER_ADMIN" && (
                    <td className="px-6 py-2 uppercase  ">
                      {userRoles.find((roles)=> roles.groupId===user?.groupId)?.groupName}
                      </td>
                  )} */}
                <td className="px-6 py-1">
                  {userRoles.find((role) => role.id === user?.roleId)?.name}
                </td>
                
                <td className="px-6 pt-2">
                  <div className="flex">
                    <div className="flex-inline items-center ">
                      <button
                        type="button"
                        onClick={() => navigate(`/admin/userEdit/${user.id}`)}
                        // className=" cursor-pointer py-1 px-3 me-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-full border border-gray-200   hover:text-white  hover:bg-blue-500 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                        className={`px-3 cursor-pointer py-1 rounded-full text-sm font-medium transition-all 
                            ${
                              user.status === "REJECT"
                                ? "bg-gray-300 text-gray-600   cursor-not-allowed"
                                : "bg-white text-blue-500 hover:bg-white hover:text-white  border border-gray-200 shadow"
                            } `}
                        disabled={
                          userRoles.find((role) => role.id === user.roleId)
                            ?.name === "SUPER_ADMIN" || user.status === "REJECT"
                        }
                      >
                        <svg
                          className="w-6 h-6 text-purple-500 cursor-pointer hover:text-red-400   dark:text-white"
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
                    </div>
                    <div className="flex items-center ml-2">
                      <button
                        onClick={() => handleDelete(user.id)}
                        className=" cursor-pointer py-1 px-4 me-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-full border border-gray-200 hover:bg-red-500 hover:text-white focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700 shadow"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          x="0px"
                          y="0px"
                          color="blue"
                          viewBox="0 0 24 24"
                          className="w-6 h-6  cursor-pointer  dark:text-white"
                        >
                          <path d="M 10 2 L 9 3 L 3 3 L 3 5 L 4.109375 5 L 5.8925781 20.255859 L 5.8925781 20.263672 C 6.023602 21.250335 6.8803207 22 7.875 22 L 16.123047 22 C 17.117726 22 17.974445 21.250322 18.105469 20.263672 L 18.107422 20.255859 L 19.890625 5 L 21 5 L 21 3 L 15 3 L 14 2 L 10 2 z M 6.125 5 L 17.875 5 L 16.123047 20 L 7.875 20 L 6.125 5 z"></path>
                        </svg>
                      </button>
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Pagination
        setCurrentPage={setCurrentPage}
        currentPage={currentPage}
        totalPages={totalPages}
      />

      {/* Modal Required */}
      {isModalOpen && (
        <EditRoleModal
          handleChangeStatus={handleChangeStatus}
          selectedUserId={selectedUserId}
          setIsModalOpen={setIsModalOpen}
        />
      )}

      {isOpen && (
        <AlertModal
          message={message}
          onClose={handleCloseModal}
          duration={1000}
        />
      )}
    </div>
  );
};

export default UserList;
