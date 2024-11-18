import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import Cookies from 'js-cookie';
import '../auth/Login.css'

interface User {
    _id : string
    name: string;
    image: string;
    email: string;
    isAdmin: boolean;
}

type EditUserPageProps = {
    user: User;
    onClose: () => void;
    onUpdateUser: (updatedUser: User) => void; // Added onUpdateUser to props type
  };
  

  const EditUserPage = ({ user, onClose, onUpdateUser }: EditUserPageProps) =>{
    const [isModalOpen, setIsModalOpen] = useState(true);
    const [name , setName] = useState('')
    const [email , setEmail] = useState('')
    const [image , setImage] = useState('')
    const [isAdmin , setIsAdmin] = useState(false)

    useEffect(()=>{
        if(user){
            setName(user.name)
            setEmail(user.email)
            setImage(user.image || '')
            setIsAdmin(user.isAdmin)
        }else{
            setName('')
            setEmail('')
            setImage('')
            setIsAdmin(false)
        }
    },[user])

    const closeModal = () => {
        setIsModalOpen(false);
    };

  
    const handleFileChange = (e : React.ChangeEvent<HTMLInputElement>) : void => {
        const file = e.target.files ? e.target.files[0] : null;
        if(file && file.type.startsWith('image')){
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                setImage(reader.result as string)
            }
            reader.onerror = (err) => console.error("Error reading file",err)
        }
    }


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
    
        const token = Cookies.get("token");
        try {
            const Userdata: User = { _id: user._id, name, email, image, isAdmin };
            const response = await axios.put(
                `http://localhost:5000/api/admin/update-Profile/${user._id}`,
                Userdata,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            // Display success or error message based on the response
            if (response.status === 200) {
                onUpdateUser(Userdata); 
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
        } catch (error: any) {
            console.error('Error during form submission:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.response?.data?.message || 'An unexpected error occurred!',
                customClass: { popup: 'custom-swal' }
            });
        }
    };

    // If modal is not open, return null
    if (!isModalOpen) return null;

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
                        </div>
                    </div>
                    <div className="space-y-4">
                        <input 
                            type="text" 
                            placeholder="Enter your name" 
                            value={name}
                            onChange={(e)=> setName(e.target.value)}
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
                        <input 
                            type="email" 
                            placeholder="Enter your Email" 
                            value={email}
                            onChange={(e)=> setEmail(e.target.value)}
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

export default EditUserPage;