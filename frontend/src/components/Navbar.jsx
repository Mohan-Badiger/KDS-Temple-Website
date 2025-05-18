import React, { useContext, useEffect, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import menu_bar from '../assets/menu_bar.png'
import cancel_bar from '../assets/cancel_bar.png'
import { TempleContext } from '../context/TempleContext'
import { toast } from 'react-toastify'

const Navbar = () => {

  const AUTO_LOGOUT_TIME = 15 * 60 * 1000; 

  const [visible , setVisible] = useState(false);
  const {navigate, token, setToken} = useContext(TempleContext);

  // useEffect(() => {
  //   if (token) {
  //     // Start auto logout timer
  //     const logoutTimer = setTimeout(() => {
  //       logout();
  //     }, AUTO_LOGOUT_TIME);

  //     // Cleanup function to reset timer when component unmounts
  //     return () => clearTimeout(logoutTimer);
  //   }
  // }, [token]); 

  const logout = ()=>{
    navigate('/');
    toast.error("Logged Out");
    localStorage.removeItem('token');
    setToken('');
  }

  return (
    <>
      <div className={`flex items-center justify-between py-5 font-medium font-primary`}>

        <Link to='/'>
          <h1 className='text-3xl'>KDS Temple.</h1>
        </Link>

        <ul className=' gap-10 hidden sm:flex'>
          <NavLink to='/'>
            <p className='text-md'>Home</p>
          </NavLink>

          <NavLink to='/about'>
            <p className='text-md'>About</p>
          </NavLink>

          <NavLink to='/gallery'>
            <p className='text-md'>Gallery</p>
          </NavLink>

          <NavLink to='/contact'>
            <p className='text-md'>Contact</p>
          </NavLink>
        </ul>

        <div className='gap-5 hidden sm:flex'>

        {token === localStorage.getItem('token')  
        ?<button onClick={logout} className='border-1 py-2 px-5 bg-primary hover:bg-amber-600 border-none text-white'>LogOut</button>
        :<Link className='border-1 py-2 px-5 bg-primary hover:bg-amber-600 border-none text-white' to='/login'>LogIn</Link>
        }

        </div>
        
        <div className='w-6 block sm:hidden'>
          <img src={menu_bar} alt="" onClick={()=>setVisible(true)} />
        </div>

      </div>

     {/* sidebar menu for small screen */}
     <div className={`absolute top-0 right-0 bottom-0 overflow-hidden bg-white transition-all z-100 ${visible? 'w-full' : 'w-0'}`}>
            <div className='flex flex-col text-gray-600'>
                <div onClick={()=>setVisible(false)} className='flex items-center gap-4 p-3 cursor-pointer'>
                    <img className='h-4 rotate-450' src={cancel_bar} alt="" />
                    <p>Back</p>
                </div>
                <NavLink onClick={()=>setVisible(false)} className='py-2 pl-6 border-t' to='/'>Home</NavLink>
                <NavLink onClick={()=>setVisible(false)} className='py-2 pl-6 border-t' to='/about'>ABOUT</NavLink>
                <NavLink onClick={()=>setVisible(false)} className='py-2 pl-6 border-t' to='/gallery'>GALLERY</NavLink>
                <NavLink onClick={()=>setVisible(false)} className='py-2 pl-6 border-t border-b' to='/contact'>CONTACT</NavLink>
                {
                  token === localStorage.getItem('token')
                  ?<NavLink onClick={() => { setVisible(false); logout(); }} className='py-2 pl-6 border-t mt-3 bg-primary text-white font-lg'>LOGOUT</NavLink>
                  :<NavLink onClick={()=>setVisible(false)} className='py-2 pl-6 border-t mt-3 bg-primary text-white font-lg' to='/login'>LOGIN</NavLink>
                }
            </div>
        </div>
     
     
    </>
  )
}

export default Navbar