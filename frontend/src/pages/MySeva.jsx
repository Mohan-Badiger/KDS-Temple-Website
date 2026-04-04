import React, { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import { getBookingDisplayStatus } from "../utils/bookingUtils";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const StatusBadge = ({ status }) => {
  const getStatusStyles = (s) => {
    const statusLower = s?.toLowerCase();
    if (statusLower === "completed" || statusLower === "approved") {
      return "bg-green-50 text-green-700 border-green-100";
    }
    if (statusLower === "pending") {
      return "bg-amber-50 text-amber-700 border-amber-100";
    }
    return "bg-orange-50 text-orange-700 border-orange-100";
  };

  return (
    <span className={`px-2.5 py-0.5 rounded-sm text-[10px] font-bold border uppercase tracking-widest ${getStatusStyles(status)}`}>
      {status}
    </span>
  );
};

const SkeletonCard = () => (
  <div className="bg-white p-6 rounded-md border border-stone-100 shadow-sm animate-pulse">
    <div className="h-4 bg-stone-100 rounded-sm w-1/2 mb-4"></div>
    <div className="h-3 bg-stone-50 rounded-sm w-3/4 mb-2"></div>
    <div className="flex justify-between items-center mt-6">
      <div className="h-6 bg-stone-100 rounded-sm w-20"></div>
      <div className="h-4 bg-stone-50 rounded-sm w-16"></div>
    </div>
  </div>
);

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
        setError("");

        const token = localStorage.getItem("token");
        if (!token) {
          setError("Your session has expired. Please log in again to view your dashboard.");
          setLoading(false);
          return;
        }

        const [bookingsRes, donationsRes] = await Promise.all([
          axiosInstance.get('/api/bookings/my-bookings').catch(err => ({ data: { success: false, message: err.message } })),
          axiosInstance.get('/api/donations/my-donations').catch(err => ({ data: { success: false, message: err.message } }))
        ]);

        if (bookingsRes.data.success) {
          setBookings(bookingsRes.data.bookings || []);
        }

        if (donationsRes.data.success) {
          setDonations(donationsRes.data.donations || []);
        }

      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Unable to connect to the pilgrimage service. Please refresh.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.05 } }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 5 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-20 font-primary">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-orange-100 border-t-orange-500 rounded-full animate-spin mb-4"></div>
          <p className="text-stone-400 text-xs font-semibold uppercase tracking-[0.2em] animate-pulse">Harmonizing your history</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-6 font-primary">
        <div className="text-center p-10 bg-white rounded-md shadow-sm border border-stone-100 max-w-md">
          <div className="text-orange-500 mb-4 text-3xl">🛕</div>
          <h2 className="text-xl font-bold text-gray-800 mb-2 tracking-tight">Access Denied</h2>
          <p className="text-sm text-stone-500 mb-8 leading-relaxed font-medium">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="w-full bg-orange-600 text-white py-3 rounded-md font-bold hover:bg-orange-700 transition-all shadow-sm active:scale-95"
          >
            Reconnect Now
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-16 font-primary bg-transparent min-h-screen">

      {/* ================= BOOKINGS SECTION ================= */}
      <section className="mb-24">
        <div className="flex flex-col sm:flex-row items-center justify-between mb-10 pb-8 border-b border-stone-100 gap-4">
          <div className="flex items-center gap-4">
            <span className="w-1.5 h-12 bg-orange-400 rounded"></span>
            <div className="space-y-0.5">
              <h2 className="text-2xl font-black text-gray-900">Booking History</h2>
              <p className="text-[11px] text-stone-400 font-bold uppercase tracking-widest opacity-80">Track your religious services</p>
            </div>
          </div>
          <div className="bg-orange-50/70 px-5 py-2 rounded-sm border border-orange-100">
            <span className="text-[11px] font-black text-orange-900 uppercase tracking-[0.1em]">
              {bookings.length} {bookings.length === 1 ? 'Record' : 'Records'}
            </span>
          </div>
        </div>

        {bookings.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20 bg-stone-50/50 border border-dashed border-stone-200 rounded-md p-10"
          >
            <h3 className="text-xl font-bold text-gray-800 mb-2 tracking-tight">Your Seva Journey Awaits</h3>
            <p className="text-xs text-stone-400 mb-8 max-w-sm mx-auto font-medium leading-relaxed tracking-wide">Book a pooja to receive divine blessings. Your history will manifest here once complete.</p>
            <button
              onClick={() => navigate("/pooja")}
              className="bg-orange-400 text-white px-10 py-3.5 rounded-sm font-black text-xs uppercase tracking-widest shadow-lg shadow-orange-100 hover:bg-orange-500 transition-all active:scale-95"
            >
              Begin Booking
            </button>
          </motion.div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 lg:grid-cols-2 gap-8"
          >
            {bookings.map((booking) => (
              <motion.div
                key={booking._id}
                variants={cardVariants}
                className="group bg-white p-7 rounded-md border border-stone-100 border-l-[6px] border-l-orange-600 shadow-sm transition-all flex flex-col hover:shadow-md hover:border-r hover:border-stone-200"
              >
                <div className="flex justify-between items-start mb-8">
                  <div className="space-y-1.5">
                    {booking.poojas?.map((pooja) => (
                      <h3 key={pooja._id} className="text-xl font-black text-gray-900 leading-tight tracking-tight group-hover:text-orange-700 transition-colors">
                        {pooja.name}
                      </h3>
                    ))}
                    <p className="text-[10px] text-stone-400 font-bold uppercase tracking-[0.15em] opacity-60">ID: #{booking.paymentId?.slice(-12) || 'N/A'}</p>
                  </div>
                  <StatusBadge status={getBookingDisplayStatus(booking)} />
                </div>

                <div className="grid grid-cols-2 gap-8 text-[11px] mt-auto pt-8 border-t border-stone-50">
                  <div className="space-y-2">
                    <p className="text-stone-400 font-extrabold uppercase tracking-widest text-[9px] opacity-70">Devotee Name</p>
                    <p className="text-gray-800 font-black text-base truncate italic">{booking.poojaInNameOf || "N/A"}</p>
                  </div>
                  <div className="space-y-2 text-right">
                    <p className="text-stone-400 font-extrabold uppercase tracking-widest text-[9px] opacity-70">Total Amount</p>
                    <p className="text-orange-700 font-black text-lg tabular-nums">₹{Number(booking.totalAmount).toLocaleString('en-IN')}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-stone-400 font-extrabold uppercase tracking-widest text-[9px] opacity-70">Ceremony Date</p>
                    <p className="text-gray-800 font-black">
                      {booking.poojaDate ? new Date(booking.poojaDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : "N/A"}
                    </p>
                  </div>
                  <div className="space-y-2 text-right">
                    <p className="text-stone-400 font-extrabold uppercase tracking-widest text-[9px] opacity-70">Assigned Time</p>
                    <p className={`font-black uppercase tracking-tighter ${booking.assignedTime ? "text-gray-800" : "italic text-stone-300 font-bold"}`}>
                      {booking.assignedTime || "Confirming..."}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </section>

      {/* ================= DONATIONS SECTION ================= */}
      <section>
        <div className="flex flex-col sm:flex-row items-center justify-between mb-10 pb-8 border-b border-stone-100 gap-4">
          <div className="flex items-center gap-4">
            <span className="w-1.5 h-12 bg-orange-400 rounded-sm shadow-sm"></span>
            <div className="space-y-0.5">
              <h2 className="text-2xl font-black text-gray-900">Support & Gifts</h2>
              <p className="text-[11px] text-stone-400 font-bold uppercase tracking-widest opacity-80">Contributions to temple welfare</p>
            </div>
          </div>
          <div className="bg-orange-50/70 px-5 py-2 rounded-sm border border-orange-100">
            <span className="text-[12px] font-black text-orange-900 uppercase tracking-[0.1em]">
              {donations.length} {donations.length === 1 ? 'Gift' : 'Gifts'}
            </span>
          </div>
        </div>

        {donations.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20 bg-stone-50/50 border border-dashed border-stone-200 rounded-md p-10"
          >
            <h3 className="text-xl font-bold text-gray-800 mb-2 tracking-tight">Manifest Your Impact ❤️</h3>
            <p className="text-xs text-stone-400 mb-8 max-w-sm mx-auto font-medium leading-relaxed tracking-wide">Your generosity fuel our spiritual initiatives. Make your first contribution today.</p>
            <button
              onClick={() => navigate("/donation")}
              className="bg-orange-400 text-white px-10 py-3.5 rounded-sm font-black text-xs uppercase tracking-widest shadow-lg shadow-orange-100 hover:bg-orange-500 transition-all active:scale-95"
            >
              Donate Now
            </button>
          </motion.div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
          >
            {donations.map((donation) => {
              let purposeMatch = "General Donation";
              let displayMsg = donation.message || "";

              if (displayMsg.includes("[Purpose:")) {
                const match = displayMsg.match(/\[Purpose: (.*?)\]/);
                if (match) purposeMatch = match[1];
                displayMsg = displayMsg.replace(/\[Purpose: .*?\]\s*/, '');
                displayMsg = displayMsg.replace(/\[Anonymous: .*?\]\s*/, '');
              }

              return (
                <motion.div
                  key={donation._id}
                  variants={cardVariants}
                  className="group bg-white p-7 rounded-md border border-stone-100 border-l-[6px] border-l-orange-600 shadow-sm flex flex-col justify-between hover:shadow-md hover:border-r hover:border-stone-200 transition-all"
                >
                  <div className="relative z-10 flex flex-col h-full">
                    <div className="flex justify-between items-start mb-6">
                      <span className="text-[9px] font-black text-orange-900 bg-orange-50 px-2.5 py-1 rounded-sm uppercase tracking-widest border border-orange-100">
                        {purposeMatch}
                      </span>
                      <span className="text-[9px] text-stone-400 font-extrabold uppercase tracking-widest tabular-nums italic opacity-80">
                        {new Date(donation.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                      </span>
                    </div>

                    <div className="mb-6">
                      <p className="text- stone-400 font-extrabold uppercase tracking-widest text-[9px] opacity-70 mb-1">Gift Amount</p>
                      <p className="text-3xl font-black text-gray-900 tracking-tighter tabular-nums group-hover:text-orange-700 transition-colors italic">₹{Number(donation.amount).toLocaleString('en-IN')}</p>
                    </div>

                    {displayMsg && (
                      <p className="text-stone-400 text-[11px] font-medium italic mb-8 line-clamp-2 leading-relaxed h-8 opacity-80">
                        "{displayMsg}"
                      </p>
                    )}

                    <div className="mt-auto pt-5 border-t border-stone-50 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-sm shadow-[0_0_8px_rgba(34,197,94,0.3)]"></div>
                        <span className="text-[9px] font-black text-stone-400 uppercase tracking-widest italic opacity-50">Verified Gift</span>
                      </div>
                      <div className="text-green-500/40 group-hover:text-green-500/60 transition-colors">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </section>

    </div>
  );
};

export default MySeva;
