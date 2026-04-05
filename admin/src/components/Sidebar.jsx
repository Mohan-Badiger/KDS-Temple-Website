import React from 'react'
import { NavLink } from 'react-router-dom'
import dashboard_img from '../assets/dashboard.png'
import seva from '../assets/seva.svg'
import food from '../assets/food.png'
import donate from '../assets/donate.png'

const Sidebar = () => {
    return (
        <div className='w-[17%] min-h-screen border-r border-gray-300 font-primary font-medium'>
            <div className='flex flex-col gap-4 pt-6 pl-[10%] text-[15px]'>
                <NavLink to='/' className='flex items-center border gap-2 border-gray-300 px-3 py-2 border-r-0 rounded-l'>
                    <img className='w-4 block sm:hidden' src={dashboard_img} alt="" />
                    <p className='text-md sm:block hidden'>Dashboard</p>
                </NavLink>
                <NavLink to='/today-seva' className='flex items-center border gap-2 border-gray-300 px-3 py-2 border-r-0 rounded-l'>
                    <img className='w-4 block sm:hidden' src={seva} alt="" />
                    <p className='text-md sm:block hidden'>Today's Seva</p>
                </NavLink>
                <NavLink to='/temple-manage' className='flex items-center border border-gray-300 px-3 py-2 border-r-0 rounded-l'>
                    <img className='w-4 block sm:hidden' src={dashboard_img} alt="" />
                    <p className='text-md sm:block hidden'>Temple Manage</p>
                </NavLink>
                <NavLink to='/user-manage' className='flex items-center border border-gray-300 px-3 py-2 border-r-0 rounded-l'>
                    <p className='text-md sm:block hidden'>User Manage</p>
                </NavLink>
                <NavLink to='/pooja-manage' className='flex items-center border border-gray-300 px-3 py-2 border-r-0 rounded-l'>
                    <img className='w-4 block sm:hidden' src={seva} alt="" />
                    <p className='text-md sm:block hidden'>Pooja Manage</p>
                </NavLink>
                {/* <NavLink to='/annaprasad-manage' className='flex items-center border border-gray-300 px-3 py-2 border-r-0 rounded-l'>
                    <img className='w-4 block sm:hidden' src={food} alt="" />
                    <p className='text-md sm:block hidden'>Annaprasad</p>
                </NavLink> */}
                <NavLink to='/donation-manage' className='flex items-center border border-gray-300 px-3 py-2 border-r-0 rounded-l'>
                    <img className='w-4 block sm:hidden' src={donate} alt="" />
                    <p className='text-md sm:block hidden'>Donation</p>
                </NavLink>
            </div>
        </div>
    )
}

export default Sidebar