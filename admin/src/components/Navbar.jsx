import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Bell, X, User, MessageSquare, Bug, Trash2 } from 'lucide-react';
import { toast } from 'react-toastify';
import { backendUrl } from '../App';

const Navbar = ({ setToken }) => {
    const [notifications, setNotifications] = useState([]);
    const [showNotifications, setShowNotifications] = useState(false);
    const dropdownRef = useRef(null);
    const token = localStorage.getItem('token');

    const fetchNotifications = async () => {
        try {
            const response = await axios.get(`${backendUrl}/api/admin/get-notifications`, {
                headers: { token }
            });
            if (response.data.success) {
                setNotifications(response.data.notifications);
            }
        } catch (error) {
            console.error("Error fetching notifications:", error);
        }
    };

    const clearNotification = async (id) => {
        try {
            const response = await axios.delete(`${backendUrl}/api/admin/clear-notification/${id}`, {
                headers: { token }
            });
            if (response.data.success) {
                setNotifications(notifications.filter(n => n._id !== id));
                toast.success("Notification cleared");
            }
        } catch (error) {
            console.error("Error clearing notification:", error);
            toast.error("Failed to clear notification");
        }
    };

    useEffect(() => {
        if (token) {
            fetchNotifications();
            // Poll for notifications every 30 seconds
            const interval = setInterval(fetchNotifications, 30000);
            return () => clearInterval(interval);
        }
    }, [token]);

    // Close dropdown on click outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowNotifications(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className='flex justify-between items-center py-5 font-medium font-primary relative'>
            <div>
                <Link to='/' className='text-2xl sm:text-3xl font-light tracking-tighter'>BNT Temples<span className='text-orange-500'>.</span>Admin</Link>
            </div>

            <div className='flex items-center gap-4 sm:gap-6'>
                {/* Notification Bell */}
                <div className='relative' ref={dropdownRef}>
                    <button
                        onClick={() => setShowNotifications(!showNotifications)}
                        className='p-2 text-gray-500 hover:text-orange-500 transition-colors relative bg-stone-50 rounded-full'
                    >
                        <Bell size={20} />
                        {notifications.length > 0 && (
                            <span className='absolute top-0 right-0 w-4 h-4 bg-red-500 text-white text-[10px] flex items-center justify-center rounded-full border-2 border-white'>
                                {notifications.length}
                            </span>
                        )}
                    </button>

                    {/* Notifications Dropdown */}
                    {showNotifications && (
                        <div className='absolute right-0 mt-3 w-80 bg-white shadow-xl rounded-sm border border-stone-100 z-50 overflow-hidden'>
                            <div className='p-4 border-b border-stone-100 flex justify-between items-center bg-stone-50/50'>
                                <h3 className='text-sm font-medium uppercase tracking-widest text-gray-700'>Notifications</h3>
                                <span className='text-[10px] bg-stone-200 px-2 py-0.5 rounded-full text-stone-600'>{notifications.length} New</span>
                            </div>

                            <div className='max-h-96 overflow-y-auto'>
                                {notifications.length === 0 ? (
                                    <div className='p-8 text-center'>
                                        <Bell size={32} className='mx-auto text-stone-200 mb-2' />
                                        <p className='text-xs text-stone-400'>No new notifications</p>
                                    </div>
                                ) : (
                                    notifications.map((notif) => (
                                        <div key={notif._id} className='p-4 border-b border-stone-50 hover:bg-stone-50/50 transition-colors group relative'>
                                            <div className='flex gap-3'>
                                                <div className={`mt-1 p-1.5 rounded-sm ${
                                                    notif.type === 'technical_issue' ? 'bg-red-50 text-red-500' : 
                                                    notif.type === 'feedback' ? 'bg-blue-50 text-blue-500' : 
                                                    'bg-green-50 text-green-500'
                                                }`}>
                                                    {notif.type === 'technical_issue' ? <Bug size={14} /> : 
                                                     notif.type === 'feedback' ? <MessageSquare size={14} /> : 
                                                     <Mail size={14} />}
                                                </div>
                                                <div className='flex-1 pr-6'>
                                                    <p className='text-xs font-semibold text-gray-900 mb-0.5'>{notif.title}</p>
                                                    <p className='text-[11px] text-stone-500 line-clamp-2 leading-relaxed'>{notif.message}</p>
                                                    <p className='text-[9px] text-stone-400 mt-2'>{new Date(notif.createdAt).toLocaleString()}</p>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => clearNotification(notif._id)}
                                                className='absolute top-4 right-4 text-stone-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100'
                                                title="Clear"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    )}
                </div>

                <button
                    onClick={() => { setToken('') }}
                    className='py-2 px-6 bg-orange-400 hover:bg-orange-500 border-none text-white text-xs uppercase tracking-widest transition-all rounded-sm shadow-sm'
                >
                    LogOut
                </button>
            </div>
        </div>
    );
};

export default Navbar;