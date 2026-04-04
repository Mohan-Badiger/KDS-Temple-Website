import React, { useEffect, useState, useContext } from 'react';
import { motion } from 'framer-motion';
import axiosInstance from '../../utils/axiosInstance';
import { TempleContext } from '../../context/TempleContext';
import { getBookingDisplayStatus } from '../../utils/bookingUtils';

const BookingTimeline = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { token, backendUrl } = useContext(TempleContext);

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

  if (loading) {
    return (
      <div className="w-full max-w-3xl mx-auto mt-8 font-primary text-center">
        <p className="text-gray-600">Loading booking history...</p>
      </div>
    );
  }

  if (error || bookings.length === 0) {
    return (
      <div className="w-full max-w-3xl mx-auto mt-8 font-primary text-center pb-8">
        <h3 className="text-xl font-medium text-gray-800 mb-6 border-b pb-2 inline-block">Your Seva / Booking History</h3>
        <p className="text-gray-500">{error || "No bookings found."}</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-3xl mx-auto mt-10 mb-10 font-primary text-gray-800">
      <h3 className="text-xl sm:text-2xl font-medium text-gray-800 mb-8 border-b pb-2 inline-block">Your Seva / Booking History</h3>

      <div className="relative pl-6 sm:pl-8 border-l-2 border-orange-200 ml-2 sm:ml-4 space-y-8">
        {bookings.map((booking, index) => {
          const displayStatus = getBookingDisplayStatus(booking);
          const isCompleted = displayStatus === 'Completed';
          const poojaName = booking.poojas?.map(p => p.name).join(', ') || "Temple Seva";
          const displayDate = booking.poojaDate ? new Date(booking.poojaDate).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : 'Date not assigned';

          return (
            <motion.div
              key={booking._id || index}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="relative"
            >
              <div className={`absolute w-4 h-4 rounded-full -left-[33px] sm:-left-[41px] top-1.5 border-4 border-white shadow-sm ${isCompleted ? 'bg-green-500' : 'bg-orange-400'}`}></div>

              <div className="bg-white p-5 rounded-md shadow-sm border border-gray-100 hover:shadow-md transition-shadow group">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2 gap-2">
                  <h4 className="text-lg font-semibold group-hover:text-orange-600 transition-colors">{poojaName}</h4>
                  <span className={`text-xs px-3 py-1 rounded-full font-medium w-max ${isCompleted ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                    {displayStatus}
                  </span>
                </div>
                <div className="flex items-center text-gray-500 text-sm mt-2 font-medium">
                  <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {displayDate}
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
