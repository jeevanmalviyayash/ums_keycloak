import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../app/store";
import {
  clearGroupFieldError,
  setGroupFieldError,
  GroupFieldError,
  setGroupShouldRedirect,
} from "../features/group/groupSlice"; // assuming you create this slice
import { GroupValidation } from "../utils/GroupValidation"; // your validation logic
import { createGroup } from "../features/group/groupAction";
import {
  closeModal,
  setIsOpen,
  setMessage,
} from "../features/modal/modalSlice";
import AlertModal from "../utils/AlertModal";
import { useNavigate } from "react-router-dom";

const AddGNewGroup = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { fieldError } = useSelector((state: RootState) => state.groupReducer);
  const { token } = useSelector((state: RootState) => state.token);
  const { isOpen, message } = useSelector(
    (state: RootState) => state.alertModal
  );

  const [groupData, setGroupData] = useState<{
    id?: number;
    name: string;
    description: string;
  }>({
    name: "",
    description: "",
  });

  useEffect(() => {
    dispatch(clearGroupFieldError());
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const trimmedValue = value.trim();
    const hasOnlySpaces = value.length > 0 && trimmedValue === "";

    // Combined forbidden character check
    const forbiddenChars = /[`~!#$%^&*():{}=]/;
    if (hasOnlySpaces || forbiddenChars.test(value)) return;

    if (name === "name") {
      setGroupData({
        ...groupData,
        [name]: trimmedValue.toUpperCase(),
      });
      return;
    }
    setGroupData({
      ...groupData,
      [name]: value,
    });
    //  setGroupData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddGroup = async (e: any) => {
    e.preventDefault();
    try {
      const isValid = GroupValidation(groupData, dispatch);
      if (isValid) {
        const editedGroupNameInUpperCase = groupData.name.toUpperCase();
        console.log(editedGroupNameInUpperCase);

        const updatedGroup = {
          ...groupData,
          name: editedGroupNameInUpperCase,
        };

        const resultAction = await dispatch(
          createGroup({ token, data: updatedGroup })
        );

        if (createGroup.fulfilled.match(resultAction)) {
          const response = resultAction.payload;
          console.log("FullFilled: ", response);

          dispatch(setIsOpen(true));
          dispatch(setMessage(resultAction.payload.message));
          dispatch(setGroupShouldRedirect(true));
          setGroupData({
            name: "",
            description: "",
          });
        } else if (createGroup.rejected.match(resultAction)) {
          const response = resultAction.payload;
          dispatch(setIsOpen(true));
          dispatch(setMessage(response + ""));
          dispatch(setGroupShouldRedirect(true));
        }
      } else {
        return;
      }
    } catch (error) {
      console.error("Error saving group:", error);
    }
  };

  const handleCloseModal = () => {
    dispatch(closeModal());
    setGroupData({
      name: "",
      description: "",
    });
    dispatch(setGroupFieldError({}));
    dispatch(clearGroupFieldError());
    navigate("/admin/addGroup");
  };

  const handleCancel = () => {
    setGroupData({ name: "", description: "" });
    setGroupFieldError({});

    // Optional: close modal or redirect if needed
    navigate("/admin/addGroup"); // if you want to go back somewhere
  };
  const handleClose = () => {
    setGroupData({ name: "", description: "" });
    setGroupFieldError({});

    // Optional: close modal or redirect if needed
    navigate("/admin/addGroup"); // if you want to go back somewhere
  };

  return (
    <div className="min-h-screen   flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="max-w-2xl w-[30%] p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md ring-1 border dark:border-gray-600">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Add Group
          </h2>
          <button
            type="button"
            onClick={handleClose}
            className="cursor-pointer text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
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
        <form className="space-y-4" onSubmit={handleAddGroup}>
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

          <div className="flex justify-center  ">
            <button
              type="submit"
              className="cursor-pointer w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              Add Group
            </button>
            {/* <button
              type="button"
              onClick={handleCancel}
              className="text-sm px-4 py-2 text-gray-700 bg-gray-200 hover:bg-gray-300 focus:ring-gray-400 font-medium rounded-lg"
            >
              Cancel
            </button> */}
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
export default AddGNewGroup;
