
import axios from "axios"
import Swal from "sweetalert2";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import './Login.css';
import Cookies from 'js-cookie';
import Navbar from "../Navbar/Navbar";
import { useDispatch } from "react-redux";
import { setUser } from "../../redux/slice/authSlice";


interface PayloadType {
    name : string,
    email : string,
    password : string
}

interface ErrorType {
    name : string,
    email : string,
    password  :string
}

const Login = () => {
    const [signState , setSignState] = useState("Sign In")
    const [showPassword , setShowPassword] = useState(false);
    const [name ,SetName] = useState("");
    const [email , SetEmail] = useState("");
    const [password, SetPassword] = useState("");
    const [error, setError] = useState<Partial<ErrorType>>({});
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const toggleEyeIcon = () => setShowPassword(!showPassword);

    const Validation = () =>{

        const newErrors: Partial<ErrorType> = {};

        if(signState === 'Sign Up'){
            if(name.trim().length  < 3 || !/^[A-Za-z\s]+$/.test(name)){
                newErrors.name = "Name must be at least 3 characters long and contain only alphabets."
            }
        }
        if(!/^\S+@\S+\.\S+$/.test(email)){
            newErrors.email = "Please enter a valid email address"
        }
        if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password)){
            newErrors.password = 'Password must be at least 8 characters long, include one uppercase, one lowercase, one number, and one special character'
        }
        setError(newErrors)
        return Object.keys(newErrors).length === 0
    }
    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!Validation()) return;
    
        try {
            const payload: PayloadType = signState === "Sign Up" 
                ? { name, email, password }
                : { name: "", email, password };
    
            const url = signState === "Sign In" 
                ? 'http://localhost:5000/api/auth/login' 
                : 'http://localhost:5000/api/auth/register';
    
            const response = await axios.post(url, payload);

            console.log('This is the responce data ',response.data)
    
            if (response.status === 200) {

              
                // Set cookies
                Cookies.set('token', response.data.token, { 
                    expires: 7, 
                    secure: true, 
                    sameSite: 'Strict' 
                });
                Cookies.set('email', email, { 
                    expires: 7, 
                    secure: true, 
                    sameSite: 'Strict' 
                });
    
                dispatch(setUser({ email: email }));
    
                // Success message
                Swal.fire({
                    icon: 'success',
                    title: signState === "Sign In" ? "Logged In Successfully!" : "Registered Successfully!",
                    text: 'You will be redirected to your profile page.',
                    timer: 2000,
                    showConfirmButton: false,
                    customClass: { popup: 'custom-swal' }
                });
    
                // Redirect after delay
                setTimeout(() => {
                    navigate(response.data.user.isAdmin ? '/admin' : '/home');
                }, 2000);
    
            }
        } catch (error) {
            console.error("Form submission error:", error);
    
            if (axios.isAxiosError(error)) {
                // Handle axios errors with response
                if (error.response?.data) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Authentication Error',
                        text: error.response.data.message,
                        customClass: { popup: 'custom-swal' }
                    });
                } 
                // Handle axios errors without response
                else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Connection Error',
                        text: 'Unable to connect to the server. Please check your internet connection.',
                        customClass: { popup: 'custom-swal' }
                    });
                }
            } 
            // Handle non-axios errors
            else {
                Swal.fire({
                    icon: 'error',
                    title: 'Unexpected Error',
                    text: 'An unexpected error occurred. Please try again.',
                    customClass: { popup: 'custom-swal' }
                });
            }
        }
    };
    
    return (
        <div>
          <Navbar />
          <form onSubmit={handleFormSubmit}>
            <div className="flex justify-center items-center p-4 mt-12 sm:mt-12 md:mt-0 sm:p-8 md:p-[57px]">
              <div className="log_Page flex flex-col w-full sm:w-[420px] md:w-[450px] bg-[#222222] h-auto sm:h-[450px] lg:h-auto p-6 sm:p-8 items-center rounded-[6px]">
                <h1 className="text-[30px] sm:text-[40px] md:text-[39px] font-extrabold mb-6 sm:mb-7">
                  {signState}
                </h1>
      
                {signState === 'Sign Up' && (
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
                      onChange={(e) => SetName(e.target.value)}
                      type="name"
                      name="name"
                      placeholder="Your Name"
                    />
                    {error.name && <p className="text-red-500 text-sm mt-1">{error.name}</p>}
                  </div>
                )}
      
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
                    onChange={(e) => SetEmail(e.target.value)}
                    type="email"
                    name="email"
                    placeholder="Email"
                  />
                  {error.email && <p className="text-red-500 text-sm mt-1">{error.email}</p>}
                </div>
      
                <div className="relative w-full sm:w-[320px] mb-6">
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
                    value={password}
                    onChange={(e) => SetPassword(e.target.value)}
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    placeholder="Password"
                  />
                  <button
                    onClick={toggleEyeIcon}
                    type="button"
                    className="absolute right-3 top-3 text-gray-500 focus:outline-none"
                  >
                    {showPassword ? <i className="fas fa-eye"></i> : <i className="fas fa-eye-slash"></i>}
                  </button>
                  {error.password && <p className="text-red-500 text-sm mt-1">{error.password}</p>}
                </div>
      
                <div className="button mt-1">
                  <button
                    className="text-[16px] gap-4 sm:gap-4 sm:text-[18px] font-semibold border-none w-full sm:w-[320px] rounded-[4px] p-4 flex justify-between items-center"
                    style={{ backgroundImage: 'linear-gradient(to right, #23c493, #e9cd70)', color: 'white' }}
                  >
                    {signState} to Your Account
                    <i className="fas fa-arrow-right text-black"></i>
                  </button>
                </div>
      
                <div className="form_switch text-[#c1c4bd] text-[14px] cursor-pointer mt-4 sm:mt-6">
                  {signState === 'Sign In' ? (
                    <p onClick={() => setSignState('Sign Up')} className="mr-12">
                      New to Rizo ?{' '}
                      <span className="text-[17px] text-white font-serif hover:text-[#23c493]">
                        Sign Up Now
                      </span>
                    </p>
                  ) : (
                    <p>
                      Already have an account?{' '}
                      <span onClick={() => setSignState('Sign In')} className="text-[17px] text-white font-serif hover:text-[#23c493]">
                        Sign In Now
                      </span>
                    </p>
                  )}
                </div>
              </div>
            </div>
          </form>
        </div>
      );    
}

export default Login



