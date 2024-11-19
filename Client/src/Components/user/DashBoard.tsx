import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import Swal from 'sweetalert2';
import axios from 'axios';
// import './DashBord.css';
import Navbar from '../Navbar/Navbar';

interface UserData {
  email: string;
  name: string;
  image : string
}

const DashBoard = () => {
  const [user, setUser] = useState<UserData | null>(null);
  const navigate = useNavigate();

  // Fetch user data from the backend
  const fetchUserData = async () => {
    try {
      const storedEmail = Cookies.get('email');
      const token = Cookies.get('token');

      if (storedEmail && token) {
        const response = await axios.post(
          'http://localhost:5000/api/auth/getUser',
          { email: storedEmail },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (response.status === 200) {
          setUser(response.data.user);
        } else {
          throw new Error('Failed to fetch user data');
        }
      } else {
        Swal.fire({
          icon: 'warning',
          title: 'Session Expired',
          text: 'Please log in again.',
        });
        navigate('/');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'There was an error fetching the user data. Please try again.',
      });
    }
  };

  // Handle edit profile navigation
  const handleEditPage = () => {
    navigate('/profile');
  };

  const handleImageEditPage = () => {
    navigate('/editImage')
  }



  // Fetch user data on component mount
  useEffect(() => {
    fetchUserData();
  }, []);

  return (
    <div>
      <Navbar />
      <div className="wrapper flex justify-center items-center p-4 sm:p-8 relative">
        <div className="profile relative flex justify-center items-center bg-white w-[300px]  sm:w-[400px] md:w-[400px] h-[300px] sm:h-[350px] md:h-[400px] mt-24 sm:mt-14 cursor-pointer rounded-tr-[35px] border-[2px] border-[#04533b]">
          {/* Image */}
          <img
            src={user?.image || "../../assets/myImage.jpg"}
            alt="Profile"
            className="absolute top-0 left-0 w-full h-full object-cover rounded-tr-[35px] z-0"
          />
          {/* Overlay */}
          <div className="overLay absolute top-0 left-0 w-full h-full bg-black/40 opacity-100 transition-opacity duration-1000 ease-in-out rounded-tr-[35px] hover:bg-black/50 z-10">
            {/* Content */}
            <div className="about absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center text-white opacity-0 transition-opacity duration-1000 ease-in-out hover:opacity-100 p-4 w-full">
              <h4 className="text-[16px] sm:text-[18px] md:text-[20px] font-bold">{user?.name || "User"}</h4>
              <h4 className="text-[16px] sm:text-[18px] md:text-[20px] font-bold">{user?.email || "User"}</h4>
              <div className="flex flex-col sm:flex-row justify-center sm:justify-between items-center mt-20 sm:mt-32 md:mt-40 space-y-4 sm:space-y-0 sm:space-x-4 w-full sm:w-[280px] md:w-[320px] mx-auto">
                <span
                  onClick={handleEditPage}
                  className="p-2 sm:p-3 md:p-4 w-[120px] font-semibold text-[14px] sm:text-[16px] md:text-[18px] rounded-[13px] bg-gradient-to-r from-[#23c493] to-[#e9cd70] text-white cursor-pointer border-[2px] border-[#23c493]"
                >
                  Edit Profile
                </span>
                <span
                  onClick={handleImageEditPage}
                  className="p-2 sm:p-3 md:p-4 w-[120px] font-semibold text-[14px] sm:text-[16px] md:text-[18px] rounded-[13px] bg-gradient-to-r from-[#23c493] to-[#e9cd70] text-white cursor-pointer border-[2px] border-[#23c493]"
                >
                  Edit Image
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="w-[140px] sm:w-[280px] md:w-[400px] h-[3px] bg-gradient-to-r from-[#23c493] to-[#e9cd70] ml-auto sm:ml-auto mt-24 sm:-mt-1"></div>
    </div>
  );
}
export default DashBoard;