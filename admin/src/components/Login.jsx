import React, { useState } from 'react';
import axios from 'axios'
import { backendUrl } from '../App';
import { toast } from 'react-toastify';

const Login = ({setToken}) => {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const onSubmitHandler =async (e)=>{
    try {
      e.preventDefault();
      const response = await axios.post(backendUrl + '/api/user/admin', {email, password});
      if (response.data.success) {
        setToken(response.data.token)
      }else{
        toast.error(response.data.message);
      }
      
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  }

  return (
   <div className='flex flex-col items-center w-[90%] mt-45 sm:mt-40 sm:max-w-96 m-auto gap-4 text-gray-800 pb-15 font-primary font-medium'>
      <div className='w-full'>
      <div className='inline-flex items-center gap-2'>
        <p className='prata-regular text-xl sm:text-3xl'>Temple Admin</p>
        <hr className='border-none h-[3px] mt-2 w-8 bg-gray-800' />
      </div>
        <form onSubmit={onSubmitHandler}>
          <div className='mt-6'>
            <p>Email Address</p>
            <input onChange={(e)=>setEmail(e.target.value)} value={email} type="email" placeholder='youremail@gmail.com' className='border mt-2 px-3 py-3 text-md outline-0 w-full' required />
          </div>
          <div className='mt-3'>
            <p>Password</p>
            <input onChange={(e)=>setPassword(e.target.value)} value={password} type="password" placeholder='Password' className='border mt-2 px-3 py-3 text-md outline-0 w-full' required />
          </div>
          <p></p>

          <button className='mt-6 px-4 py-3 text-md outline-0 w-full bg-amber-400'>Login</button>
        </form>
      </div>
   </div>
  );
};

export default Login;