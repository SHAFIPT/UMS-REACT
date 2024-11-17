import { useEffect, useState } from "react";
import Navbar from "../Navbar/Navbar";
import axios from "axios";
import Swal from "sweetalert2";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import myImage from '../../assets/myImage.jpg'
import '../auth/Login.css'

const EditProfileImage = () => {
  const [userId, setUserId] = useState<string | null>(null);
  const [image ,setImage] = useState<string>('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserDatas = async () => {
      try {
        const storedEmail = Cookies.get("email");
        const token = Cookies.get("token");
        if (storedEmail && token) {
          const response = await axios.post(
            "http://localhost:5000/api/auth/getUser",
            { email: storedEmail },
            { headers: { Authorization: `Bearer ${token}` } }
          );

          const user = response.data.user;
          if (user) {
            setUserId(user._id || '');
            setImage(user.image || '')
          } else {
            Swal.fire({
              icon: "error",
              title: "No User Found",
              text: "We could not find the user with this email.",
              customClass: { popup: "custom-swal" },
            });
          }
        } else {
          Swal.fire({
            icon: "error",
            title: "Email Not Found",
            text: "No email or token was found in your cookies.",
            customClass: { popup: "custom-swal" },
          });
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "There was an error while fetching your data. Please try again later.",
        });
      }
    };
    fetchUserDatas();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) : void => {
    const file = e.target.files ? e.target.files[0] : null;
    if(file && file.type.startsWith('image')){
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            setImage(reader.result as string)
        };
        reader.onerror = (err) => console.error('Error reading file ', err);
    }
  };

  const handleUpload = async () => {
    try {
      const token = Cookies.get("token");
      if (!token) throw new Error("Authentication token not found");
      if (!userId) throw new Error("User ID is missing");
  
      // Send the patch request
      const response = await axios.patch(
        "http://localhost:5000/api/auth/upload-profile-image",
        {
          id: userId,
          image,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include token for authorization
          },
        }
      );
  
      // Handle the server response
      if (response.status === 200) {
        Swal.fire({
          icon: "success",
          title: "Profile Image Updated",
          text: "Your profile image has been updated successfully!",
          customClass: {
            popup: 'custom-swal',
        }
        });
        navigate("/dashboard")
      } else {
        throw new Error(response.data.message || "Unexpected error occurred.");
      }
    } catch (error: any) {
      console.error("Error updating image:", error);
  
      // Handle known errors or fallback to a generic message
      Swal.fire({
        icon: "error",
        title: "Error",
        text:
          error.response?.data?.message ||
          "There was an error while updating the profile image. Please try again later.",
      });
    }
  };

  return (
    <div>
      <Navbar />
      <div className="wrapper flex justify-center items-center flex-col p-3 relative">
        {/* Profile Image Container */}
        <div
          className="profile relative flex justify-center items-center bg-white w-[400px] h-[400px] mt-14 cursor-pointer rounded-tr-[35px] border-[2px] border-[#04533b]"
          onClick={() => document.getElementById("fileInput")?.click()}
        >
          {/* Dark Gradient Overlay */}
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-tr from-black/70 to-transparent rounded-tr-[35px] z-10"></div>
  
          <img
            src={image ? (image.trim() === "" ? `${myImage}` : image) : `${myImage}`} // Display selected or fallback profile image
            alt="Profile"
            className="absolute top-0 left-0 w-full h-full object-cover rounded-tr-[35px] z-0"
          />
          
          <input
            type="file"
            style={{ display: "none" }}
            id="fileInput"
            accept="image/*"
            onChange={handleFileChange}
          />
        </div>
  
        {/* Button Below the Image */}
        <button
          onClick={handleUpload}
          className="mt-6 p-4 font-semibold text-[14px] rounded-[13px] bg-gradient-to-r from-[#23c493] to-[#e9cd70] text-white cursor-pointer border-2 border-[#23c493]"
        >
          Update Profile Image
        </button>
      </div>
      <div className="w-[140px] sm:w-[280px] md:w-[400px] h-[3px] bg-gradient-to-r from-[#23c493] to-[#e9cd70] ml-auto sm:ml-auto -mt-1 sm:-mt-1"></div>
    </div>
  );
};

export default EditProfileImage;
