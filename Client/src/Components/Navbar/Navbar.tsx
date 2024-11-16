import { useNavigate } from "react-router-dom";

const Navbar = () => {

  const navigate = useNavigate()
  const handleToNavigate = () => {
    navigate('/home')
  }

    return (
      <div>
        <div className="navBar w-full h-auto">
          {/* Title */}
          <h1
             
            className="text-[32px] sm:text-[40px] md:text-[48px] p-4 sm:p-6 font-bold bg-gradient-to-r from-[#23c493] to-[#e9cd70] text-transparent bg-clip-text "
            style={{
              backgroundSize: '40% 80%',
              backgroundPosition: 'center',
              fontFamily: 'serif'
            }}
          >
           <span onClick={handleToNavigate} className="cursor-pointer">R i z o</span> 
          </h1>
          
          {/* Gradient Line */}
          <div className="ml-4 sm:ml-7 mr-48 sm:mr-48  sm:w-[380px] h-[3px] bg-gradient-to-r from-[#23c493] to-[#e9cd70] mt-[-5px] sm:mt-[-10px]"></div>
        </div>
      </div>
    );
  };
  
  export default Navbar;