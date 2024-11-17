import { useState, useEffect } from "react";
import Navbar from "../Navbar/Navbar";
import Swal from "sweetalert2";
import axios from "axios";
import { useSelector } from "react-redux";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import '../user/DashBord.css'

interface UserState {
    email: string;
}

interface RootState {
    user: UserState;
}

const ChangePassword = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState(""); // To confirm new password
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // For confirm password visibility

  const navigate = useNavigate()

  const email = useSelector((state: RootState) => state.user.email);

  console.log("This is redux email data", email);

  const toggleCurrentPasswordVisibility = () => {
    setShowCurrentPassword(!showCurrentPassword);
  };

  const toggleNewPasswordVisibility = () => {
    setShowNewPassword(!showNewPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();

    // Validation for current and new passwords
    if (!currentPassword || !newPassword || !confirmNewPassword) {
      Swal.fire({
        icon: 'warning',
        title: 'Incomplete Field',
        text: 'Please fill all the fields!',
        customClass: {
            popup: 'custom-swal',
        }
      });
      return;
    }

    if (newPassword !== confirmNewPassword) {
      Swal.fire({
        icon: 'warning',
        title: 'Password Mismatch',
        text: 'New password and confirm password do not match!',
        customClass: {
            popup: 'custom-swal',
        }
      });
      return;
    }

    if (newPassword.length < 8) { // Optional: Enforcing a minimum length for the new password
      Swal.fire({
        icon: 'warning',
        title: 'Weak Password',
        text: 'New password must be at least 8 characters long.',
        customClass: {
            popup: 'custom-swal',
        }
      });
      return;
    }

    const token = Cookies.get('token');
    console.log("Stored token:", token);

    try {
      if (token) {
        // Make a POST request to change the password, including the token in the Authorization header
        const response = await axios.post(
          "http://localhost:5000/api/auth/changePassword",
          { email, currentPassword, newPassword },
          {
            headers: {
              'Authorization': `Bearer ${token}`, // Include the token in the request header
            },
          }
        );

        console.log(response.data);

        Swal.fire({
          icon: 'success',
          title: 'Password Updated',
          text: 'Your password has been successfully updated!',
          customClass: {
            popup: 'custom-swal',
        }
        })

        navigate('/profile')
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Token Missing',
          text: 'No authorization token found. Please login again.',
          customClass: {
            popup: 'custom-swal',
        }
        });
      }
    } catch (error: any) {
      console.log(error);
      // Handle errors from the response properly
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.response?.data?.message || 'An error occurred while updating your password!',
        customClass: {
            popup: 'custom-swal',
        }
      });
    }
  };

  useEffect(() => {
    const token = Cookies.get("token");
  
    if (!token) {
      Swal.fire({
        icon: "warning",
        title: "Session Expired",
        text: "You need to log in again.",
        customClass: {
            popup: 'custom-swal',
        }
      });
      navigate("/");
    }
  }, []);

  return (
    <div>
      <Navbar />
      <form >
        <div className="profile_editPage flex justify-center h-auto py-12">
            <div className="userProfilepage flex justify-center bg-[#222222] items-center w-[500px] rounded-[12px]">
            <div className="imageUplaod flex flex-col items-center w-[300px] gap-2">
                <div className="imageUpload w-full h-full flex justify-center items-center mt-9">
                <p className="text-[23px] font-bold p-5 bg-gradient-to-r from-[#23c493] to-[#e9cd70] text-transparent bg-clip-text">
                    Change Password
                </p>
                </div>
                
                {/* Current Password Input */}
                <div className="relative w-full sm:w-[320px]">
                <input
                    className="p-3 mb-6 w-full bg-black text-[14px] sm:text-[17px] outline-none"
                    style={{
                    fontFamily: "serif",
                    fontWeight: "600",
                    wordSpacing: "4px",
                    border: "3px solid transparent",
                    borderImage: "linear-gradient(to right, #23c493, #e9cd70) 1",
                    borderRadius: "12px",
                    }}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    type={showCurrentPassword ? "text" : "password"}
                    placeholder="Current Password"
                />
                <button
                    onClick={toggleCurrentPasswordVisibility}
                    type="button"
                    className="absolute right-3 top-3 text-gray-500 focus:outline-none"
                >
                    {showCurrentPassword ? (
                    <i className="fas fa-eye"></i>
                    ) : (
                    <i className="fas fa-eye-slash"></i>
                    )}
                </button>
                </div>

                {/* New Password Input */}
                <div className="relative w-full sm:w-[320px]">
                <input
                    className="p-3 mb-6 w-full bg-black text-[14px] sm:text-[17px] outline-none"
                    style={{
                    fontFamily: "serif",
                    fontWeight: "600",
                    wordSpacing: "4px",
                    border: "3px solid transparent",
                    borderImage: "linear-gradient(to right, #23c493, #e9cd70) 1",
                    borderRadius: "12px",
                    }}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    type={showNewPassword ? "text" : "password"}
                    placeholder="New Password"
                />
                <button
                    onClick={toggleNewPasswordVisibility}
                    type="button"
                    className="absolute right-3 top-3 text-gray-500 focus:outline-none"
                >
                    {showNewPassword ? (
                    <i className="fas fa-eye"></i>
                    ) : (
                    <i className="fas fa-eye-slash"></i>
                    )}
                </button>
                </div>

                {/* Confirm New Password Input */}
                <div className="relative w-full sm:w-[320px]">
                <input
                    className="p-3 mb-6 w-full bg-black text-[14px] sm:text-[17px] outline-none"
                    style={{
                    fontFamily: "serif",
                    fontWeight: "600",
                    wordSpacing: "4px",
                    border: "3px solid transparent",
                    borderImage: "linear-gradient(to right, #23c493, #e9cd70) 1",
                    borderRadius: "12px",
                    }}
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm New Password"
                />
                <button
                    onClick={toggleConfirmPasswordVisibility}
                    type="button"
                    className="absolute right-3 top-3 text-gray-500 focus:outline-none"
                >
                    {showConfirmPassword ? (
                    <i className="fas fa-eye"></i>
                    ) : (
                    <i className="fas fa-eye-slash"></i>
                    )}
                </button>
                </div>

                {/* Update Password Button */}
                <button
                className="text-[16px] mb-14 gap-4 sm:gap-4 sm:text-[18px] font-semibold border-none w-full sm:w-[320px] rounded-[4px] p-4 mt-2"
                style={{
                    backgroundImage: "linear-gradient(to right, #23c493, #e9cd70)",
                    color: "white",
                }}
                onClick={handlePasswordChange}
                >
                Update Password
                </button>
            </div>
            </div>
        </div>
      </form>
    </div>
  );
};

export default ChangePassword;