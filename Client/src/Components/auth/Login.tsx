
import axios from "axios"
import Swal from "sweetalert2";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import './Login.css';
import Cookies from 'js-cookie';
import Navbar from "../Navbar/Navbar";


interface PayloadType {
    name : string,
    email : string,
    password : string
}

const Login = () => {
    const [signState , setSignState] = useState("Sign In")
    const [showPassword , setShowPassword] = useState(false);
    const [name ,SetName] = useState("");
    const [email , SetEmail] = useState("");
    const [password, SetPassword] = useState("");
    const navigate = useNavigate()

    const toggleEyeIcon = () => {
        setShowPassword(!showPassword);
    }

    const handleFormSubmit = async (e) => {
        e.preventDefault();
  
        try {
            let payload : PayloadType;

            if(signState === "Sign Up"){
                payload = {name, email ,password}
            }else{
                payload = {name : "", email ,password}
            }

            console.log(name);
            console.log(email);
            console.log(password);
            console.log(payload)
            

            const url = signState === "Sign In" ? 'http://localhost:5000/api/auth/login' : 'http://localhost:5000/api/auth/register';



            const response = await axios.post(url ,payload)

            Cookies.set('token', response.data.token , {expires : 1 ,secure : true ,sameSite : 'Strict'})

           const getToken =  Cookies.get('token')

           console.log('Cookies token is :',getToken)

            console.log("this is response data :",response.data)

            Swal.fire({
                icon : 'success',
                title : signState === "Sign In" ? "Logged In Successfully!" : "Registered Successfully!",
                text : 'You will be redirected to your profile page.',
                timer : 2000,
                showConfirmButton :false,
                customClass: {
                    popup: 'custom-swal',
                }
            });
            // console.log(response.data.user.isAdmin); 
            setTimeout(()=> {
                navigate(response.data.user.isAdmin ? '/admin' : '/home');
            },2000)

        } catch (error) {
            console.error("Error during form submission...!",error)

            if(axios.isAxiosError(error) && error.response && error.response.data){
                Swal.fire({
                    icon : 'error',
                    title : 'Oops....',
                    text : error.response.data.message,
                    customClass: {
                        popup: 'custom-swal',
                    }
                });
            }else{
                Swal.fire({
                    icon : 'error',
                    title  :'Oops....',
                    text : 'Somthing went wrong . please try again.',
                    customClass: {
                        popup: 'custom-swal',
                    }
                })    
            }
        }
    }

    return (
        <div >
            <Navbar/>
            <form onSubmit={handleFormSubmit}>
            <div className=" flex justify-center items-center p-4 mt-12 sm:mt-12 md:mt-0 sm:p-8 md:p-[57px]">

                <div className="log_Page flex flex-col w-full sm:w-[420px] md:w-[450px] bg-[#222222] h-auto sm:h-[450px] lg:h-auto p-6 sm:p-8 items-center rounded-[6px]">
                    <h1 className="text-[30px] sm:text-[40px] md:text-[39px] font-extrabold mb-6 sm:mb-7">{signState}</h1>
                    {signState === 'Sign Up' ?
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
                    onChange={(e)=> SetName(e.target.value)} 
                    type="name" 
                    name="name" 
                    placeholder="Your Name"
                    /> : <></>}
                    
                    
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
                        onChange={(e)=> SetEmail(e.target.value)}  
                        type="email" 
                        name="email" 
                        placeholder="Email"
                    />

                    {/* Password Input */}
                <div className="relative w-full sm:w-[320px]">
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
                            value={password}
                            onChange={(e)=> SetPassword(e.target.value)}  
                            type={showPassword ? 'text' : 'password'} 
                            name="password" 
                            placeholder="Password"
                        />
                        <button onClick={toggleEyeIcon} type="button" className="absolute right-3 top-3 text-gray-500 focus:outline-none">{showPassword ? (
                            <i className="fas fa-eye"></i>
                        ): <i className="fas fa-eye-slash"></i>}</button>

                </div>
                    {/* Login Button */}
                    <div className="button mt-1">
                        <button 
                            className="text-[16px] gap-4 sm:gap-4 sm:text-[18px] font-semibold border-none w-full sm:w-[320px]  rounded-[4px] p-4 flex justify-between items-center"
                            style={{backgroundImage: 'linear-gradient(to right, #23c493, #e9cd70)', color: 'white'}}
                        >
                            {signState} to Your Account
                            <i className="fas fa-arrow-right text-black"></i> 
                        </button>
                    </div>
                    <div className="form_switch text-[#c1c4bd] mr-[80px] text-[14px] cursor-pointer">
                        {signState === 'Sign In' ? 
                            <p onClick={()=>setSignState('Sign Up')} className="mt-4 mr-12 ">New to Rizo ? <span className="text-[17px] text-white font-serif hover:text-[#23c493]" >Sign Up Now</span></p>
                        :  <p className="mt-2">Already have account? <span onClick={()=>setSignState('Sign In')} className="text-[17px] text-white font-serif hover:text-[#23c493]">Sign In Now</span></p>}
                    </div>
                </div>
                </div>
            </form>
        </div>
    )
}

export default Login
