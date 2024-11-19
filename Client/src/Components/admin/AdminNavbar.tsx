import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import Swal from "sweetalert2";
import { useDispatch, UseDispatch } from "react-redux";
import { clearUser } from "../../redux/slice/authSlice";
import {  useNavigate } from "react-router-dom";
import '../auth/Login.css'
import EditUserPage from "./EditUserPage";
import AddUsarPage from "./AddUsarPage";

interface User {
    _id: string;
    name: string;
    image: string;
    email: string;
    isAdmin: boolean;
    password?: string;
}

const AdminNavbar = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isModalOpen , setIsModalOpen] = useState(false);
  const [isModalAddOpen , setIsModalAddOpen] = useState(false);
  const [selectedUser , setSelectedUser] = useState<User | null>(null);
  const [debouncedSearch , setDebouncedSerch] = useState('');

  const navigate = useNavigate()
  const dispatch = useDispatch()

  const toggleSidebar = () => {
    setIsExpanded(!isExpanded);
  };


  // Modified to include both search query and page number
  const fetchUsers = async (query: string = '', page: number = 1) => {
    try {
      const token = Cookies.get('token');
      if (token) {
        const response = await axios.get(
          `http://localhost:5000/api/admin/getUser?query=${query}&page=${page}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        console.log(response.data.user)

        setUsers(response.data.users);
        setTotalPages(response.data.totalPages);
        setCurrentPage(response.data.currentPage);
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Authentication Error',
          text: 'Authentication token not found. Please log in again.',
          customClass: { popup: 'custom-swal' }
        });
        navigate('/')
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'An unexpected error occurred.';
      Swal.fire({
        icon: 'error',
        title: 'Fetch Error',
        text: `Failed to fetch users. ${errorMessage}`,
        customClass: { popup: 'custom-swal' }
      });
      console.error("An error occurred during fetchUsers:", error);
    }
  };

  useEffect(()=> {
    const timer = setTimeout(()=>{
        setDebouncedSerch(searchQuery);
    },500);
    return ()=> clearTimeout(timer);
  },[searchQuery])

  // Call fetchUsers when either page or search query changes
  useEffect(() => {
    fetchUsers(debouncedSearch, currentPage);
  }, [debouncedSearch,currentPage]); // Add currentPage as dependency

  const handleSearch = () => {
    setCurrentPage(1); // Reset to first page when searching
    fetchUsers(searchQuery, 1);
  };

  const handleChangeSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handleLogout = () => {
    dispatch(clearUser())
    navigate('/')
  }

  const handleAddUser = (user : User)=>{
    setSelectedUser(user)
    setIsModalAddOpen(true)
    setIsModalOpen(false)
  }

  const handleEditButton = (user : User )=>{
    setSelectedUser(user)
    setIsModalOpen(true)
    setIsModalAddOpen(false)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setIsModalAddOpen(false)
    setSelectedUser(null)
  }

  const handleUpdateUser = (updatedUser: User) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) => (user._id === updatedUser._id ? updatedUser : user))
    );
  };

  const handleDeleteUser = async (userId: string) => {

    console.log("this is deleted userId",userId)
    try {
      const confirmResult = await Swal.fire({
        title: 'Are you sure?',
        text: 'You won’t be able to revert this!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Yes, delete it!',
        customClass: { popup: 'custom-swal' },
      });
  
      if (confirmResult.isConfirmed) {
        const token = Cookies.get('token');
        if (!token) {
          throw new Error('Authentication token not found.');
        }
  
        await axios.delete(`http://localhost:5000/api/admin/deleteUser/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
  
        await fetchUsers(debouncedSearch, currentPage);
  
        Swal.fire({
          icon: 'success',
          title: 'Deleted!',
          text: 'The user has been deleted.',
          customClass: { popup: 'custom-swal' },
        });
      }
    } catch (error: any) {

      const errorMessage = error.response?.data?.message || 'Failed to delete user.';
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: errorMessage,
        customClass: { popup: 'custom-swal' },
      });
      console.error('An error occurred during deletion:', error);
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      {/* Left Sidebar */}
      {!isExpanded && (
        <div className="w-full md:w-[300px] md:min-h-screen bg-[#222222]">
          <div className="flex flex-col items-center p-4 md:p-9">
            <h1 className="text-2xl md:text-[33px] font-serif font-bold bg-gradient-to-r from-[#23c493] to-[#e9cd70] text-transparent bg-clip-text">
              R I Z O
            </h1>
            <h2 className="text-lg mt-4 md:text-[19px] font-normal font-sans">Admin</h2>
            <div className="w-[140px] sm:w-[280px] mt-4 md:mt-7 h-[3px] bg-gradient-to-r from-[#23c493] to-[#e9cd70]"></div>
          </div>
          <div className="flex flex-col items-center">
            <ul className="text-base md:text-[19px] text-white flex md:flex-col space-x-4 md:space-x-0">
              <li className="md:mb-8 md:mt-7 cursor-pointer hover:text-[#23c493] whitespace-nowrap">
                DashBoard
              </li>
              <li className="md:mb-8 cursor-pointer hover:text-[#23c493]">
                Users
              </li>
              <li className="md:mb-8 cursor-pointer hover:text-[#23c493]">
                Reports
              </li>
              <li className="md:mb-8 cursor-pointer hover:text-[#23c493]">
                Settings
              </li>
            </ul>
          </div>
        </div>
      )}

      {/* Right Side */}
      <div
        className={`flex-1 ${
          isExpanded ? "w-full" : "w-full md:w-[calc(100%-300px)]"
        } transition-all duration-300`}
      >
        {/* Navbar */}
        <div className="bg-[#222222] min-h-[140px] flex flex-col md:flex-row justify-between items-center p-4 md:p-6 space-y-4 md:space-y-0">
          {/* Menu Icon & Search Bar */}
          <div className="flex items-center space-x-4 w-full md:w-auto">
            <div
              className="menuicon p-3 rounded-[14px] bg-[#23c493] text-white cursor-pointer hover:bg-[#e9cd70] transition"
              onClick={toggleSidebar}
            >
              {isExpanded ? "❯" : "❮"}
            </div>
            <div className="flex items-center bg-gray-700 p-2 rounded-[14px] flex-1 md:flex-none">
              <input
                type="search"
                value={searchQuery}
                placeholder="Search User"
                className="outline-none bg-transparent text-white px-2 w-full"
                onChange={handleChangeSearch}
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-white cursor-pointer"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                onClick={handleSearch}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex items-center space-x-4">
            <button className="px-4 md:px-6 py-2 md:py-3 border-2 rounded-[14px] bg-gradient-to-r from-[#23c493] to-[#e9cd70] text-transparent bg-clip-text font-bold hover:opacity-80 transition border-gradient whitespace-nowrap" 
            onClick={handleAddUser}
            >
              Add User
            </button>
            <button onClick={handleLogout} className="px-4 md:px-6 py-2 md:py-3 border-2 rounded-[14px] bg-gradient-to-r from-[#23c493] to-[#e9cd70] text-transparent bg-clip-text font-bold hover:opacity-80 transition border-gradient whitespace-nowrap">
              Log Out
            </button>
          </div>
        </div>

        {/* User Listing */}
        <div className="p-4 md:p-5">
          <h1 className="text-xl md:text-[23px] font-extrabold mb-6">Dash Board</h1>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-[#343434] text-white rounded-lg">
              <thead>
                <tr>
                  <th className="px-3 md:px-6 py-3 text-left text-sm md:text-base">No</th>
                  <th className="px-3 md:px-6 py-3 text-left text-sm md:text-base">User</th>
                  <th className="hidden md:table-cell px-6 py-3 text-left">Email</th>
                  <th className="px-3 md:px-6 py-3 text-center text-sm md:text-base">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, index) => (
                  <tr
                    key={user._id}
                    className="border-t border-gray-700 hover:bg-[#222222]"
                  >
                    <td className="px-3 md:px-6 py-4 text-sm md:text-base">{index + 1}</td>
                    <td className="px-3 md:px-6 py-4">
                      <div className="flex items-center space-x-2 md:space-x-4">
                        <img
                          src={user.image}
                          className="w-8 h-8 md:w-10 md:h-10 rounded-full"
                        />
                        <span className="text-sm md:text-base">{user.name}</span>
                      </div>
                    </td>
                    <td className="hidden md:table-cell px-6 py-4">{user.email}</td>
                    <td className="px-3 md:px-6 py-4">
                      <div className="flex justify-center space-x-2 md:space-x-4">
                        <button className="px-2 md:px-4 py-1 md:py-2 text-sm md:text-base bg-[#23c493] rounded-lg hover:bg-[#239a76]"
                        onClick={()=> handleEditButton(user)}
                        >
                          Edit
                        </button>
                        <button className="px-2 md:px-4 py-1 md:py-2 text-sm md:text-base bg-red-600 rounded-lg hover:bg-red-700"
                        onClick={()=>handleDeleteUser(user._id)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {isModalOpen && selectedUser && (
    <div
        className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
        onClick={closeModal}
    >
        <div
            className="bg-[#222222] rounded-lg shadow-xl w-full max-w-md relative"
            onClick={(e) => e.stopPropagation()}
        >
            {/* Add close icon */}
            <button 
                onClick={closeModal} 
                className="absolute top-4 right-4 text-white text-2xl hover:text-[#23c493]"
            >
                ×
            </button>
            <EditUserPage 
                user={selectedUser} 
                onClose={closeModal}
                onUpdateUser={handleUpdateUser}
            />
        </div>
    </div>
)}
          {isModalAddOpen && selectedUser && (
    <div
        className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
        onClick={closeModal}
    >
        <div
            className="bg-[#222222] rounded-lg shadow-xl w-full max-w-md relative"
            onClick={(e) => e.stopPropagation()}
        >
            {/* Add close icon */}
            <button 
                onClick={closeModal} 
                className="absolute top-4 right-4 text-white text-2xl hover:text-[#23c493]"
            >
                ×
            </button>
            <AddUsarPage
                onClose={closeModal}
                onUpdateUser={handleUpdateUser}
            />
        </div>
    </div>
)}


          <div className="flex justify-between items-center mt-4 px-4">
          <button
            className="px-4 py-2 bg-[#23c493] text-white rounded-full hover:bg-[#e9cd70] disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage <= 1}
          >
            Previous
          </button>
          
          <div className="flex space-x-2">
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index}
                className={`px-3 py-2 rounded-full ${
                  currentPage === index + 1 
                    ? 'bg-[#23c493] text-white' 
                    : 'bg-gray-600 text-white hover:bg-[#e9cd70]'
                }`}
                onClick={() => handlePageChange(index + 1)}
              >
                {index + 1}
              </button>
            ))}
          </div>
          
          <button
            className="px-4 py-2 bg-[#23c493] text-white rounded-full hover:bg-[#e9cd70] disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage >= totalPages}
          >
            Next
          </button>
        </div>
        </div>
      </div>
    </div>
  );
};

export default AdminNavbar;