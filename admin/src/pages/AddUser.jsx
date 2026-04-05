import React, { useState } from 'react';
import axios from 'axios';
import { backendUrl } from '../App';
import {
    UserPlus, User, Smartphone, Mail,
    FileText, Save, CheckCircle
} from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const AddUser = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        notes: ''
    });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const token = localStorage.getItem('token');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await axios.post(`${backendUrl}/api/user/admin/add`, formData, { headers: { token } });
            if (res.data.success) {
                toast.success('Devotee added successfully');
                navigate('/user-manage/users-list');
            } else {
                toast.error(res.data.message);
            }
        } catch (error) {
            toast.error('Failed to add devotee');
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className='max-w-2xl mx-auto py-10'
        >
            <div className='bg-white border border-stone-100 rounded-sm shadow-xl overflow-hidden'>
                <div className='p-8 bg-stone-50/50 border-b border-stone-100 flex items-center gap-3'>
                    <div className='w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600'>
                        <UserPlus size={20} />
                    </div>
                    <div>
                        <h3 className='text-lg uppercase tracking-widest text-gray-900 font-normal'>Manual Devotee Entry</h3>
                        <p className='text-[12px] text-stone-500 uppercase tracking-widest'>Register a devotee for offline bookings/donations</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className='p-8 space-y-6'>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                        {/* Name */}
                        <div className='space-y-2'>
                            <label className='text-[12px] uppercase tracking-widest text-stone-500 ml-1'>Full Name</label>
                            <div className='relative'>
                                <User className='absolute left-3 top-1/2 -translate-y-1/2 text-stone-300' size={16} />
                                <input
                                    type='text'
                                    required
                                    placeholder='John Doe'
                                    className='w-full pl-10 pr-4 py-3 text-[14px] border border-stone-100 rounded-sm outline-none focus:border-orange-400 transition-all'
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                        </div>

                        {/* Phone */}
                        <div className='space-y-2'>
                            <label className='text-[12px] uppercase tracking-widest text-stone-500 ml-1'>Phone Number</label>
                            <div className='relative'>
                                <Smartphone className='absolute left-3 top-1/2 -translate-y-1/2 text-stone-300' size={16} />
                                <input
                                    type='tel'
                                    required
                                    placeholder='9876543210'
                                    className='w-full pl-10 pr-4 py-3 text-[14px] border border-stone-100 rounded-sm outline-none focus:border-orange-400 transition-all'
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Email */}
                    <div className='space-y-2'>
                        <label className='text-[12px] uppercase tracking-widest text-stone-500 ml-1'>Email Address (Required)</label>
                        <div className='relative'>
                            <Mail className='absolute left-3 top-1/2 -translate-y-1/2 text-stone-300' size={16} />
                            <input
                                type='email'
                                required
                                placeholder='devotee@example.com'
                                className='w-full pl-10 pr-4 py-3 text-[14px] border border-stone-100 rounded-sm outline-none focus:border-orange-400 transition-all'
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>
                    </div>

                    {/* Admin Notes */}
                    <div className='space-y-2'>
                        <label className='text-[12px] uppercase tracking-widest text-stone-500 ml-1'>Admin Remarks/Notes</label>
                        <div className='relative'>
                            <FileText className='absolute left-3 top-4 text-stone-300' size={16} />
                            <textarea
                                placeholder='VIP Donor, Regular visitor, etc...'
                                className='w-full pl-10 pr-4 py-3 text-[14px] border border-stone-100 rounded-sm outline-none focus:border-orange-400 transition-all min-h-[100px] resize-none'
                                value={formData.notes}
                                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className='pt-6 border-t border-stone-50'>
                        <button
                            disabled={loading}
                            type='submit'
                            className='w-full flex items-center justify-center gap-2 bg-gray-900 text-white py-4 text-[14px] uppercase tracking-[0.3em] hover:bg-orange-600 transition-all rounded-sm shadow-lg disabled:opacity-50'
                        >
                            {loading ? (
                                <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }} className='w-4 h-4 border-2 border-white/20 border-t-white rounded-full' />
                            ) : (
                                <><CheckCircle size={18} /> Register Devotee</>
                            )}
                        </button>
                    </div>
                </form>
            </div>
            <p className='text-center mt-6 text-[12px] text-stone-400 uppercase tracking-widest'>Manual entries are automatically marked as verified</p>
        </motion.div>
    );
};

export default AddUser;
