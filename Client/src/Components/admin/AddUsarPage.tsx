import React, { useState } from "react";
import Swal from "sweetalert2";
import Cookies from "js-cookie";
import axios from "axios";

interface User {
    name: string;
    image: string;
    email: string;
    isAdmin: boolean;
    password : string
}

type EditUserPageProps = {
    onClose: () => void;
    onUpdateUser: (updatedUser: User) => void; // Added onUpdateUser to props type
  };

const AddUsarPage = ({onClose , onUpdateUser} : EditUserPageProps) => {

    const [name ,setName] = useState('')
    const [email ,setEmail] = useState('')
    const [image , setImage] = useState('')
    const [password , setPassword] = useState('')
    const [isAdmin , setIsAdmin] = useState(false)
    const [showPassword, setShowPassword] = useState(false);
    const [errors , setErrors] = useState({
        name : '',
        email : '',
        password : '',
        image : '',
    })

    const toggleEyeIcon = () => setShowPassword(!showPassword)

    const validateName = (value: string) => {
        if (!value.trim()) return "Name is required.";
        if (value.length < 3) return "Name must be at least 3 characters.";
        return "";
      };
    
      const validateEmail = (value: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!value.trim()) return "Email is required.";
        if (!emailRegex.test(value)) return "Please enter a valid email.";
        return "";
      };
    
      const validatePassword = (value: string) => {
        const passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])(?=.*[a-zA-Z]).{8,}$/;
        if (!value.trim()) return "Password is required.";
        if (!passwordRegex.test(value))
          return "Password must be at least 8 characters, include a number and a special character.";
        return "";
      };
    
      const validateImage = (value: string) => {
        if (!value.trim()) return "Profile image is required.";
        return "";
      };



    const handleFileChange  = (e : React.ChangeEvent<HTMLInputElement>) : void => {
        const file = e.target.files  ? e.target.files[0] : null ;
        if(file && file.type.startsWith('image')){
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                setImage(reader.result as string);
                setErrors((prev => ({...prev ,image :''})));
            }
            reader.onerror = (err) => console.error("Error reader file",err)
        }else{
            setErrors((prev) => ({...prev, image :'Invalid file type. Please upload an image.'}))
        }
    };


    const handleSubmit = async (e : React.FormEvent) => {
        e.preventDefault()
        const token = Cookies.get("token")

        const validationErrors = {
            name : validateName(name),
            email : validateEmail(email),
            password : validatePassword(password),
            image : validateImage(image)
        }

        setErrors(validationErrors);

        if(Object.values(validationErrors).some((err)=> err))return;

        try {

            const UserData  : User = {name , email ,password ,isAdmin ,image} 
            const response  =  await axios.post(
                'http://localhost:5000/api/admin/add-User',
                UserData, { headers: { Authorization: `Bearer ${token}` } }
            )

            if (response.status === 200) {
                onUpdateUser(UserData); 
                onClose(); // Close the modal on successful response
                Swal.fire({
                    icon: 'success',
                    title: 'Success!',
                    text: response.data.message,
                    customClass: { popup: 'custom-swal' }
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: response.data.message || 'An error occurred while updating the profile.',
                    customClass: { popup: 'custom-swal' }
                });
            }
            
        } catch (error : any) {
            console.error("Error during Add user Submission :",error)
            Swal.fire({
                icon : 'error',
                title : 'Error',
                text : error.response?.data?.message || 'An unexpedted error occurred!',
                customClass: { popup: 'custom-swal' }
            })
        }

    }


    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
        >
            <div 
                className="bg-[#222222] rounded-lg shadow-xl w-full max-w-md p-6 mx-4 relative"
                onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
            >
                <button
                    className="absolute top-2 right-2 text-white hover:text-gray-300 transition-colors"
                    onClick={onClose}
                >
                    <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor" 
                        className="w-6 h-6"
                        
                    >
                        <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth={2} 
                            d="M6 18L18 6M6 6l12 12"
                        />
                    </svg>
                </button>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="flex justify-center mb-4">
                        <div className="w-40 h-40 bg-gray-300 rounded-full flex items-center justify-center overflow-hidden cursor-pointer" 
                        onClick={()=> document.getElementById('fileInput')?.click()}
                        >
                            <img 
                                src={image ? (image.trim() === '' ? '' : image) : ''} 
                                alt="Profile" 
                                className="w-full h-full object-cover"
                            />
                            <input type="file"
                            id='fileInput'
                            style={{display : 'none'}}
                            accept="image/*"
                            onChange={handleFileChange}
                            />
                            {errors.image && <p className="text-red-500 text-sm">{errors.image}</p>}
                        </div>
                    </div>
                    <div className="space-y-4">
                        <input 
                            type="text" 
                            placeholder="Enter your name" 
                            value={name}
                            onChange={(e) => {
                                setName(e.target.value);
                                setErrors((prev) => ({ ...prev, name: validateName(e.target.value) }));
                              }}
                            className="w-full px-4 py-4 border bg-black text-white rounded-md focus:outline-none"
                            style={{
                                fontFamily: 'serif',
                                fontWeight: '600',
                                wordSpacing: '4px',
                                border: '3px solid transparent',
                                borderImage: 'linear-gradient(to right, #23c493, #e9cd70) 1',
                                borderRadius: '12px',
                            }}
                        />
                         {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
                        <input 
                            type="email" 
                            placeholder="Enter your Email" 
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value);
                                setErrors((prev) => ({ ...prev, email: validateEmail(e.target.value) }));
                              }}
                            className="w-full px-4 py-4 border bg-black text-white rounded-md focus:outline-none"
                            style={{
                                fontFamily: 'serif',
                                fontWeight: '600',
                                wordSpacing: '4px',
                                border: '3px solid transparent',
                                borderImage: 'linear-gradient(to right, #23c493, #e9cd70) 1',
                                borderRadius: '12px',
                            }}
                        />
                        {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
                        <div className="relative">
    <input
        type={showPassword ? "text" : "password"} // Toggle visibility
        placeholder="Enter your password"
        value={password}
        onChange={(e) => {
            setPassword(e.target.value);
            setErrors((prev) => ({
                ...prev,
                password: validatePassword(e.target.value),
            }));
        }}
        className="w-full px-4 py-4 border bg-black text-white rounded-md focus:outline-none"
        style={{
            fontFamily: "serif",
            fontWeight: "600",
            wordSpacing: "4px",
            border: "3px solid transparent",
            borderImage: "linear-gradient(to right, #23c493, #e9cd70) 1",
            borderRadius: "12px",
        }}
    />
    <button
        onClick={toggleEyeIcon}
        type="button"
        className="absolute top-7 right-3 -translate-y-1/2 text-gray-500 focus:outline-none"
    >
        {showPassword ? (
            <i className="fas fa-eye"></i>
        ) : (
            <i className="fas fa-eye-slash"></i>
        )}
    </button>
    {errors.password && (
        <p className="text-red-500 text-sm">{errors.password}</p>
    )}
</div>
                        
                        <button 
                            type="submit" 
                            className="w-full text-white py-2 rounded-md hover:opacity-90 transition-opacity"
                            style={{ 
                                backgroundImage: 'linear-gradient(to right, #23c493, #e9cd70)', 
                                color: 'white' 
                            }}
                        >
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddUsarPage
