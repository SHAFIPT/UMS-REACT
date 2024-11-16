import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import Swal from 'sweetalert2';
import axios from 'axios';
import './DashBord.css';

interface UserData {
  email: string;
  name: string;
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

        console.log("dash bord data",response.data.user)

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

  }

  // Handle logout functionality
  const handleLogout = () => {
    Cookies.remove('email');
    Cookies.remove('token');
    Swal.fire({
      icon: 'success',
      title: 'Logged Out',
      text: 'You have successfully logged out.',
    });
    navigate('/');
  };

  // Fetch user data on component mount
  useEffect(() => {
    fetchUserData();
  }, []);

  return (
    <div>
      <div className="wrapper flex justify-center items-center p-8 relative">
        <button
          onClick={handleLogout}
          className="absolute top-4 right-28 text-white bg-gradient-to-r from-[#23c493] to-[#e9cd70] px-6 py-3 rounded-full hover:bg-[#1aab6e] font-bold text-[18px]"
        >
          LogOut
        </button>
        <div className="profile relative flex justify-center items-center bg-white w-[400px] h-[400px] mt-14 bg-cover cursor-pointer">
          <div className="overLay w-[100%] h-[100%] rounded-[1px] cursor-pointer opacity-0">
            <div className="about flex flex-col  h-full w-full p-4 ">
              <h4 className="text-center  ">{user?.name || 'User'}</h4>
              <h4 className="text-center ">{user?.email || 'User'}</h4>
              <div className='flex flex-row justify-between mt-60'>
  <span
    onClick={handleEditPage}
    className="span p-4 font-semibold text-[12px] rounded-[13px] self-center mt-auto bg-gradient-to-r from-[#23c493] to-[#e9cd70] text-white cursor-pointer border-2 border-[#23c493]"
  >
    Edit Profile
  </span>
  <span
    onClick={handleImageEditPage}
    className="span p-4 font-semibold text-[12px] rounded-[13px] self-center mt-auto bg-gradient-to-r from-[#23c493] to-[#e9cd70] text-white cursor-pointer border-2 border-[#23c493]"
  >
    Edit Image
  </span>
</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashBoard;