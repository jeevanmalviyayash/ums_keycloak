const EditRoleModal = (props) => {
  const { handleChangeStatus, selectedUserId, setIsModalOpen } = props;
  return (
    <>
      <div className="fixed  shadow-lg inset-0 z-50 flex items-center justify-center bg-transparent bg-opacity-0">
        <div className="bg-white border border-blue-300  ring-1  dark:bg-gray-800 p-6 rounded-lg shadow-lg w-[90%] sm:w-[400px]">
          <div className="flex ">
            <button
              onClick={() => setIsModalOpen(false)}
              className=" ml-auto mt-4 text-sm text-gray-500 hover:underline cursor-pointer"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <h2 className="text-lg text-center font-semibold text-gray-900 dark:text-white mb-4">
            Approve or Reject User
          </h2>

          <div className="flex pt-2 justify-between">
            <button
              onClick={() => handleChangeStatus(selectedUserId, "APPROVED")}
              className="py-2 shadow-sm px-3 me-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-green-600 hover:text-white focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
            >
              Approve
            </button>
            <button
              onClick={() => handleChangeStatus(selectedUserId, "REJECT")}
              className="py-2 shadow-sm px-3 me-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-red-600 hover:text-white focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
            >
              Reject
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditRoleModal;
