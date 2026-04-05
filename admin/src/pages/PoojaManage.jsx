import React from 'react'
import { NavLink, Outlet } from 'react-router-dom'

const PoojaManage = () => {
    return (
        <div className='sm:mt-6 font-primary'>
            <div className='grid grid-cols-1 sm:grid-cols-4 gap-2'>
                {/* <NavLink to='availability'
                    className={({ isActive }) => `px-4 py-2 border rounded-sm transition-all ${isActive ? 'border-orange-400 bg-orange-50 text-orange-600 font-normal' : 'border-stone-100 bg-white text-stone-500 font-normal hover:border-stone-200'}`}
                >
                    <p className='text-xs uppercase tracking-widest text-center'>Availability</p>
                </NavLink> */}
                <NavLink to='availability' className='border border-gray-300 px-3 py-2 rounded-l'>
                    <p className='text-md text-center'>Availability</p>
                </NavLink>
                <NavLink to='pooja-list' className='border border-gray-300 px-3 py-2 rounded-l'>
                    <p className='text-md text-center'>All Pooja's</p>
                </NavLink>
                <NavLink to='add' className='border border-gray-300 px-3 py-2 rounded-l'>
                    <p className='text-md text-center'>Add Pooja</p>
                </NavLink>
                <NavLink to='manage' className='border border-gray-300 px-3 py-2 rounded-l'>
                    <p className='text-md text-center'>Remove/Update</p>
                </NavLink>
            </div>
            <div className='mt-4'>
                <Outlet />
            </div>
        </div>
    )
}

export default PoojaManage