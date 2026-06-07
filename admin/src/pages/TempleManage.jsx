import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { backendUrl } from '../App';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';

const TempleManage = () => {
    const [name, setName] = useState('');
    const [location, setLocation] = useState('');
    const [image, setImage] = useState(null);
    const [temples, setTemples] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);

    const fetchTemples = async () => {
        try {
            const response = await axios.get(`${backendUrl}/api/temple/list`);
            if (response.data.success) {
                setTemples(response.data.temples);
            }
        } catch (error) {
            console.error(error);
            toast.error("Error fetching temples");
        }
    };

    useEffect(() => {
        fetchTemples();
    }, []);

    const onSubmitHandler = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const formData = new FormData();
            formData.append('name', name);
            formData.append('location', location);
            if (image) formData.append('image', image);

            const response = await axios.post(`${backendUrl}/api/temple/add`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            if (response.data.success) {
                toast.success('Temple Added Successfully');
                setName('');
                setLocation('');
                setImage(null);
                if (document.getElementById('templeImageInput')) {
                    document.getElementById('templeImageInput').value = '';
                }
                setShowAddModal(false);
                fetchTemples();
            } else {
                toast.error(response.data.message || 'Something went wrong');
            }
        } catch (error) {
            console.error(error);
            toast.error('Error adding temple');
        } finally {
            setLoading(false);
        }
    };

    const deleteTemple = async (id) => {
        if (!window.confirm("Are you sure you want to delete this temple?")) return;
        try {
            const response = await axios.delete(`${backendUrl}/api/temple/remove/${id}`);
            if (response.data.success) {
                toast.success("Temple removed");
                fetchTemples();
            }
        } catch (error) {
            console.error(error);
            toast.error("Error removing temple");
        }
    };

    return (
        <div className="flex flex-col gap-8 font-primary text-gray-800 pb-20">

            {/* Header Section */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-stone-100 pb-6 mb-4">
                <div>
                    <h2 className="text-3xl tracking-tight uppercase leading-none">Temple Management</h2>
                    <p className="text-[10px] text-stone-400 uppercase tracking-[0.2em] mt-2">
                        “Register and manage your divine locations”
                    </p>
                </div>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="bg-orange-400 text-white px-8 py-3 text-[11px] uppercase tracking-[0.2em] font hover:bg-orange-500 transition-all active:scale-95 shadow-sm"
                >
                    Add Temple
                </button>
            </div>

            {/* Registered Temples List */}
            <div className="space-y-6">
                <div className="flex items-center gap-4">
                    <h3 className="text-xl text-gray-900 tracking-tight uppercase border-l-4 border-orange-400 pl-4 py-1">
                        Registered Temples
                    </h3>
                    <div className="h-[1px] flex-grow bg-stone-100"></div>
                </div>

                <div className="grid grid-cols-1 gap-4">
                    {temples.map((temple) => (
                        <motion.div
                            key={temple._id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex flex-col sm:flex-row items-center gap-6 p-5 border border-stone-200 bg-white rounded-sm hover:border-orange-300 hover:shadow-sm transition-all duration-300 group"
                        >
                            {/* Image Left */}
                            <div className="w-full sm:w-48 h-32 flex-shrink-0 relative overflow-hidden bg-stone-50 rounded-sm">
                                {temple.image ? (
                                    <img src={temple.image} alt={temple.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <span className="text-[10px] text-stone-300 uppercase tracking-widest font-bold">No Preview</span>
                                    </div>
                                )}
                            </div>

                            {/* Content Middle */}
                            <div className="flex-grow flex flex-col justify-center text-center sm:text-left w-full sm:w-auto mt-2 sm:mt-0">
                                <h4 className="text-xl text-gray-900 uppercase tracking-tight mb-2 font-medium">{temple.name}</h4>
                                <div className="flex items-center justify-center sm:justify-start gap-2 text-stone-500">
                                    <div className="w-1.5 h-1.5 rounded-full bg-orange-400"></div>
                                    <p className="text-sm tracking-wide lowercase first-letter:uppercase">{temple.location}</p>
                                </div>
                            </div>

                            {/* Action Right */}
                            <div className="flex-shrink-0 mt-6 sm:mt-0 w-full sm:w-auto">
                                <button
                                    onClick={() => deleteTemple(temple._id)}
                                    className="w-full sm:w-auto text-[10px] text-orange-500 hover:text-white hover:bg-orange-500 border border-orange-200 hover:border-orange-500 uppercase tracking-[0.2em] font-bold px-10 py-3 rounded-sm transition-all duration-300 active:scale-95"
                                >
                                    Remove
                                </button>
                            </div>
                        </motion.div>
                    ))}

                    {temples.length === 0 && (
                        <div className="text-center py-24 bg-stone-50 border border-dashed border-stone-200 rounded-sm">
                            <p className="text-stone-400 uppercase tracking-widest text-sm mb-2 font-light">No temples listed yet 🙏</p>
                            <p className="text-[10px] text-stone-300 tracking-wider">Click 'Add Temple' to register your first location</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Premium Add Temple Modal */}
            <AnimatePresence>
                {showAddModal && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowAddModal(false)}
                            className="fixed inset-0 bg-black/40 backdrop-blur-[4px] z-[999] flex items-center justify-center p-4 shadow-inner"
                        >
                            {/* Modal Content */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                                onClick={(e) => e.stopPropagation()}
                                className="bg-white max-w-md w-full border border-stone-200 rounded-sm shadow-2xl relative overflow-hidden"
                            >
                                {/* Top Decoration */}
                                <div className="h-1 bg-orange-400 w-full"></div>

                                <div className="p-8">
                                    <div className="flex justify-between items-center mb-8">
                                        <h2 className="text-2xl text-gray-900 uppercase tracking-tight font-medium">Add New Temple</h2>
                                        <button
                                            onClick={() => setShowAddModal(false)}
                                            className="text-stone-400 hover:text-gray-900 transition-colors"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </div>

                                    <form onSubmit={onSubmitHandler} className="space-y-6">
                                        <div>
                                            <p className="text-[10px] text-stone-400 uppercase tracking-[0.2em] mb-2 font-bold">Temple Name</p>
                                            <input
                                                type="text"
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                                placeholder="e.g. Kadasiddeshwar Temple"
                                                className="w-full px-4 py-3 border border-stone-200 outline-0 rounded-sm focus:border-orange-400 focus:ring-4 focus:ring-orange-50 transition-all placeholder:text-stone-200"
                                                required
                                            />
                                        </div>

                                        <div>
                                            <p className="text-[10px] text-stone-400 uppercase tracking-[0.2em] mb-2 font-bold">Location</p>
                                            <input
                                                type="text"
                                                value={location}
                                                onChange={(e) => setLocation(e.target.value)}
                                                placeholder="e.g. Jamkhandi, Karnataka"
                                                className="w-full px-4 py-3 border border-stone-200 outline-0 rounded-sm focus:border-orange-400 focus:ring-4 focus:ring-orange-50 transition-all placeholder:text-stone-200"
                                                required
                                            />
                                        </div>

                                        <div>
                                            <p className="text-[10px] text-stone-400 uppercase tracking-[0.2em] mb-2 font-bold block">Temple Image</p>
                                            <div className="flex flex-col gap-4">
                                                <input
                                                    type="file"
                                                    id="templeImageInput"
                                                    accept="image/*"
                                                    onChange={(e) => setImage(e.target.files[0])}
                                                    className="w-full p-4 border border-stone-100 bg-stone-50 text-[10px] text-stone-400 uppercase tracking-widest rounded-sm file:mr-4 file:py-1 file:px-2 file:rounded-sm file:border-0 file:text-[10px] file:uppercase file:bg-orange-50 file:text-orange-500 hover:file:bg-orange-100 transition-all cursor-pointer"
                                                />
                                                {image && (
                                                    <p className="text-[10px] text-orange-500 italic font-medium">✨ {image.name} selected</p>
                                                )}
                                            </div>
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="w-full bg-orange-400 text-white py-4 text-[11px] uppercase tracking-[0.3em] font-bold rounded-sm hover:bg-orange-500 transition-all active:scale-[0.98] shadow-sm disabled:opacity-50 mt-4 h-14"
                                        >
                                            {loading ? (
                                                <div className="flex items-center justify-center gap-2">
                                                    <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                                    <span>Registering...</span>
                                                </div>
                                            ) : (
                                                'Create Temple'
                                            )}
                                        </button>
                                    </form>
                                </div>
                            </motion.div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
};

export default TempleManage;
