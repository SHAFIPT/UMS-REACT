import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import '../auth/Login.css';
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import Navbar from "../Navbar/Navbar";
import { Link } from "react-router-dom";

const EditProfile = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [userId, setUserId] = useState<string | null>(null);
  const [error, setError] = useState<Partial<{ name: string; email: string }>>({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const storedEmail = Cookies.get("email");
        const token = Cookies.get("token");

        if (storedEmail && token) {
          const response = await axios.post(
            'http://localhost:5000/api/auth/getUser',
            { email: storedEmail },
            { headers: { 'Authorization': `Bearer ${token}` } }
          );

          const user = response.data.user;

          if (user) {
            setUserId(user._id);
            setName(user.name || "");
            setEmail(user.email || "");
          } else {
            Swal.fire({
              icon: 'error',
              title: 'No User Found',
              text: 'We could not find the user with this email.',
              customClass: { popup: 'custom-swal' }
            });
          }
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Email Not Found',
            text: 'No email was found in your cookies.',
            customClass: { popup: 'custom-swal' }
          });
          navigate('/');
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'There was an error while fetching your data. Please try again later.',
          customClass: { popup: 'custom-swal' }
        });
      }
    };

    fetchUserData();
  }, [navigate]);

  const validate = () => {
    const newErrors: Partial<{ name: string; email: string }> = {};

    if (name.trim().length < 3 || !/^[A-Za-z\s]+$/.test(name)) {
      newErrors.name = "Name must be at least 3 characters long and contain only alphabets.";
    }

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      newErrors.email = "Please enter a valid email address";
    }

    setError(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FocusEvent) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      const storedEmail = Cookies.get('email');
      const token = Cookies.get('token');

      if (storedEmail && token) {
        const response = await axios.patch(
          'http://localhost:5000/api/auth/updateUser',
          { id: userId, name, email },
          { headers: { 'Authorization': `Bearer ${token}` } }
        );

        if (response.data.success) {
          Cookies.set('email', email);

          Swal.fire({
            icon: 'success',
            title: 'Profile Updated',
            text: 'Your profile has been successfully updated.',
            customClass: { popup: 'custom-swal' }
          });
          navigate('/home');
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: response.data.message || 'An error occurred while updating the profile.',
            customClass: { popup: 'custom-swal' }
          });
        }
      }
    } catch (error) {
      console.error(error)
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Something went wrong. Please try again.',
        customClass: { popup: 'custom-swal' }
      });
    }
  };

  return (
    <div>
      <Navbar/>
      <form onSubmit={handleSubmit}>
        <div className="flex justify-center items-center p-4 mt-12 sm:mt-12 md:mt-0 sm:p-8 md:p-[57px]">
          <div className="log_Page flex flex-col w-full sm:w-[420px] md:w-[450px] bg-[#222222] h-auto sm:h-[450px] lg:h-auto p-6 sm:p-8 items-center rounded-[6px]">
            <h1 className="text-[30px] sm:text-[40px] md:text-[39px] font-extrabold mb-6 sm:mb-7 bg-gradient-to-r from-[#23c493] to-[#e9cd70] text-transparent bg-clip-text">Edit Profile</h1>

            <div className="w-full sm:w-[320px] mb-6">
              <input
                className="p-3 w-full bg-black text-[14px] sm:text-[17px] outline-none"
                style={{
                  fontFamily: 'serif',
                  fontWeight: '600',
                  wordSpacing: '4px',
                  border: '3px solid transparent',
                  borderImage: 'linear-gradient(to right, #23c493, #e9cd70) 1',
                  borderRadius: '12px',
                }}
                value={name}
                onChange={(e) => setName(e.target.value)}
                type="text"
                name="name"
                placeholder="Your Name"
              />
              {error.name && <p className="text-red-500 text-sm mt-1">{error.name}</p>}
            </div>

            <div className="w-full sm:w-[320px] mb-6">
              <input
                className="p-3 w-full bg-black text-[14px] sm:text-[17px] outline-none"
                style={{
                  fontFamily: 'serif',
                  fontWeight: '600',
                  wordSpacing: '4px',
                  border: '3px solid transparent',
                  borderImage: 'linear-gradient(to right, #23c493, #e9cd70) 1',
                  borderRadius: '12px',
                }}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                name="email"
                placeholder="Email"
              />
              {error.email && <p className="text-red-500 text-sm mt-1">{error.email}</p>}
            </div>
            <div className="button mb-2">
                  <Link to={"/change-password"}>
                    <button 
                          
                          className="text-[16px] gap-4 sm:gap-4 sm:text-[18px] font-semibold border-none w-full sm:w-[320px]  rounded-[4px] p-4 flex justify-between items-center"
                          style={{backgroundImage: 'linear-gradient(to right, #23c493, #e9cd70)', color: 'white'}}
                      >
                          Chang Password
                          <i className="fas fa-arrow-right text-black"></i> 
                      </button>
                  </Link>    
                </div>   

            <div className="button mt-1">
              <button
                className="text-[16px] gap-4 sm:gap-4 sm:text-[18px] font-semibold border-none w-full sm:w-[320px] rounded-[4px] p-4 flex justify-between items-center"
                style={{ backgroundImage: 'linear-gradient(to right, #23c493, #e9cd70)', color: 'white' }}
              >
                Update Profile
                <i className="fas fa-arrow-right text-black"></i>
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default EditProfile;
