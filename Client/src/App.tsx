import { Route, Routes } from "react-router-dom"
import UserProfile from "./Components/user/UserProfile"
import UserHomePage from "./Pages/user/HomePage"
import AdminDashboard from './Pages/Admin/Dashboard'
import Login from "./Components/auth/Login"

const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Login/>}/>
        <Route path="/home" element={<UserHomePage/>}/>
        <Route path="/admin" element={<AdminDashboard/>}/>
        <Route path="/profile" element={<UserProfile/>}/>
      </Routes>
    </div>
  )
}

export default App
