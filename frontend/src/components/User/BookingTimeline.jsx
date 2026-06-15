import React, { useEffect, useState, useContext } from 'react';
import { motion } from 'framer-motion';
import axiosInstance from '../../utils/axiosInstance';
import { TempleContext } from '../../context/TempleContext';
import { getBookingDisplayStatus } from '../../utils/bookingUtils';
import { generateBookingReceipt } from '../../utils/receiptGenerator';

const BookingTimeline = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { token, backendUrl, settings } = useContext(TempleContext);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        if (!token) return;
        const res = await axiosInstance.get('/api/bookings/my-bookings');
        if (res.data.success) {
          setBookings(res.data.bookings || []);
        } else {
          setError(res.data.message || 'Failed to fetch bookings.');
        }
      } catch (err) {
        console.error("Timeline error:", err);
        setError("Could not load bookings.");
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, [token, backendUrl]);

  const handleDownloadReceipt = (booking) => {
    generateBookingReceipt(booking, settings);
  };

  if (loading) {
    return (
      <div className="w-full max-w-3xl mx-auto mt-8 font-primary text-center">
        <div className="w-8 h-8 border-2 border-stone-100 border-t-orange-400 rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-xs text-stone-400 uppercase tracking-widest animate-pulse">Fetching your history...</p>
      </div>
    );
  }

  if (error || bookings.length === 0) {
    return (
      <div className="w-full max-w-3xl mx-auto mt-8 font-primary text-center pb-8 px-4">
        <h3 className="text-2xl text-gray-900 tracking-tight uppercase mb-8 border-b border-stone-100 pb-4 inline-block">Your Seva / Booking History</h3>
        <div className="bg-white/30 backdrop-blur-md border border-dashed border-white/60 rounded-md py-12">
            <p className="text-stone-550 uppercase tracking-widest text-xs font-semibold">{error || "No divine services found."}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-3xl mx-auto mt-12 mb-12 font-primary text-gray-800 px-4">
      <div className="flex items-center gap-4 mb-10 border-b border-stone-200 pb-6">
        <div className="w-1.5 h-8 bg-orange-400 rounded-md shadow-sm"></div>
        <h3 className="text-2xl text-gray-900 tracking-tight uppercase">Your Seva / Booking History</h3>
      </div>

      <div className="relative pl-6 sm:pl-8 border-l border-green-500/20 ml-2 sm:ml-4 space-y-10">
        {bookings.map((booking, index) => {
          const displayStatus = getBookingDisplayStatus(booking);
          const isCompleted = displayStatus === 'Completed' || displayStatus === 'Confirmed';
          const poojaNames = booking.poojas?.map(p => p.name).join(', ') || "Temple Seva";
          const templeName = booking.temple?.name || "Kadasiddeshwar Temple";
          const displayDate = booking.poojaDate ? new Date(booking.poojaDate).toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : 'Date not assigned';

          return (
            <motion.div
              key={booking._id || index}
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className="relative"
            >
              {/* Timeline Indicator */}
              <div className={`absolute w-3.5 h-3.5 rounded-full -left-[33px] sm:-left-[41px] top-1.5 border-2 border-white shadow-sm ring-1 ring-stone-100 ${isCompleted ? 'bg-green-500' : 'bg-orange-400'}`}></div>

              <div className="bg-liquid-glass-card p-6 rounded-md shadow-sm hover:scale-[1.01] transition-all duration-300 group flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div className="flex-1 space-y-3">
                  <div className="flex flex-wrap items-center gap-3">
                    <h4 className="text-lg text-gray-900 uppercase tracking-tight leading-none">{poojaNames}</h4>
                    <span className={`text-[10px] px-3 py-1 rounded-md border uppercase tracking-widest ${isCompleted ? 'bg-green-50 text-green-600 border-green-100' : 'bg-orange-50 text-orange-500 border-orange-100'}`}>
                      {displayStatus}
                    </span>
                  </div>
                  
                  <div>
                    <p className="text-[10px] text-stone-400 uppercase tracking-widest mb-1">Temple Destination</p>
                    <p className="text-sm text-orange-500 uppercase tracking-wide">{templeName}</p>
                  </div>

                  <div className="flex items-center text-stone-500 text-xs tracking-wide">
                    <svg className="w-4 h-4 mr-1.5 text-stone-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {displayDate}
                  </div>
                </div>

                <div className="shrink-0 flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-4 border-t sm:border-t-0 sm:border-l border-white/20 pt-4 sm:pt-0 sm:pl-6">
                   <div className="text-right hidden sm:block">
                      <p className="text-[10px] text-stone-400 uppercase tracking-widest">Offering</p>
                      <p className="text-xl text-gray-900 tabular-nums leading-tight">₹{booking.totalAmount}</p>
                   </div>
                   
                   <button 
                    onClick={() => handleDownloadReceipt(booking)}
                    className="flex items-center gap-2 text-[10px] bg-stone-900 text-white hover:bg-black uppercase tracking-widest transition-all px-4 py-2 rounded-md shadow-md shadow-stone-200 active:scale-95"
                   >
                     <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                     </svg>
                     Receipt
                   </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default BookingTimeline;
