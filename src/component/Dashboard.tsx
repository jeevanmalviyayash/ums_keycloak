import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../app/store";
import { useNavigate } from "react-router-dom";
import { getFilterdUser } from "../features/register/registerAction";

const Dashboard = () => {
  const { isAuthenticated } = useSelector((state: RootState) => state.token);
  const { user } = useSelector((state: RootState) => state.login);
  const { token } = useSelector((state: RootState) => state.token);

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
  // const isAuthenticated = JSON.parse(sessionStorage.getItem("isAuthenticate"));
  const fetchUsers = async (searchFilter = {}) => {
    try {
      const roleData = await getFilterdUser(token, { email: user?.email });
      setProfile(roleData[0]);
    } catch (error) {
      console.error("Failed to fetch users", error);
    }
  };

  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
    fetchUsers();
  }, []);

  return (
    <>
      <section className="bg-center bg-no-repeat h-screen bg-[url('https://flowbite.s3.amazonaws.com/docs/jumbotron/conference.jpg')] bg-gray-700 bg-blend-multiply flex items-center justify-center">
        <div className="backdrop-blur-sm bg-white/10 border border-white/30 shadow-lg rounded-xl p-8 max-w-3xl w-full text-white">
          {/* Profile Section */}
          <div className="flex flex-col items-center mb-6">
            <h2 className="text-2xl font-bold">
              {"Welcome, " + profile?.firstName + " "} {profile?.lastName}
            </h2>
            {/* <p className="text-sm text-gray-200">
              {"Email - " + profile?.email}
            </p> */}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm mt-4 text-white">
            {/* LEFT COLUMN */}
            <div className="space-y-4">
              <div className="border border-white/30 rounded-lg p-4 backdrop-blur-md bg-white/10">
                <span className="font-semibold block mb-1">Email:</span>
                <p>{user?.email || "—"}</p>
              </div>
              <div className="border border-white/30 rounded-lg p-4 backdrop-blur-md bg-white/10">
                <span className="font-semibold block mb-1">Role:</span>
                <p>{user?.role || "—"}</p>
              </div>
              <div className="border border-white/30 rounded-lg p-4 backdrop-blur-md bg-white/10">
                <span className="font-semibold block mb-1">Phone Number:</span>
                <p>{profile?.phoneNumber || "—"}</p>
              </div>
            </div>

            {/* RIGHT COLUMN */}
            <div className="space-y-4">
              <div className="border border-white/30 rounded-lg p-4 backdrop-blur-md bg-white/10">
                <span className="font-semibold block mb-1">Address:</span>
                <p>{profile?.address || "—"}</p>
              </div>
              <div className="border border-white/30 rounded-lg p-4 backdrop-blur-md bg-white/10">
                <span className="font-semibold block mb-1">City:</span>
                <p>{profile?.city || "—"}</p>
              </div>
              <div className="border border-white/30 rounded-lg p-4 backdrop-blur-md bg-white/10">
                <span className="font-semibold block mb-1">Company:</span>
                <p>{profile?.company || "—"}</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Dashboard;
