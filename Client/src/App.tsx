import { Route, Routes } from "react-router-dom";
import UserProfile from './Pages/user/ProfilePage';
import UserHomePage from "./Pages/user/HomePage";
import AdminDashboard from './Pages/Admin/Dashboard';
import Login from "./Components/auth/Login";
import ChangePassword from "./Components/user/ChangePassword";
import  { Suspense, lazy } from "react";
import LoadingSpinner from "./Components/LoadiingSpinner/LoadingSpinner";

// Lazy load Dashboard component
const Dashboard = lazy(() => import('./Components/user/DashBoard'));

const App = () => {
  return (
    <div>
      {/* Wrapping Routes inside Suspense with the LoadingSpinner fallback */}
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/home" element={<UserHomePage />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/change-password" element={<ChangePassword />} />
          {/* Lazy-loaded Dashboard route */}
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </Suspense>
    </div>
  );
}

export default App;