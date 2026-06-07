import React from 'react'
import { Outlet } from 'react-router-dom'

const UserManage = () => {
    return (
        <div className='font-primary'>
            <div className='flex flex-col md:flex-row md:items-end justify-between pb-5 mb-6 gap-6'>
                <div>
                    <h1 className="text-3xl tracking-tight text-gray-900 uppercase font-normal">User Management</h1>
                    <p className="text-[11px] text-stone-500 uppercase tracking-[0.3em] mt-2">Manage devotees and contributions</p>
                </div>
            </div>

            <div>
                <Outlet />
            </div>
        </div>
    )
}

export default UserManage
