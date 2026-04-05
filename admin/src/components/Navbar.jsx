import React from 'react'
import { Link } from 'react-router-dom'

const Navbar = ({ setToken }) => {
  return (
    <div className='flex justify-between items-center py-5 font-medium font-primary'>
      <div>
        <Link to='/' className='text-2xl sm:text-3xl'>Temple.</Link>
      </div>
      <button onClick={() => { setToken('') }} className='border-1 py-2 px-5 bg-orange-400 hover:bg-orange-500 border-none text-white text-sm sm:text-md'>LogOut</button>
    </div>
  )
}

export default Navbar