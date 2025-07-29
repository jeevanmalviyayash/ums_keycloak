const EditProfileModal = ({
  profile,
  handleChange,
  handleCloseModal,
  saveEditedData,
  fieldError,
}) => {
  return (
    <>
      <div className=" relative md:mt-[1%]  inset-0 z-50 flex items-center justify-center bg-transparent bg-opacity-50">
        <div
          id="authentication-modal"
          tabIndex={-1}
          aria-hidden="false"
          className="  overflow-x-hidden w-[40%]  "
        >
          <div className="relative p-4 w-full">
            <div className="relative bg-white rounded-lg shadow-md border   ring-1 dark:bg-gray-700">
              <div className="flex items-center justify-between p-2 md:p-2 border-b rounded-t dark:border-gray-600 border-gray-200">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Edit Profile
                </h3>
                <button
                  type="button"
                  onClick={handleCloseModal}
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

              <div className="p-2 md:p-4">
                <form className="space-y-1" onSubmit={saveEditedData}>
                  <div>
                    <label
                      htmlFor="phoneNumber"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Contact
                    </label>
                    <input
                      type="text"
                      name="phoneNumber"
                      id="phoneNumber"
                      value={profile.phoneNumber}
                      onChange={handleChange}
                      placeholder="Enter contact "
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                    />
                    <small
                      className={`text-red-500 block text-xs max-w-[300px] leading-tight min-h-[0.2rem] overflow-hidden break-words   ${
                        !fieldError.phoneNumber ? "invisible" : ""
                      }`}
                    >
                      {fieldError.phoneNumber || "Placeholder"}
                    </small>
                  </div>
                  <div>
                    <label
                      htmlFor="address"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Address
                    </label>
                    <input
                      type="text"
                      name="address"
                      id="address"
                      value={profile.address}
                      onChange={handleChange}
                      placeholder="Enter address  "
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                    />
                    <small
                      className={`text-red-500 block text-xs leading-tight min-h-[0.5rem] overflow-hidden break-words   ${
                        !fieldError.address ? "invisible" : ""
                      }`}
                    >
                      {fieldError.address || "Placeholder"}
                    </small>
                  </div>
                  {/* City */}
                  <div>
                    <label
                      htmlFor="address"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      City
                    </label>
                    <input
                      type="text"
                      name="city"
                      id="city"
                      value={profile.city}
                      onChange={handleChange}
                      placeholder="Enter city  "
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                    />
                    <small
                      className={`text-red-500 block text-xs leading-tight min-h-[0.5rem] overflow-hidden break-words   ${
                        !fieldError.city ? "invisible" : ""
                      }`}
                    >
                      {fieldError.city || "Placeholder"}
                    </small>
                  </div>

                  {/* Company */}
                  <div>
                    <label
                      htmlFor="address"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Company
                    </label>
                    <input
                      type="text"
                      name="company"
                      id="company"
                      value={profile.company}
                      onChange={handleChange}
                      placeholder="Enter company  "
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                    />
                    <small
                      className={`text-red-500 block text-xs leading-tight min-h-[0.5rem] overflow-hidden break-words   ${
                        !fieldError.company ? "invisible" : ""
                      }`}
                    >
                      {fieldError.company || "Placeholder"}
                    </small>
                  </div>
                  <button
                    type="submit"
                    className="cursor-pointer w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                  >
                    Update
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

export default EditProfileModal;
