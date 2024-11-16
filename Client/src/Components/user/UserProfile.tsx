import React, { useEffect, useState } from "react"
import axios from "axios";
import Swal from "sweetalert2";
import '../auth/Login.css'
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

const UserProfile = () => {

  const [name , setName] = useState("")
  const [email , setEmail] = useState("")
  const [userId, setUserId] = useState<string | null>(null);
  const navgate = useNavigate()

  useEffect(()=> {
    const fetchUserData = async () => {
      try {
        const storedEmail = Cookies.get("email");
        const token = Cookies.get("token")

        console.log("Stored email:", storedEmail);
        console.log("Stored token:", token);

        if(storedEmail && token){
          const responce = await axios.post(
            'http://localhost:5000/api/auth/getUser',{email : storedEmail},{headers :{'Authorization' : `Bearer ${token}`}})

          // console.log("this is responce :",responce.data.user)

          const user = responce.data.user;
          
          console.log("This is my password :",user.password)

          if(user){
            setUserId(user._id);
            setName(user.name || "");
            setEmail(user.email || "");

          }else{
            Swal.fire({
              icon :'error',
              title : 'No User Found',
              text : 'We Could not find the user with this email.',
              customClass: {
                popup: 'custom-swal',
            }
            });
          }
        }else{
          Swal.fire({
            icon : 'error',
            title : 'Email Not Found',
            text : 'No email was found in your cookies.',
            customClass: {
              popup: 'custom-swal',
          }
          })
          navgate('/')
        }
      } catch (error) {
        // Handle the error and show a message
        console.error("Error fetching user data:", error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'There was an error while fetching your data. Please try again later.',
        });
      }
    };

    fetchUserData();
  }, []);

  const handleSubmit = async (e: React.FocusEvent) => {
    e.preventDefault();
    try {
      const storedEmail = Cookies.get('email');
      const token = Cookies.get('token');
      if(storedEmail && token){
        console.log("this is user data",userId)
        const response = await axios.patch(
          'http://localhost:5000/api/auth/updateUser',
          {
            id : userId,
            name,
            email,
          },
          {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          }
        );

      // If successful, show a success message
      if (response.data.success) {
        Swal.fire({
          icon: 'success',
          title: 'Profile Updated',
          text: 'Your profile has been successfully updated.',
          customClass: {
            popup: 'custom-swal',
          },
        });
        navgate('/home')
      } else {
        // Handle server-side error
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: response.data.message || 'An error occurred while updating the profile.',
        });
      }
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Authentication Error',
        text: 'No email or token found in your cookies.',
      });
    }
  } catch (error) {
    console.error("Error submitting updated profile:", error);
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'There was an error while updating your profile. Please try again later.',
    });
  }
};

    return (
      <div>
        <div className="profile_editPage flex justify-center h-auto py-12">
          <div className="userProfilepage  flex justify-center bg-[#222222] items-center w-[500px] rounded-[12px]">
            <div className="imageUplaod flex flex-col items-center w-[300px] gap-2">
              <div className="imageUpload w-full h-full flex justify-center items-center mt-9  ">
                <p className="text-[23px] font-bold p-5  bg-gradient-to-r from-[#23c493] to-[#e9cd70] text-transparent bg-clip-text">EDIT PROFILE</p>
              </div>
                <input 
                   className="p-3 mb-6 w-full sm:w-[320px] bg-black text-[14px] sm:text-[17px] outline-none"
                   style={{
                       fontFamily: 'serif',
                       fontWeight: '600',
                       wordSpacing: '4px',
                       border: '3px solid transparent', // Set the border to transparent
                       borderImage: 'linear-gradient(to right, #23c493, #e9cd70) 1', // Gradient for the border
                       borderRadius: '12px', // Apply border radius to the element
                   }}
                   value={name}
                   onChange={(e)=> setName(e.target.value)}  
                   type="name" 
                   name="name" 
                   placeholder="Edit your name"
               />
               <input 
                   className="p-3 mb-6 w-full sm:w-[320px] bg-black text-[14px] sm:text-[17px] outline-none"
                   style={{
                       fontFamily: 'serif',
                       fontWeight: '600',
                       wordSpacing: '4px',
                       border: '3px solid transparent', // Set the border to transparent
                       borderImage: 'linear-gradient(to right, #23c493, #e9cd70) 1', // Gradient for the border
                       borderRadius: '12px', // Apply border radius to the element
                   }}
                   value={email}
                   onChange={(e)=> setEmail(e.target.value)}  
                   type="email" 
                   name="email" 
                   placeholder="Edit Your Email"
               />
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
                <div className="button mb-9">
                      <button 
                        onClick={handleSubmit}
                        className="text-[16px] gap-4 sm:gap-4 sm:text-[18px] font-semibold border-none w-full sm:w-[320px]  rounded-[4px] p-4 flex justify-between items-center"
                        style={{backgroundImage: 'linear-gradient(to right, #23c493, #e9cd70)', color: 'white'}}
                    >
                        Submit Your Edited Profile
                        <i className="fas fa-arrow-right text-black"></i> 
                    </button>    
                </div>      
            </div>
          </div>
        </div>
      </div>
    )
  }
  
export default UserProfile
  