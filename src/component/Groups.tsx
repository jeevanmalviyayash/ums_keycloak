import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../app/store";
import {
  fetchGroup,
  deleteGroupById,
  createGroup,
  updateGroupById,
} from "../features/group/groupAction";
import {
  clearGroupFieldError,
  setGroupFieldError,
  setGroupShouldRedirect,
} from "../features/group/groupSlice";
import Breadcrumb from "../utils/Breadcrumb";
import AlertModal from "../utils/AlertModal";
import {
  closeModal,
  setIsOpen,
  setMessage,
} from "../features/modal/modalSlice";
import AddNewGroupModal from "./AddNewGroupModal";
//import EditGroupModal from "../utils/EditGroupModal"; // You’d need to create this modal similar to EditRoleModal
import { useNavigate } from "react-router-dom";
import Pagination from "./Pagination";

type Group = {
  id: number;
  name: string;
  description: string;
};

const AddGroup = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token } = useSelector((state: RootState) => state.token);
  const { isOpen, message } = useSelector(
    (state: RootState) => state.alertModal
  );
  const { fieldError, shouldRedirect } = useSelector(
    (state: RootState) => state.groupReducer
  );

  const [groups, setGroups] = useState<Group[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState<Group>({
    id: 0,
    name: "",
    description: "",
  });

  useEffect(() => {
    dispatch(clearGroupFieldError());
    fetchAllGroups();
  }, []);

  const fetchAllGroups = async () => {
    try {
      const response = await dispatch(fetchGroup(token));
      setGroups(response.payload);
    } catch (error) {
      console.error("Error fetching groups: ", error);
    }
  };

  const handleAddClick = () => {
    setEditingGroup({ id: 0, name: "", description: "" });
    // setIsAddModalOpen(true);
    navigate("/admin/addNewGroup");
  };

  const handleEdit = (group: Group) => {
    setEditingGroup(group);
    navigate(`/admin/editGroup/${group.id}`);
  };

  const handleDelete = async (id: number) => {
    try {
      const result = await dispatch(deleteGroupById({ token, id }));
      if (deleteGroupById.fulfilled.match(result)) {
        setGroups((prev) => prev.filter((g) => g.id !== id));
      } else {
        dispatch(setIsOpen(true));
        dispatch(setMessage("Delete failed"));
      }
    } catch (error) {
      console.error("Failed to delete group", error);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingGroup({ id: 0, name: "", description: "" });
    dispatch(clearGroupFieldError());
  };

  const handleCloseAdd = () => {
    setIsAddModalOpen(false);
    dispatch(clearGroupFieldError());
  };

  const [currentPage, setCurrentPage] = useState(1);
  const groupsPerPage = 6;

  const indexOfLastUser = currentPage * groupsPerPage;
  const indexOfFirstUser = indexOfLastUser - groupsPerPage;
  const currentGroups = groups.slice(indexOfFirstUser, indexOfLastUser);

  const totalPages = Math.ceil(groups.length / groupsPerPage);

  return (
    <div className="     md:mx-auto sm:mx-auto mt-[5%]   w-[100%] sm:w-[100%] md:w-[100%] md:h-[50vh]  sm:px-6 lg:px-8 ">
      <Breadcrumb />
      {isModalOpen || isAddModalOpen ? null : (
        <div className=" mt-3  relative overflow-x-auto  border p-3       shadow-lg    sm:rounded-lg">
          <h1 className="text-center text-2xl text-purple-900 font-bold">
            Group Management
          </h1>
          <button
            type="button"
            onClick={handleAddClick}
            className="mx-2 my-2 p-2 text-xs font-medium text-center cursor-pointer   text-white bg-purple-500 rounded-lg hover:bg-yellow-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            Add New Group
          </button>
          <table className="w-full text-sm text-left          rtl:text-right text-gray-500 dark:text-gray-400   ">
            <thead className="text-xs bg-yellow-900  text-white uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th className="px-6 py-2">ID</th>
                <th className="px-6 py-2">Group Name</th>
                <th className="px-6 py-2">Description</th>
                <th className="px-6 py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {currentGroups.map((group, index) => (
                <tr
                  key={group.id}
                  className=" text-black font-semibold  odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700 border-gray-200"
                >
                  <td className="px-6 py-2 font-medium text-gray-900 dark:text-white">
                    {index + 1}
                  </td>
                  <td className="px-6 py-2">{group.name}</td>
                  <td className="px-6 py-2">{group.description}</td>
                  <td className="px-6 py-2 flex">
                    <button
                      onClick={() => handleEdit(group)}
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
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="m14.304 4.844 2.852 2.852M7 7H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-4.5m2.409-9.91a2.017 2.017 0 0 1 0 2.853l-6.844 6.844L8 14l.713-3.565 6.844-6.844a2.015 2.015 0 0 1 2.852 0Z"
                        />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDelete(group.id)}
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
        </div>
      )}
      <Pagination
        setCurrentPage={setCurrentPage}
        currentPage={currentPage}
        totalPages={totalPages}
      />

      {/* {isModalOpen && (
        <EditGroupModal
          editingGroup={editingGroup}
          handleCloseModal={handleCloseModal}
        />
      )} */}

      {/* {isAddModalOpen && (
        <AddNewGroupModal
          editingGroup={editingGroup}
          handleChange={(e) =>
            setEditingGroup((prev) => ({
              ...prev,
              [e.target.name]: e.target.value,
            }))
          }
          handleAddGroup={() => dispatch(createGroup({ token, data: editingGroup }))}
          handleClose={handleCloseAdd}
        />
      )} */}

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

export default AddGroup;
