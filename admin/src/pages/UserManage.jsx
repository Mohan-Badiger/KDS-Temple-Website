import React from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import { Users, UserPlus } from 'lucide-react'

const UserManage = () => {
    return (
        <div className='font-primary'>
            <div className='flex flex-col md:flex-row md:items-end justify-between pb-5 mb-2 gap-6'>
                <div>
                    <h1 className="text-3xl tracking-tight text-gray-900 uppercase font-normal">User Management</h1>
                    <p className="text-[11px] text-stone-500 uppercase tracking-[0.3em] mt-2">Manage devotees and contributions</p>
                </div>
            </div>

            <div className='grid grid-cols-1 sm:grid-cols-2 gap-2 mb-8'>
                <NavLink
                    to='users-list'
                    className={({ isActive }) => `flex items-center justify-center gap-2 border px-4 py-3 rounded-sm transition-all ${isActive ? 'border-orange-400 bg-orange-50 text-orange-600' : 'border-stone-100 bg-white text-stone-500 hover:border-stone-200'}`}
                >
                    <Users size={18} />
                    <p className='text-xs uppercase tracking-widest text-center'>Devotees List</p>
                </NavLink>
                <NavLink
                    to='add-user'
                    className={({ isActive }) => `flex items-center justify-center gap-2 border px-4 py-3 rounded-sm transition-all ${isActive ? 'border-orange-400 bg-orange-50 text-orange-600' : 'border-stone-100 bg-white text-stone-500 hover:border-stone-200'}`}
                >
                    <UserPlus size={18} />
                    <p className='text-xs uppercase tracking-widest text-center'>Add Devotee Manually</p>
                </NavLink>
            </div>

            <div className='mt-4'>
                <Outlet />
            </div>
        </div>
    )
}

export default UserManage
