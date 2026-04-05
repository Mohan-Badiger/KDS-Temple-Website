import React, { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const StatusBadge = ({ status }) => {
  const getStatusStyles = (s) => {
    const statusLower = s?.toLowerCase();
    if (statusLower === "confirmed" || statusLower === "completed" || statusLower === "approved") {
      return "bg-green-50 text-green-600 border-green-100";
    }
    if (statusLower === "pending") {
      return "bg-amber-50 text-amber-600 border-amber-100";
    }
    return "bg-orange-50 text-orange-500 border-orange-100";
  };

  return (
    <span className={`px-3 py-1 rounded-md text-[10px] border uppercase tracking-widest ${getStatusStyles(status)}`}>
      {status || "Confirmed"}
    </span>
  );
};

const MySeva = () => {
  const [bookings, setBookings] = useState([]);
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [bookingsRes, donationsRes] = await Promise.all([
          axiosInstance.get('/api/bookings/my-bookings'),
          axiosInstance.get('/api/donations/my-donations')
        ]);

        if (bookingsRes.data.success) {
          setBookings(bookingsRes.data.bookings || []);
        }
        if (donationsRes.data.success) {
          setDonations(donationsRes.data.donations || []);
        }
      } catch (err) {
        console.error("Error fetching history:", err);
        setError("Unable to load your spiritual history. Please refresh.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-20 font-primary flex flex-col items-center">
        <div className="w-10 h-10 border-2 border-stone-100 border-t-orange-400 rounded-full animate-spin mb-4"></div>
        <p className="text-xs text-stone-400 uppercase tracking-widest animate-pulse">Fetching your history...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-16 font-primary text-gray-800">
      
      {/* Bookings Section */}
      <section className="mb-20">
        <div className="flex items-center gap-4 mb-10 border-b border-stone-200 pb-8">
          <div className="w-1.5 h-10 bg-orange-400 rounded-md shadow-sm"></div>
          <div>
            <p className="text-xs text-orange-500 uppercase tracking-widest mb-1">Divine Services</p>
            <h1 className="text-3xl text-gray-900 tracking-tight uppercase">Booking History</h1>
          </div>
        </div>

        {bookings.length === 0 ? (
          <div className="text-center py-20 bg-stone-50 border border-stone-200 rounded-md">
            <p className="text-stone-500 uppercase tracking-widest text-xs mb-6">No poojas booked yet.</p>
            <button onClick={() => navigate("/temples")} className="text-xs text-orange-500 hover:text-orange-600 uppercase tracking-widest border border-orange-200 px-6 py-3 rounded-md transition-colors">Book Now →</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {bookings.map((booking, index) => (
              <motion.div
                key={booking._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white border border-stone-200 rounded-md p-6 shadow-sm hover:shadow-md transition-all border-l-4 border-l-orange-400"
              >
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-lg text-gray-900 uppercase tracking-tight mb-1">
                      {booking.poojas?.map(p => p.name).join(", ")}
                    </h3>
                    <p className="text-xs text-orange-500 uppercase tracking-widest">
                      {booking.temple?.name || "Temple Service"}
                    </p>
                  </div>
                  <StatusBadge status={booking.status} />
                </div>

                <div className="grid grid-cols-2 gap-6 pt-6 border-t border-stone-100">
                  <div>
                    <p className="text-[10px] text-stone-400 uppercase tracking-widest mb-1">Devotee</p>
                    <p className="text-sm text-gray-800 uppercase tracking-wide truncate">{booking.poojaInNameOf || "Devotee"}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-stone-400 uppercase tracking-widest mb-1">Offering</p>
                    <p className="text-sm text-gray-900 tabular-nums">₹{booking.totalAmount}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-stone-400 uppercase tracking-widest mb-1">Ceremony Date</p>
                    <p className="text-sm text-gray-800 tracking-wide">
                      {booking.poojaDate ? new Date(booking.poojaDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : "N/A"}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-stone-400 uppercase tracking-widest mb-1">Booking ID</p>
                    <p className="text-xs text-stone-400 uppercase tracking-wide">#{booking._id?.slice(-8)}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* Donations Section */}
      <section>
        <div className="flex items-center gap-4 mb-10 border-b border-stone-200 pb-8">
          <div className="w-1.5 h-10 bg-green-500 rounded-md shadow-sm"></div>
          <div>
            <p className="text-xs text-green-500 uppercase tracking-widest mb-1">Spiritual Gifts</p>
            <h1 className="text-3xl text-gray-900 tracking-tight uppercase">Donation History</h1>
          </div>
        </div>

        {donations.length === 0 ? (
          <div className="text-center py-20 bg-stone-50 border border-stone-200 rounded-md">
            <p className="text-stone-500 uppercase tracking-widest text-xs mb-6">No donations recorded yet.</p>
            <button onClick={() => navigate("/donation")} className="text-xs text-green-500 hover:text-green-600 uppercase tracking-widest border border-green-200 px-6 py-3 rounded-md transition-colors">Donate Now ❤️</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {donations.map((donation, index) => (
              <motion.div
                key={donation._id}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white border border-stone-200 rounded-md p-6 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start mb-6">
                  <div className="w-10 h-10 bg-green-50 text-green-500 rounded-md flex items-center justify-center">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-[10px] text-stone-400 uppercase tracking-widest">{new Date(donation.createdAt).toLocaleDateString()}</span>
                </div>
                
                <div className="mb-8">
                  <p className="text-xs text-green-600 uppercase tracking-widest mb-2">{donation.temple?.name || "Temple Welfare"}</p>
                  <p className="text-3xl text-gray-900 tabular-nums">₹{donation.amount}</p>
                </div>

                <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
                  <span className="text-[10px] text-stone-500 uppercase tracking-widest">Verified Contribution</span>
                  <div className="w-2 h-2 bg-green-400 rounded-md"></div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default MySeva;
