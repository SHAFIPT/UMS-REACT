import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

const Navbar = () => {

  const navigate = useNavigate()
  const handleToNavigate = () => {
    navigate('/home')
  }

  const handleLogout = () => {
    Cookies.remove('token');
    navigate('/')
  }

  const token = Cookies.get('token')

  return (
    <div className="relative">
      <div className="flex justify-between items-center px-4 sm:px-6">
        <div>
          {/* Title */}
          <h1
            className="text-[32px] sm:text-[40px] md:text-[48px] p-4 sm:p-6 font-bold bg-gradient-to-r from-[#23c493] to-[#e9cd70] text-transparent bg-clip-text"
            style={{
              backgroundSize: '40% 80%',
              backgroundPosition: 'center',
              fontFamily: 'serif'
            }}
          >
            <span onClick={handleToNavigate} className="cursor-pointer">R i z o</span>
          </h1>
          
          {/* Gradient Line */}
          <div className="w-[140px] sm:w-[280px] md:w-[380px] h-[3px] bg-gradient-to-r from-[#23c493] to-[#e9cd70] ml-4 sm:ml-7 -mt-1 sm:-mt-1"></div>

        </div>

        {/* Logout Button - Now responsive */}
        {token ? <button onClick={handleLogout} className="text-white bg-gradient-to-r from-[#23c493] to-[#e9cd70] px-4 sm:px-6 py-2 sm:py-3 rounded-full hover:bg-[#1aab6e] font-bold text-[14px] sm:text-[18px] mr-4 sm:mr-8">
          LogOut
        </button> : <></>}
        
      </div>
    </div>
  );
};

export default Navbar;