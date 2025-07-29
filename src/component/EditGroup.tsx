import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../app/store";
import {
  clearGroupFieldError,
  setGroupFieldError,
  GroupFieldError,
  setGroupShouldRedirect,
} from "../features/group/groupSlice";
import { GroupValidation } from "../utils/GroupValidation";
import { fetchGroupById, updateGroupById } from "../features/group/groupAction"; // <-- Your update action
import { closeModal, setIsOpen, setMessage } from "../features/modal/modalSlice";
import AlertModal from "../utils/AlertModal";
import { useNavigate, useParams } from "react-router-dom";

interface EditGroupProps {
  initialData: {
    id: number;
    name: string;
    description: string;
  };
}

//const EditGroup = ({ initialData }: EditGroupProps) => {
const EditGroup = () => {
    const { id } = useParams();
      const navigate = useNavigate();
  const dispatch = useDispatch();
  const { fieldError } = useSelector((state: RootState) => state.groupReducer);
  const { token } = useSelector((state: RootState) => state.token);
  const { isOpen, message } = useSelector((state: RootState) => state.alertModal);

  //const [groupData, setGroupData] = useState({});
   const [groupData, setGroupData] = useState<{
    id?: number;
    name: string;
    description: string;
  }>({
    id:id,
    name: "",
    description: "",
  });

   const fetchGroup= async () => {
      try {
         const response = await dispatch(fetchGroupById({ token, id: groupData.id }));
        const result = response.payload;
  
        setGroupData(result);
      } catch (error) {
        console.error("Error fetching Group: ", error);
      }
    };
   useEffect(() => {
    if (id) {
      fetchGroup();
    }
  }, [id]);

  useEffect(() => {
    dispatch(clearGroupFieldError());
  }, [dispatch]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const trimmedValue = value.trim();
    const hasOnlySpaces = value.length > 0 && trimmedValue === "";

    const forbiddenChars = /[`~!#$%^&*():{}=]/;
    if (hasOnlySpaces || forbiddenChars.test(value)) return;

    setGroupData((prev) => ({
      ...prev,
      [name]: name === "name" ? trimmedValue : value,
    }));
  };

  const handleUpdateGroup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const isValid = GroupValidation(groupData, dispatch);
      if (isValid) {
        const resultAction = await dispatch(
          updateGroupById({ token, data: groupData })
        );

        if (updateGroupById.fulfilled.match(resultAction)) {
          dispatch(setIsOpen(true));
          dispatch(setMessage(resultAction.payload.message));
          dispatch(setGroupShouldRedirect(true));
        } else if (updateGroupById.rejected.match(resultAction)) {
          dispatch(setIsOpen(true));
          dispatch(setMessage(resultAction.payload + ""));
        }
      }
    } catch (error) {
      console.error("Error updating group:", error);
    }
  };

  const handleCloseModal = () => {
    dispatch(closeModal());
    dispatch(setGroupFieldError({}));
    dispatch(clearGroupFieldError());
    navigate("/admin/addGroup")
  };

   const handleCancel = () => {
    setGroupData({ name: "", description: "" });
    setGroupFieldError({});

    // Optional: close modal or redirect if needed
    navigate("/admin/addGroup"); // if you want to go back somewhere
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="max-w-2xl w-full p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md ring-1 border dark:border-gray-600">
        <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
          Edit Group
        </h2>
        <form className="space-y-4" onSubmit={handleUpdateGroup}>
          <div>
            <label
              htmlFor="name"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Group Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={groupData.name}
              onChange={handleChange}
              placeholder="Enter group name"
              className="w-full p-2.5 border rounded-lg bg-gray-50 text-sm text-gray-900 dark:bg-gray-700 dark:text-white dark:border-gray-500"
            />
            <small
              className={`text-red-500 text-xs ${
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
              id="description"
              name="description"
              value={groupData.description}
              onChange={handleChange}
              placeholder="Enter description"
              className="w-full p-2.5 border rounded-lg bg-gray-50 text-sm text-gray-900 dark:bg-gray-700 dark:text-white dark:border-gray-500"
            />
            <small
              className={`text-red-500 text-xs ${
                !fieldError.description ? "invisible" : ""
              }`}
            >
              {fieldError.description || "Placeholder"}
            </small>
          </div>

           <div className="flex justify-end space-x-3 pt-2">
          
            <button
            type="submit"
             className="text-sm px-4 py-2 text-white bg-green-700 hover:bg-green-800 focus:ring-blue-300 font-medium rounded-lg"
          >
            Update Group
          </button>
            <button
              type="button"
              onClick={handleCancel}
              className="text-sm px-4 py-2 text-gray-700 bg-gray-200 hover:bg-gray-300 focus:ring-gray-400 font-medium rounded-lg"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
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

export default EditGroup;
