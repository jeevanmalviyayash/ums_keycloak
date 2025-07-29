import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Register from "./component/auth/Register";
import Dashboard from "./component/Dashboard";
import Navbar from "./component/Navbar";
import Login from "./component/auth/Login";
import RedirectIfAuthenticate from "./utils/RedirectIfAuthenticate";
import ProtectedAdminRoute from "./utils/ProtectedAdminRoute";
import UserList from "./component/UserList";
import EditUserPage from "./component/EditUserPage";
import AddUser from "./component/AddUser";
import AddNewRole from "./component/AddNewRole";
import Profile from "./component/Profile";
import ChangePasswordModal from "./component/ChangePassModal";
import AuthWatcher from "./utils/AuthWatcher";
import AddNewGroupModal from "./component/AddNewGroup";
import AddGroup from "./component/Groups";
import EditGroup from "./component/EditGroup";

function App() {
  return (
    <Router>
      <AuthWatcher />
      <Navbar />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/changepass" element={<ChangePasswordModal />} />

        <Route
          path="/register"
          element={
            <RedirectIfAuthenticate>
              <Register />
            </RedirectIfAuthenticate>
          }
        />
        <Route
          path="/login"
          element={
            <RedirectIfAuthenticate>
              <Login />
            </RedirectIfAuthenticate>
          }
        />

        <Route
          path="/profile"
          element={
            <>
              <Profile />
            </>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedAdminRoute>
              <Navigate to="/admin/users" replace />
            </ProtectedAdminRoute>
          }
        />

        <Route
          path="/admin/users"
          element={
            <ProtectedAdminRoute>
              <UserList />
            </ProtectedAdminRoute>
          }
        />

        <Route
          path="/admin/userEdit/:id"
          element={
            <ProtectedAdminRoute>
              <EditUserPage />
            </ProtectedAdminRoute>
          }
        />

        <Route
          path="/admin/adduser"
          element={
            <ProtectedAdminRoute>
              <AddUser />
            </ProtectedAdminRoute>
          }
        />

        <Route
          path="/admin/addRole"
          element={
            <ProtectedAdminRoute>
              <AddNewRole />
            </ProtectedAdminRoute>
          }
        />
        <Route
        path="/admin/addNewGroup"
        element={
           <ProtectedAdminRoute>
              <AddNewGroupModal />
            </ProtectedAdminRoute>
        }
        />
        <Route
        path="/admin/addGroup" 
          element={
           <ProtectedAdminRoute>
              <AddGroup />
            </ProtectedAdminRoute>
        }
        />
         <Route
        path="admin/editGroup/:id" 
          element={
           <ProtectedAdminRoute>
              <EditGroup />
            </ProtectedAdminRoute>
        }
        />
      </Routes>
    </Router>
  );
}

export default App;
