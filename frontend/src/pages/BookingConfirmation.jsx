import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axiosInstance from "../utils/axiosInstance";
import { TempleContext } from "../context/TempleContext";
import { motion } from "framer-motion";
import { generateBookingReceipt } from "../utils/receiptGenerator";

const BookingConfirmation = () => {
    const [bookingDetails, setBookingDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const userToken = localStorage.getItem("token");
    const { backendUrl } = useContext(TempleContext);

    useEffect(() => {
        const fetchBookingDetails = async () => {
            if (!userToken) return navigate("/login");

            try {
                const response = await axiosInstance.get('/api/bookings/latest');
                if (response.data.success) {
                    setBookingDetails(response.data.booking);
                }
            } catch (error) {
                console.error("Error fetching booking details:", error);
                toast.error("Unable to load confirmation details.");
            } finally {
                setLoading(false);
            }
        };

        fetchBookingDetails();
    }, [navigate, userToken, backendUrl]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-40 font-primary">
                <div className="w-12 h-12 border-4 border-stone-100 border-t-orange-400 rounded-full animate-spin mb-6"></div>
                <p className="text-xs text-stone-400 uppercase tracking-widest animate-pulse">Confirming your booking...</p>
            </div>
        );
    }

    if (!bookingDetails) {
        return (
            <div className="flex flex-col items-center justify-center py-40 font-primary text-center">
                <p className="text-xl text-gray-800 mb-4 tracking-tight">No Recent Booking Found</p>
                <button onClick={() => navigate("/temples")} className="text-xs text-orange-500 hover:text-orange-600 uppercase tracking-widest border border-orange-200 px-6 py-3 rounded-md transition-colors">Start Booking →</button>
            </div>
        );
    }

    const {
        poojas,
        status,
        totalAmount,
        poojaInNameOf,
        paymentId,
        poojaDate,
        temple
    } = bookingDetails;

    return (
        <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto px-4 py-16 font-primary text-gray-800"
        >
            <div className="text-center mb-16 relative">
                <div className="w-20 h-20 bg-green-50 text-green-500 rounded-md flex items-center justify-center mx-auto mb-6 shadow-sm border border-green-100">
                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                </div>
                <h1 className="text-3xl text-gray-900 tracking-tight uppercase mb-2">Booking Confirmed!</h1>
                <p className="text-xs text-stone-400 uppercase tracking-widest">Your divine reservation is successful</p>
                <div className="absolute top-1/2 left-0 right-0 h-px bg-stone-100 -z-10"></div>
            </div>

            <div className="bg-white border border-stone-200 rounded-md overflow-hidden shadow-sm relative">
                <div className="absolute top-0 right-0 p-4">
                     <span className="bg-orange-50 text-orange-600 text-[10px] px-3 py-1 rounded-md border border-orange-100 uppercase tracking-widest">
                        {status}
                     </span>
                </div>

                <div className="p-8 sm:p-12">
                    <div className="mb-12">
                        <p className="text-[10px] text-stone-400 uppercase tracking-widest mb-2">Temple Destination</p>
                        <h2 className="text-2xl text-gray-900 tracking-tight uppercase">{temple?.name || "Kadasiddeshwar Temple"}</h2>
                        <p className="text-xs text-stone-500 uppercase tracking-tight mt-1">{temple?.location}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 border-t border-stone-100 pt-12">
                        <div className="space-y-8">
                            <div>
                                <p className="text-[10px] text-stone-400 uppercase tracking-widest mb-3">Devotee Details</p>
                                <p className="text-lg text-gray-900 uppercase tracking-tight">{poojaInNameOf || "Devotee"}</p>
                                <p className="text-[10px] text-stone-400 uppercase tracking-widest mt-1">Pooja in the name of</p>
                            </div>

                            <div>
                                <p className="text-[10px] text-stone-400 uppercase tracking-widest mb-3">Divine Date</p>
                                <p className="text-lg text-gray-900 uppercase tracking-tight">
                                    {poojaDate ? new Date(poojaDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' }) : "Today"}
                                </p>
                                <p className="text-[10px] text-stone-400 uppercase tracking-widest mt-1">Schedule assigned</p>
                            </div>
                        </div>

                        <div className="space-y-8">
                            <div>
                                <p className="text-[10px] text-stone-400 uppercase tracking-widest mb-3">Selected Poojas</p>
                                <div className="space-y-2">
                                    {poojas?.map((pooja) => (
                                        <div key={pooja._id} className="flex justify-between items-center bg-stone-50 px-4 py-3 rounded-md border border-stone-100">
                                            <span className="text-xs text-gray-800 uppercase tracking-wide">{pooja.name}</span>
                                            <span className="text-xs text-gray-900 tabular-nums">₹{pooja.price}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="pt-8 border-t border-dashed border-stone-200 flex justify-between items-center">
                                <span className="text-[11px] text-stone-900 uppercase tracking-widest">Total Offering</span>
                                <span className="text-3xl text-orange-500 tabular-nums">₹{totalAmount}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-stone-50 px-8 py-6 border-t border-stone-200 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div className="text-[10px] text-stone-500 uppercase tracking-widest">
                        Payment ID: <span className="text-gray-800">{paymentId || "rzp_test_..."}</span>
                    </div>
                    <button 
                        onClick={() => navigate("/myseva")} 
                        className="text-[10px] text-orange-500 uppercase tracking-widest hover:text-orange-600 underline underline-offset-4 transition-colors"
                    >
                        View My Seva History
                    </button>
                </div>
            </div>

            <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
                <button
                    onClick={() => generateBookingReceipt(bookingDetails)}
                    className="w-full sm:w-auto bg-stone-900 text-white text-[11px] uppercase tracking-widest px-10 py-4 rounded-md hover:bg-black transition-all shadow-md shadow-stone-200 active:scale-95 flex items-center justify-center gap-2"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Download Receipt
                </button>
                <button
                    onClick={() => navigate("/")}
                    className="w-full sm:w-auto border border-stone-200 text-stone-600 text-[11px] uppercase tracking-widest px-10 py-4 rounded-md hover:bg-stone-50 transition-all active:scale-95"
                >
                    Return to Ashram
                </button>
            </div>
        </motion.div>
    );
};

export default BookingConfirmation;
