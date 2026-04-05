import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { backendUrl } from '../App';
import { toast } from 'react-toastify';

const TempleManage = () => {
    const [name, setName] = useState('');
    const [location, setLocation] = useState('');
    const [image, setImage] = useState(null);
    const [temples, setTemples] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchTemples = async () => {
        try {
            const response = await axios.get(`${backendUrl}/api/temple/all`);
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
        <div className="flex flex-col gap-10 font-primary">
            {/* Add New Temple Form */}
            <div className="w-full max-w-lg bg-white p-6 border border-gray-200 rounded-sm self-start">
                <h2 className="text-2xl mb-6 text-gray-900 tracking-tight uppercase">Add Temple</h2>
                <form onSubmit={onSubmitHandler} className="space-y-5">
                    <div>
                        <p className="text-xs text-stone-500 uppercase tracking-widest mb-2">Temple Name</p>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full p-3 border border-stone-200 outline-0 rounded-sm focus:border-orange-400 transition-colors"
                            required
                        />
                    </div>
                    <div>
                        <p className="text-xs text-stone-500 uppercase tracking-widest mb-2">Location</p>
                        <input
                            type="text"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            className="w-full p-3 border border-stone-200 outline-0 rounded-sm focus:border-orange-400 transition-colors"
                            required
                        />
                    </div>
                    <div>
                        <label className="text-xs text-stone-500 uppercase tracking-widest mb-2 block">Upload Image</label>
                        <input
                            type="file"
                            id="templeImageInput"
                            accept="image/*"
                            onChange={(e) => setImage(e.target.files[0])}
                            className="w-full p-4 border border-stone-200 outline-0 text-xs text-stone-500 rounded-sm"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-orange-400 text-white p-4 outline-0 hover:bg-orange-500 disabled:opacity-70 transition-colors uppercase tracking-[0.2em] text-xs rounded-sm mt-4 active:scale-95 shadow-sm"
                        disabled={loading}
                    >
                        {loading ? 'Adding...' : 'Add Temple'}
                    </button>
                </form>
            </div>

            {/* Existing Temples List */}
            <div className="flex-1 flex flex-col gap-4">
                <div className="mb-4">
                    <h3 className="text-2xl text-gray-900 tracking-tight uppercase border-l-2 border-orange-400 pl-3">Registered Temples</h3>
                    <p className="text-sm text-stone-500 mt-2 pl-3">Manage your divine locations</p>
                </div>

                {temples.map((temple) => (
                    <div key={temple._id} className="flex flex-col sm:flex-row items-center gap-6 p-4 border border-stone-200 bg-white rounded-sm hover:border-orange-400 transition-colors duration-300">
                        {/* Image (Left) */}
                        <div className="w-full sm:w-40 h-28 flex-shrink-0">
                            {temple.image ? (
                                <img src={temple.image} alt={temple.name} className="w-full h-full object-cover rounded-sm border border-stone-100" />
                            ) : (
                                <div className="w-full h-full bg-stone-50 flex items-center justify-center rounded-sm border border-stone-100">
                                    <span className="text-[10px] text-stone-400 uppercase tracking-widest">No Image</span>
                                </div>
                            )}
                        </div>

                        {/* Content (Middle) */}
                        <div className="flex-grow flex flex-col justify-center text-center sm:text-left w-full sm:w-auto">
                            <h4 className="text-lg text-gray-900 uppercase tracking-tight mb-2">{temple.name}</h4>
                            <p className="text-sm text-stone-500 flex items-center justify-center sm:justify-start gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-orange-400"></span>
                                {temple.location}
                            </p>
                        </div>

                        {/* Action (Right) */}
                        <div className="flex-shrink-0 mt-4 sm:mt-0 w-full sm:w-auto">
                            <button
                                onClick={() => deleteTemple(temple._id)}
                                className="w-full sm:w-auto text-[11px] text-orange-400 hover:text-white hover:bg-orange-400 border border-orange-400 uppercase tracking-[0.2em] px-8 py-3 rounded-sm transition-all duration-300 active:scale-95"
                            >
                                Remove
                            </button>
                        </div>
                    </div>
                ))}

                {temples.length === 0 && (
                    <div className="text-center py-20 bg-stone-50 border border-dashed border-stone-300 rounded-sm mt-4">
                        <p className="text-sm text-stone-400 uppercase tracking-widest">No temples listed yet.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TempleManage;
