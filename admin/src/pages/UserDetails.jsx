import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { backendUrl } from '../App';
import {
    X, User, Smartphone, Mail, Calendar,
    ShoppingBag, Gift, Clock, Save, Edit3, Trash2
} from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';

const UserDetails = ({ userId, onClose, onUpdate }) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [notes, setNotes] = useState('');
    const [isEditingNote, setIsEditingNote] = useState(false);

    const token = localStorage.getItem('token');

    const fetchDetails = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${backendUrl}/api/user/admin/details/${userId}`, { headers: { token } });
            if (res.data.success) {
                setData(res.data);
                setNotes(res.data.user.notes || '');
            }
        } catch (error) {
            toast.error('Failed to load user details');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDetails();
    }, [userId]);

    const handleUpdateNote = async () => {
        try {
            const res = await axios.post(`${backendUrl}/api/user/admin/update-note`, { userId, notes }, { headers: { token } });
            if (res.data.success) {
                toast.success('Note updated');
                setIsEditingNote(false);
                onUpdate(); // Refresh the list
            }
        } catch (error) {
            toast.error('Failed to update note');
        }
    };

    if (loading) return (
        <div className='fixed inset-0 bg-stone-900/50 backdrop-blur-sm z-50 flex items-center justify-center'>
            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }} className='w-12 h-12 border-4 border-stone-200 border-t-orange-500 rounded-full' />
        </div>
    );

    const { user, history } = data;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className='fixed inset-0 bg-stone-900/30 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto'
        >
            <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                className='bg-white w-full max-w-4xl rounded-sm shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh]'
            >
                {/* Header */}
                <div className='px-8 py-6 border-b border-stone-100 flex items-center justify-between bg-stone-50/50'>
                    <div className='flex items-center gap-4'>
                        <div className='w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center text-orange-600'>
                            <User size={24} />
                        </div>
                        <div>
                            <h2 className='text-xl uppercase tracking-widest text-gray-900 font-normal'>{user.name || 'Anonymous Devotee'}</h2>
                            <p className='text-[10px] text-stone-500 uppercase tracking-widest'>Joined {new Date(user.createdAt).toLocaleDateString()}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className='p-2 text-stone-400 hover:bg-stone-100 rounded-sm transition-all shadow-sm'>
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className='flex-1 overflow-y-auto p-8 space-y-10'>
                    {/* User Info Grid */}
                    <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
                        <div className='space-y-4'>
                            <div className='flex items-center gap-2 text-[10px] uppercase tracking-widest text-stone-400 border-b border-stone-50 pb-2'>
                                <Smartphone size={14} /> Mobile Contact
                            </div>
                            <p className='text-[13px] text-gray-900 font-normal tabular-nums'>{user.phone || 'N/A'}</p>
                        </div>
                        <div className='space-y-4'>
                            <div className='flex items-center gap-2 text-[10px] uppercase tracking-widest text-stone-400 border-b border-stone-50 pb-2'>
                                <Mail size={14} /> Email Address
                            </div>
                            <p className='text-[13px] text-gray-600 font-normal'>{user.email}</p>
                        </div>
                        <div className='space-y-4'>
                            <div className='flex items-center gap-2 text-[10px] uppercase tracking-widest text-stone-400 border-b border-stone-50 pb-2'>
                                <Clock size={14} /> Account Status
                            </div>
                            <span className={`text-[9px] uppercase tracking-widest px-2 py-0.5 rounded-sm border ${user.isVerified ? 'bg-green-50 text-green-600 border-green-100' : 'bg-red-50 text-red-600 border-red-100'}`}>
                                {user.isVerified ? 'Verified' : 'Pending'}
                            </span>
                        </div>
                    </div>

                    {/* Admin Notes Section */}
                    <div className='bg-orange-50/50 p-6 rounded-sm border border-orange-100/50 space-y-4'>
                        <div className='flex items-center justify-between mb-2'>
                            <div className='flex items-center gap-2 text-[10px] uppercase tracking-widest text-orange-600'>
                                <Edit3 size={14} /> Admin Remarks/Notes
                            </div>
                            {!isEditingNote ? (
                                <button onClick={() => setIsEditingNote(true)} className='text-[10px] uppercase tracking-widest text-orange-500 hover:text-orange-600'>Change</button>
                            ) : (
                                <div className='flex gap-2'>
                                    <button onClick={handleUpdateNote} className='flex items-center gap-1 text-[10px] uppercase tracking-widest bg-orange-600 text-white px-2 py-1 rounded-sm'><Save size={12} /> Save</button>
                                    <button onClick={() => setIsEditingNote(false)} className='text-[10px] uppercase tracking-widest text-stone-400'>Cancel</button>
                                </div>
                            )}
                        </div>
                        {isEditingNote ? (
                            <textarea
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                className='w-full bg-white border border-stone-100 p-4 text-xs outline-none focus:border-orange-400 rounded-sm resize-none'
                                rows='3'
                                placeholder='Add notes about this devotee (e.g., VIP donor, Regular devotee)...'
                            />
                        ) : (
                            <p className='text-[12px] text-stone-600 italic'>{notes || 'No administrative notes added yet.'}</p>
                        )}
                    </div>

                    {/* History Tabs/Sections */}
                    <div className='space-y-8'>
                        {/* Bookings */}
                        <div className='space-y-4'>
                            <h3 className='text-xs uppercase tracking-widest text-gray-900 pb-2 border-b-2 border-orange-500 w-fit'><ShoppingBag size={14} className='inline mr-2' /> Booking History</h3>
                            <div className='bg-white border border-stone-100 rounded-sm overflow-hidden'>
                                <table className='w-full text-left'>
                                    <thead className='bg-stone-50 text-[9px] uppercase tracking-widest text-stone-400 border-b border-stone-100'>
                                        <tr>
                                            <th className='px-6 py-3 font-normal'>Date</th>
                                            <th className='px-6 py-3 font-normal'>Pooja Service</th>
                                            <th className='px-6 py-3 font-normal text-right'>Amount</th>
                                        </tr>
                                    </thead>
                                    <tbody className='divide-y divide-stone-50'>
                                        {history.bookings.map((b, i) => (
                                            <tr key={i} className='text-[10px] text-stone-600'>
                                                <td className='px-6 py-4 tabular-nums'>{new Date(b.createdAt).toLocaleDateString()}</td>
                                                <td className='px-6 py-4 truncate max-w-[200px] uppercase'>{b.poojas?.map(p => p.name).join(', ')}</td>
                                                <td className='px-6 py-4 text-right tabular-nums'>₹{b.totalAmount.toLocaleString()}</td>
                                            </tr>
                                        ))}
                                        {history.bookings.length === 0 && (
                                            <tr><td colSpan='3' className='px-6 py-10 text-center italic text-stone-400 opacity-50'>No bookings found</td></tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Donations */}
                        <div className='space-y-4'>
                            <h3 className='text-xs uppercase tracking-widest text-gray-900 pb-2 border-b-2 border-orange-500 w-fit'><Gift size={14} className='inline mr-2' /> Donation Records</h3>
                            <div className='bg-white border border-stone-100 rounded-sm overflow-hidden'>
                                <table className='w-full text-left'>
                                    <thead className='bg-stone-50 text-[9px] uppercase tracking-widest text-stone-400 border-b border-stone-100'>
                                        <tr>
                                            <th className='px-6 py-3 font-normal'>Date</th>
                                            <th className='px-6 py-3 font-normal'>Temple</th>
                                            <th className='px-6 py-3 font-normal text-right'>Amount</th>
                                        </tr>
                                    </thead>
                                    <tbody className='divide-y divide-stone-50'>
                                        {history.donations.map((d, i) => (
                                            <tr key={i} className='text-[10px] text-stone-600'>
                                                <td className='px-6 py-4 tabular-nums'>{new Date(d.createdAt).toLocaleDateString()}</td>
                                                <td className='px-6 py-4 uppercase'>{d.temple?.name}</td>
                                                <td className='px-6 py-4 text-right tabular-nums'>₹{d.amount.toLocaleString()}</td>
                                            </tr>
                                        ))}
                                        {history.donations.length === 0 && (
                                            <tr><td colSpan='3' className='px-6 py-10 text-center italic text-stone-400 opacity-50'>No donations found</td></tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Sum */}
                <div className='p-8 bg-stone-900 text-white flex items-center justify-between mt-auto'>
                    <div>
                        <p className='text-[9px] uppercase tracking-widest text-stone-400'>Total Combined Contribution</p>
                        <p className='text-2xl font-normal tabular-nums'>₹{(
                            history.bookings.reduce((sum, b) => sum + b.totalAmount, 0) +
                            history.donations.reduce((sum, d) => sum + d.amount, 0)
                        ).toLocaleString()}</p>
                    </div>
                    <div className='flex gap-6'>
                        <div className='text-right'>
                            <p className='text-[8px] uppercase tracking-widest text-stone-500'>Bookings</p>
                            <p className='text-xs tabular-nums text-orange-400'>₹{history.bookings.reduce((sum, b) => sum + b.totalAmount, 0).toLocaleString()}</p>
                        </div>
                        <div className='text-right'>
                            <p className='text-[8px] uppercase tracking-widest text-stone-500'>Donations</p>
                            <p className='text-xs tabular-nums text-orange-400'>₹{history.donations.reduce((sum, d) => sum + d.amount, 0).toLocaleString()}</p>
                        </div>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default UserDetails;
