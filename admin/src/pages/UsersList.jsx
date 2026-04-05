import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { backendUrl } from '../App';
import {
    Search, Filter, Download, User, Smartphone, Mail, Calendar,
    TrendingUp, Award, TrendingDown, Clock, ExternalLink
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import * as XLSX from 'xlsx';
import { toast } from 'react-toastify';
import UserDetails from './UserDetails';

const UsersList = () => {
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState('all'); // all, high-spenders, new-users
    const [selectedUser, setSelectedUser] = useState(null);

    const token = localStorage.getItem('token');

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${backendUrl}/api/user/admin/all`, { headers: { token } });
            if (res.data.success) {
                setUsers(res.data.users);
                setFilteredUsers(res.data.users);
            }
        } catch (error) {
            toast.error('Failed to load devotees');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    useEffect(() => {
        let result = users;

        if (search) {
            result = result.filter(u =>
                u.name?.toLowerCase().includes(search.toLowerCase()) ||
                u.phone?.includes(search) ||
                u.email?.toLowerCase().includes(search.toLowerCase())
            );
        }

        if (filter === 'high-spenders') {
            result = result.filter(u => u.totalAmount >= 10000);
        } else if (filter === 'new-users') {
            const oneMonthAgo = new Date();
            oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
            result = result.filter(u => new Date(u.createdAt) >= oneMonthAgo);
        }

        setFilteredUsers(result);
    }, [search, filter, users]);

    const exportExcel = () => {
        const data = filteredUsers.map(u => ({
            Name: u.name,
            Phone: u.phone,
            Email: u.email,
            'Joined Date': new Date(u.createdAt).toLocaleDateString(),
            'Total Bookings': u.totalBookings,
            'Total Donations': u.totalDonations,
            'Total Amount': `₹${u.totalAmount}`,
            'Admin Notes': u.notes || ''
        }));

        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Devotees');
        XLSX.writeFile(workbook, `Devotees_Report_${new Date().toISOString().split('T')[0]}.xlsx`);
        toast.success('Excel report generated');
    };

    const topDevoteesByAmount = [...users].sort((a, b) => b.totalAmount - a.totalAmount).slice(0, 5);
    const topDevoteesByDonations = [...users].sort((a, b) => b.totalDonations - a.totalDonations).slice(0, 5);

    if (loading) return <div className='flex justify-center p-20'><motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }} className='w-10 h-10 border-4 border-stone-100 border-t-orange-500 rounded-full' /></div>;

    return (
        <div className='space-y-8 pb-20'>
            {/* Top Devotees Section */}
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
                <div className='bg-stone-50/50 p-6 rounded-sm border border-stone-100'>
                    <div className='flex items-center gap-2 mb-4 text-slate-600'>
                        <Award size={18} />
                        <h3 className='text-sm uppercase tracking-widest font-normal'>Top Devotees (By Contribution)</h3>
                    </div>
                    <div className='space-y-3'>
                        {topDevoteesByAmount.map((u, i) => (
                            <div key={i} className='flex items-center justify-between bg-white p-3 rounded-sm border border-stone-100/50 text-[13px]'>
                                <span className='text-stone-600 truncate max-w-[150px]'>{u.name || u.email}</span>
                                <span className='font-bold text-gray-900'>₹{u.totalAmount.toLocaleString()}</span>
                            </div>
                        ))}
                    </div>
                </div>
                <div className='bg-stone-50/50 p-6 rounded-sm border border-stone-100'>
                    <div className='flex items-center gap-2 mb-4 text-slate-600'>
                        <TrendingUp size={18} />
                        <h3 className='text-sm uppercase tracking-widest font-normal'>Most Frequent Donors</h3>
                    </div>
                    <div className='space-y-3'>
                        {topDevoteesByDonations.map((u, i) => (
                            <div key={i} className='flex items-center justify-between bg-white p-3 rounded-sm border border-stone-100/50 text-[13px]'>
                                <span className='text-stone-600 truncate max-w-[150px]'>{u.name || u.email}</span>
                                <span className='bg-gray-50 text-gray-600 px-2 py-0.5 rounded'>{u.totalDonations} Donations</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Controls */}
            <div className='flex flex-col md:flex-row items-center justify-between gap-4 bg-white p-6 border border-stone-200 rounded-sm'>
                <div className='relative w-full md:w-96'>
                    <Search className='absolute left-3 top-1/2 -translate-y-1/2 text-stone-400' size={16} />
                    <input
                        type='text'
                        placeholder='Search by name, phone or email...'
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className='w-full pl-10 pr-4 py-2.5 text-sm border border-stone-500 outline-none focus:border-orange-400 rounded-sm transition-all'
                    />
                </div>
                <div className='flex items-center gap-3 w-full md:w-auto'>
                    <select
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className='flex-1 md:w-48 bg-white border border-stone-500 px-4 py-2.5 text-xs outline-none focus:border-orange-400 rounded-sm transition-all cursor-pointer'
                    >
                        <option value='all'>All Devotees</option>
                        <option value='high-spenders'>High Spenders ({" > "}₹10k)</option>
                        <option value='new-users'>Joined This Month</option>
                    </select>
                    <button
                        onClick={exportExcel}
                        className='flex items-center gap-2 px-6 py-2.5 bg-gray-900 text-white text-[10px] uppercase tracking-widest hover:bg-orange-500 transition-all rounded-sm shadow-md'
                    >
                        <Download size={14} /> Export
                    </button>
                </div>
            </div>

            {/* Main Table */}
            <div className='bg-white border border-stone-100 rounded-sm overflow-hidden shadow-sm'>
                <div className='overflow-x-auto'>
                    <table className='w-full text-left'>
                        <thead className='bg-stone-50/50 text-[10px] uppercase tracking-widest text-stone-500 border-b border-stone-100'>
                            <tr>
                                <th className='px-6 py-4 font-normal'>Devotee</th>
                                <th className='px-6 py-4 font-normal'>Contact</th>
                                <th className='px-6 py-4 font-normal text-center'>History</th>
                                <th className='px-6 py-4 font-normal text-right'>Total Amount</th>
                                <th className='px-6 py-4 font-normal text-center'>Joined</th>
                                <th className='px-6 py-4 font-normal text-right'>Actions</th>
                            </tr>
                        </thead>
                        <tbody className='divide-y divide-stone-50'>
                            {filteredUsers.map((u, i) => (
                                <tr key={u._id} className='hover:bg-stone-50/30 transition-all group'>
                                    <td className='px-6 py-5'>
                                        <div className='flex items-center gap-3'>
                                            <div className='w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center text-stone-400 group-hover:bg-orange-100 group-hover:text-orange-500 transition-all'>
                                                <User size={14} />
                                            </div>
                                            <div>
                                                <p className='text-[11px] font-normal text-gray-900 uppercase truncate max-w-[120px]'>{u.name || 'No Name'}</p>
                                                {u.notes && <p className='text-[9px] text-orange-500 truncate max-w-[120px]'>{u.notes}</p>}
                                            </div>
                                        </div>
                                    </td>
                                    <td className='px-6 py-5'>
                                        <div className='space-y-1'>
                                            <div className='flex items-center gap-1.5 text-[10px] text-stone-500'>
                                                <Smartphone size={12} className='text-stone-300' /> {u.phone || 'N/A'}
                                            </div>
                                            <div className='flex items-center gap-1.5 text-[10px] text-stone-500'>
                                                <Mail size={12} className='text-stone-300' /> {u.email}
                                            </div>
                                        </div>
                                    </td>
                                    <td className='px-4 py-5 text-center'>
                                        <div className='flex flex-col items-center gap-1 text-[9px] text-stone-400 uppercase tracking-tight'>
                                            <span className='bg-stone-50 text-gray-600 px-2 py-0.5 rounded-sm border border-stone-200'>{u.totalBookings} Bookings</span>
                                            <span className='bg-stone-50 text-gray-600 px-2 py-0.5 rounded-sm border border-stone-200'>{u.totalDonations} Donations</span>
                                        </div>
                                    </td>
                                    <td className='px-6 py-5 text-right'>
                                        <p className='text-[13px] font-bold text-gray-900 tabular-nums'>₹{u.totalAmount.toLocaleString()}</p>
                                        <p className='text-[10px] text-stone-400 uppercase tracking-widest'>Combined</p>
                                    </td>
                                    <td className='px-6 py-5 text-center'>
                                        <p className='text-[13px] text-stone-400 tabular-nums'>{new Date(u.createdAt).toLocaleDateString()}</p>
                                    </td>
                                    <td className='px-6 py-5 text-right'>
                                        <button
                                            onClick={() => setSelectedUser(u._id)}
                                            className='p-2 text-stone-400 hover:text-orange-500 transition-all border border-transparent hover:border-orange-200 rounded-sm'
                                            title='View Details'
                                        >
                                            <ExternalLink size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {filteredUsers.length === 0 && (
                    <div className='py-20 text-center opacity-40 uppercase tracking-[0.2em] text-stone-400 text-xs italic'>
                        No devotees found matching your criteria
                    </div>
                )}
            </div>

            {/* User Details Modal/Overlay */}
            <AnimatePresence>
                {selectedUser && (
                    <UserDetails
                        userId={selectedUser}
                        onClose={() => setSelectedUser(null)}
                        onUpdate={fetchUsers}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

export default UsersList;
