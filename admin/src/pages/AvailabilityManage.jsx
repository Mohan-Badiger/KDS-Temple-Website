import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { backendUrl } from '../App';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';

const AvailabilityManage = () => {
    const [temples, setTemples] = useState([]);
    const [poojas, setPoojas] = useState([]);
    const [selectedTemples, setSelectedTemples] = useState([]);
    const [selectedPoojas, setSelectedPoojas] = useState([]);
    const [isTempleWide, setIsTempleWide] = useState(false);
    const [newDate, setNewDate] = useState('');
    const [loading, setLoading] = useState(false);
    const apiToken = localStorage.getItem('token');

    const fetchTemples = async () => {
        try {
            const res = await axios.get(`${backendUrl}/api/temple/all`);
            if (res.data.success) {
                setTemples(res.data.temples);
                // Sync selected temples if they were already selected
                if (selectedTemples.length > 0) {
                    setSelectedTemples(prev => prev.map(pt => res.data.temples.find(t => t._id === pt._id) || pt));
                }
            }
        } catch (err) {
            toast.error("Cloud connection failed. Please check network.");
        }
    };

    const fetchPoojas = async () => {
        try {
            const res = await axios.get(`${backendUrl}/api/pooja/all`);
            if (res.data.success) {
                setPoojas(res.data.poojas);
                // Sync selected poojas if they were already selected
                if (selectedPoojas.length > 0) {
                    setSelectedPoojas(prev => prev.map(pp => res.data.poojas.find(p => p._id === pp._id) || pp));
                }
            }
        } catch (err) {
            toast.error("Failed to retrieve divine services.");
        }
    };

    // Fetch all on mount
    useEffect(() => {
        fetchTemples();
        fetchPoojas();
    }, []);

    // toggleTemple/togglePooja remain same but now use the functions to maintain sync if needed
    const toggleTemple = (temple) => {
        if (selectedTemples.find(t => t._id === temple._id)) {
            setSelectedTemples(selectedTemples.filter(t => t._id !== temple._id));
        } else {
            setSelectedTemples([...selectedTemples, temple]);
        }
    };

    const togglePooja = (pooja) => {
        if (selectedPoojas.find(p => p._id === pooja._id)) {
            setSelectedPoojas(selectedPoojas.filter(p => p._id !== pooja._id));
        } else {
            setSelectedPoojas([...selectedPoojas, pooja]);
        }
    };

    const selectAllTemples = () => {
        if (selectedTemples.length === temples.length) {
            setSelectedTemples([]);
        } else {
            setSelectedTemples(temples);
        }
    };

    const selectAllPoojas = () => {
        if (selectedPoojas.length === poojas.length) {
            setSelectedPoojas([]);
        } else {
            setSelectedPoojas(poojas);
        }
    };

    const handleBlockDate = async () => {
        if (!newDate) {
            toast.warning("Please select a valid date.");
            return;
        }

        if (selectedTemples.length === 0) {
            toast.warning("Please select at least one temple.");
            return;
        }

        if (!isTempleWide && selectedPoojas.length === 0) {
            toast.warning("Please select at least one service or enable Temple Wide mode.");
            return;
        }

        setLoading(true);
        try {
            let res;
            if (isTempleWide) {
                // Apply temple-wide for each selected temple
                const promises = selectedTemples.map(temple => {
                    const updatedDates = [...(temple.unavailableDates || []), newDate];
                    return axios.put(`${backendUrl}/api/temple/update-availability`, {
                        templeId: temple._id,
                        unavailableDates: updatedDates
                    }, { headers: { token: apiToken } });
                });
                const responses = await Promise.all(promises);
                res = { data: { success: responses.every(r => r.data.success) } };
            } else {
                // Bulk update poojas across selected temples
                res = await axios.put(`${backendUrl}/api/pooja/bulk-update-availability`, {
                    poojaIds: selectedPoojas.map(p => p._id),
                    templeIds: selectedTemples.map(t => t._id),
                    date: newDate,
                    action: 'add'
                }, { headers: { token: apiToken } });
            }

            if (res.data.success) {
                toast.success("Divine calendar updated.");
                setNewDate('');
                // Refresh data without page reload
                await fetchTemples();
                await fetchPoojas();
            }
        } catch (err) {
            toast.error("Synchronization failed.");
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveDate = async (dateToRemove) => {
        setLoading(true);
        try {
            let res;
            if (isTempleWide) {
                const promises = selectedTemples.map(temple => {
                    const updatedDates = (temple.unavailableDates || []).filter(d => d !== dateToRemove);
                    return axios.put(`${backendUrl}/api/temple/update-availability`, {
                        templeId: temple._id,
                        unavailableDates: updatedDates
                    }, { headers: { token: apiToken } });
                });
                const responses = await Promise.all(promises);
                res = { data: { success: responses.every(r => r.data.success) } };
            } else {
                res = await axios.put(`${backendUrl}/api/pooja/bulk-update-availability`, {
                    poojaIds: selectedPoojas.map(p => p._id),
                    templeIds: selectedTemples.map(t => t._id),
                    date: dateToRemove,
                    action: 'remove'
                }, { headers: { token: apiToken } });
            }

            if (res.data.success) {
                toast.success("Restriction removed.");
                // Refresh data without page reload
                await fetchTemples();
                await fetchPoojas();
            }
        } catch (err) {
            toast.error("Failed to remove restriction.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col gap-10 font-primary mt-10 text-gray-800 pb-20">
            {/* Page Header */}
            <div className="border-b border-stone-100 pb-6">
                <h2 className="text-3xl tracking-tight uppercase leading-none font-normal">Availability Management</h2>
                <p className="text-[10px] text-stone-400 uppercase tracking-[0.2em] mt-2 font-normal">
                    Enable or disable divine services for specific dates to maintain order
                </p>
            </div>

            {/* Step 1: Select Temples */}
            <section className="space-y-4">
                <div className="flex justify-between items-end">
                    <p className="text-[10px] text-stone-300 uppercase tracking-widest font-normal">Step 01. Select Temple Locations</p>
                    <button
                        onClick={selectAllTemples}
                        className="px-4 py-2 bg-orange-400 text-white text-[12px] uppercase tracking-widest hover:bg-orange-500 transition-all rounded-sm shadow-sm font-medium"
                    >
                        {selectedTemples.length === temples.length ? 'Deselect All' : 'Select All Temples'}
                    </button>
                </div>
                <div className="flex flex-wrap gap-3">
                    {temples.map(temple => (
                        <button
                            key={temple._id}
                            onClick={() => toggleTemple(temple)}
                            className={`px-6 py-3 border text-[12px] uppercase tracking-widest transition-all rounded-sm font-normal ${selectedTemples.find(t => t._id === temple._id)
                                ? 'bg-orange-50 text-gray-800 border-orange-400 shadow-sm'
                                : 'bg-white text-stone-500 border-stone-100 hover:border-stone-200'
                                }`}
                        >
                            {temple.name}
                        </button>
                    ))}
                </div>
            </section>

            <AnimatePresence mode="wait">
                {selectedTemples.length > 0 && (
                    <motion.section
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="space-y-4"
                    >
                        <div className="flex justify-between items-center bg-stone-50/50 p-4 rounded-sm border border-stone-100">
                            <div className="flex items-center gap-3">
                                <input
                                    type="checkbox"
                                    id="templeWide"
                                    checked={isTempleWide}
                                    onChange={(e) => setIsTempleWide(e.target.checked)}
                                    className="accent-orange-400"
                                />
                                <label htmlFor="templeWide" className="text-xs uppercase tracking-widest text-gray-700 cursor-pointer">
                                    Temple Wide Closure (Festivals/Maintenance)
                                </label>
                            </div>
                            {!isTempleWide && (
                                <button
                                    onClick={selectAllPoojas}
                                    className="px-4 py-2 bg-orange-400 text-white text-[12px] uppercase tracking-widest hover:bg-orange-500 transition-all rounded-sm shadow-sm font-medium"
                                >
                                    {selectedPoojas.length === poojas.length ? 'Deselect All Services' : 'Select All Services'}
                                </button>
                            )}
                        </div>

                        {!isTempleWide && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                {poojas.map(pooja => (
                                    <div
                                        key={pooja._id}
                                        onClick={() => togglePooja(pooja)}
                                        className={`p-4 text-[12px] border cursor-pointer transition-all rounded-sm flex flex-col gap-2 font-normal ${selectedPoojas.find(p => p._id === pooja._id)
                                            ? 'border-orange-500 bg-orange-50/50'
                                            : 'border-stone-100 bg-white hover:border-stone-200'
                                            }`}
                                    >
                                        <h4 className="text-sm uppercase tracking-tight font-normal">{pooja.name}</h4>
                                        <p className="text-[9px] text-stone-400 uppercase tracking-widest font-normal">
                                            Base Price: ₹{pooja.price}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </motion.section>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {(selectedPoojas.length > 0 || isTempleWide) && selectedTemples.length > 0 && (
                    <motion.section
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white border border-stone-200 p-8 rounded-sm shadow-sm space-y-8"
                    >
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                            <div className="space-y-1">
                                <h3 className="text-xl tracking-tight uppercase font-normal">
                                    {isTempleWide ? 'Temple Wide Restriction' : `${selectedPoojas.length} Service(s) Selected`}
                                </h3>
                                <p className="text-[11px] text-stone-600 uppercase tracking-widest font-normal">
                                    Applying to {selectedTemples.length} Temple(s)
                                </p>
                            </div>

                            <div className="flex items-center gap-3 w-full sm:w-auto">
                                <input
                                    type="date"
                                    value={newDate}
                                    onChange={(e) => setNewDate(e.target.value)}
                                    className="px-4 py-3 border border-stone-100 focus:border-orange-300 outline-none rounded-sm text-xs bg-stone-50/50 flex-grow font-normal"
                                />
                                <button
                                    onClick={handleBlockDate}
                                    disabled={loading}
                                    className="bg-gray-900 text-white px-8 py-3 text-[10px] uppercase tracking-[0.2em] rounded-sm hover:bg-orange-500 transition-all active:scale-95 whitespace-nowrap font-normal"
                                >
                                    {loading ? 'Processing...' : 'Block Date'}
                                </button>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <p className="text-[12px] text-stone-600 uppercase tracking-widest font-normal">Current Selections Summary</p>
                            <div className="p-4 bg-stone-50 border border-stone-100 rounded-sm">
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {selectedTemples.map(t => (
                                        <span key={t._id} className="text-[11px] bg-white border border-stone-200 px-2 py-1 rounded-sm uppercase tracking-widest font-medium text-stone-500">
                                            {t.name}
                                        </span>
                                    ))}
                                </div>
                                <div className="text-[11px] text-stone-400">
                                    {isTempleWide
                                        ? "Note: This will block ALL bookings for these temples on the selected dates."
                                        : `Note: This will block ONLY the selected ${selectedPoojas.length} services.`}
                                </div>
                            </div>
                        </div>

                        {/* Active Restrictions List */}
                        <div className="space-y-4 pt-8 border-t border-stone-100">
                            <p className="text-[12px] text-stone-600 uppercase tracking-widest font-normal">Active Restrictions for Selections</p>
                            <div className="flex flex-wrap gap-3">
                                {(() => {
                                    let dates = new Set();
                                    if (isTempleWide) {
                                        selectedTemples.forEach(temple => {
                                            (temple.unavailableDates || []).forEach(d => dates.add(d));
                                        });
                                    } else {
                                        selectedPoojas.forEach(pooja => {
                                            pooja.temples.forEach(t => {
                                                const tId = t.templeId?._id || t.templeId;
                                                if (selectedTemples.some(st => st._id === tId)) {
                                                    (t.unavailableDates || []).forEach(d => dates.add(d));
                                                }
                                            });
                                        });
                                    }

                                    const sortedDates = Array.from(dates).sort();

                                    if (sortedDates.length === 0) {
                                        return (
                                            <div className="w-full py-12 border border-dashed border-stone-100 flex flex-col items-center justify-center opacity-40">
                                                <p className="text-[11px] uppercase tracking-[0.3em] font-normal text-stone-600">No active restrictions found for current selection</p>
                                            </div>
                                        );
                                    }

                                    return sortedDates.map(date => (
                                        <div
                                            key={date}
                                            className="flex items-center gap-3 bg-stone-50 border border-stone-100 px-4 py-2 rounded-sm group hover:border-red-100 transition-all"
                                        >
                                            <span className="text-[11px] tabular-nums font-normal">{date}</span>
                                            <div className="w-[1px] h-3 bg-stone-200"></div>
                                            <button
                                                onClick={() => handleRemoveDate(date)}
                                                className="text-[10px] text-stone-400 hover:text-red-500 uppercase tracking-widest transition-colors font-normal"
                                            >
                                                Allow
                                            </button>
                                        </div>
                                    ));
                                })()}
                            </div>
                        </div>

                        <div className="pt-6 border-t border-orange-400 flex items-start gap-3 bg-orange-50 p-4 rounded-sm">
                            <svg className="w-4 h-4 text-orange-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                            <p className="text-[9px] text-stone-500 uppercase tracking-[0.1em] leading-relaxed font-normal">
                                Bulk restrictions are applied sequentially. If a temple is marked as restricted, devotees will see a prominent festival notice during checkout. Use with care during high-traffic seasons.
                            </p>
                        </div>
                    </motion.section>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AvailabilityManage;
