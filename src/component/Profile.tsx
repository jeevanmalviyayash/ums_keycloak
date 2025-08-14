import { useEffect, useState } from "react";
import profileImg from "../assets/profile.svg";
import { getFilterdUser } from "../features/register/registerAction";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../app/store";
import EditProfileModal from "./EditProfileModal";
import { updateUser } from "../features/editUser/editUseraction";
import { ProfileValidation } from "../utils/ProfileValidation";
import {
  closeModal,
  setIsOpen,
  setMessage,
} from "../features/modal/modalSlice";
import {
  clearFieldError,
  setFieldError,
  setShouldRedirect,
} from "../features/profile/profileSlice";
import AlertModal from "../utils/AlertModal";
import { useNavigate } from "react-router-dom";
import Breadcrumb from "../utils/Breadcrumb";

const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { message, isOpen } = useSelector(
    (state: RootState) => state.alertModal
  );

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  const { user } = useSelector((state: RootState) => state.login);
  const { token } = useSelector((state: RootState) => state.token);
  const { fieldError, shouldRedirect } = useSelector(
    (state: RootState) => state.profile
  );
  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    role: "",
    email: "",
    phoneNumber: "",
    address: "",
    city: "",
    company: "",
    password: "",
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userId, setUserId] = useState("");

  const handleCloseAlertModal = () => {
    dispatch(closeModal());
    if (shouldRedirect) {
      navigate("/profile");
    }
  };
  const fetchUsers = async (searchFilter = {}) => {
    try {
      const roleData = await getFilterdUser(token, { email: user?.email });
      setProfile(roleData[0]);
      setUserId(roleData.id);
    } catch (error) {
      console.error("Failed to fetch users", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [profile.email]);

  const handleChange = (e: any) => {
    const { name, value } = e.target;

    let trimmedValue = value;

    const hasOnlySpaces = value.length > 0 && trimmedValue === "";

    const forbiddenChars = /[`~!#$%^&*():{}=]/;

    if (hasOnlySpaces || forbiddenChars.test(value)) return;
if (["company", "address", "city"].includes(name) && value.startsWith(" ")) {
  return;
}



    if (name === "phoneNumber") {
      const onlyDigits = value.replace(/\D/g, ""); // remove non-digits
      if (onlyDigits.length <= 10) {
        setProfile({
          ...profile,
          [name]: onlyDigits,
        });
      }
    } else {
      setProfile((prev) => ({
        ...prev,
        [name]: trimmedValue,
      }));
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const saveEditedData = async (e: any) => {
    e.preventDefault();

    const isValid = ProfileValidation(profile, dispatch);

    if (isValid) {
      try {
        const roleData = await getFilterdUser(token, { email: user?.email });
        console.log(roleData);

        const result = await dispatch(
          updateUser({ token, id: roleData[0].id, payload: profile })
        );

        if (updateUser.fulfilled.match(result)) {
          dispatch(setIsOpen(true));
          dispatch(setMessage("Update Profile Successfully"));
          dispatch(setShouldRedirect(true));
        } else if (updateUser.rejected.match(result)) {
          const payload = result.payload;

          if (payload && typeof payload === "object") {
            if (
              "address" in payload ||
              "city" in payload ||
              "company" in payload ||
              "phoneNumber" in payload
            ) {
              dispatch(setFieldError(payload));
            } else if ("message" in payload) {
              dispatch(setIsOpen(true));
              dispatch(setMessage(result.payload.message));
            }
          }
          setTimeout(() => {
            dispatch(clearFieldError());
          }, 3000);
        }
      } catch (error) {
        console.error("Error: ", error);
      }
    }
  };

  const handleEditModalOpen = () => {
    setIsModalOpen(true);
    fetchUsers();
    dispatch(clearFieldError());
    setIsDropdownOpen((prev) => !prev);
  };

  return (
    <div className="sm:mx-auto mt-[5%]  w-[100%] sm:w-[100%] md:w-full sm:px-6 lg:px-8 p-2  ">
      <Breadcrumb />
      {isModalOpen ? (
        ""
      ) : (
        <div className="container flex justify-center md:mt-[4%] ml-10   items-center ">
          <div className="w-full max-w-sm bg-white border border-gray-500 rounded-lg shadow-lg dark:bg-gray-800 dark:border-gray-700">
            <div className="flex justify-end px-4 pt-4 relative">
              <button
                onClick={toggleDropdown}
                className="inline-block text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:ring-4 focus:outline-none focus:ring-gray-200 dark:focus:ring-gray-700 rounded-lg text-sm p-1.5"
                type="button"
              >
                <span className="sr-only">Open dropdown</span>
                <svg
                  className="w-5 h-5"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 16 3"
                >
                  <path d="M2 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm6.041 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM14 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Z" />
                </svg>
              </button>

              {isDropdownOpen && (
                <div className="absolute top-10 right-0 z-10 text-base list-none bg-white divide-y divide-gray-100 rounded-lg shadow-sm w-44 dark:bg-gray-700">
                  <ul className="py-2">
                    <li>
                      <button
                        onClick={handleEditModalOpen}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                      >
                        Edit Details
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={() => {
                          setIsDropdownOpen(false);
                          navigate("/changepass"); // 👈 Use your route path here
                        }}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                      >
                        Reset Password
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </div>

            <div className="flex flex-col items-center pb-10   ">
              <div className="  w-15 h-15 mx-2 rounded-full bg-blue-500 text-white flex items-center justify-center text-2xl font-semibold ring-2 ring-gray-200">
                {user.firstName?.substring(0, 2).toUpperCase()}
              </div>
              <h5 className="mb-1 text-upperCase  mt-3 text-xl font-medium text-gray-900 dark:text-white">
                {user.firstName}
              </h5>
              <div className="grid grid-cols-1 gap-2 mt-2 text-center sm:grid-cols-2">
                <span className="text-justify"> Email</span>
                <span className="text-sm font-semibold text-gray-800 dark:text-gray-400 text-justify">
                  : {user.email}
                </span>
                <span className="text-justify"> Role</span>
                <span className="text-sm font-semibold text-gray-800 dark:text-gray-400 text-justify">
                  : {user.roleName}
                </span>
                <span className="text-justify"> Phone Number</span>
                <span className="text-sm text-gray-800 font-semibold dark:text-gray-400 text-justify">
                  : {profile.phoneNumber}
                </span>
                <span className="text-justify">Address</span>
                <span className="text-sm font-semibold text-gray-800 dark:text-gray-400 text-justify">
                  : {profile.address}
                </span>
                <span className="text-justify"> City</span>
                <span className="text-sm font-semibold text-gray-800 dark:text-gray-400 text-justify">
                  : {profile.city}
                </span>
                <span className="text-justify">Company</span>
                <span className="text-sm font-semibold text-gray-800 dark:text-gray-400 text-justify">
                  : {profile.company}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
      {isModalOpen && (
        <EditProfileModal
          profile={profile}
          handleChange={handleChange}
          handleCloseModal={handleCloseModal}
          saveEditedData={saveEditedData}
          fieldError={fieldError}
        />
      )}

      {isOpen && (
        <AlertModal
          message={message}
          onClose={handleCloseAlertModal}
          duration={1000}
        />
      )}
    </div>
  );
};

export default Profile;
