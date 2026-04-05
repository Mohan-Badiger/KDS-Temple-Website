import React, { useEffect, useState } from "react";
import axios from "axios";
import { backendUrl } from "../App";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";

const TodaySeva = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, bookingId: null, bookingName: "" });
  const token = localStorage.getItem("token");

  const fetchTodayBookings = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/bookings/today`, {
        headers: { token },
      });
      if (data.success) {
        setBookings(data.bookings);
      }
    } catch (error) {
      console.error("Error fetching today's sevas:", error);
      toast.error("Failed to load today's schedule");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTodayBookings();
  }, []);

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      // Optimistic UI update
      setBookings((prev) =>
        prev.map((b) => (b._id === id ? { ...b, status: newStatus } : b))
      );

      const { data } = await axios.patch(
        `${backendUrl}/api/bookings/status/${id}`,
        { status: newStatus },
        { headers: { token } }
      );

      if (data.success) {
        toast.success(`Seva marked as ${newStatus}`);
      } else {
        fetchTodayBookings(); // Rollback on failure
      }
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update status");
      fetchTodayBookings(); // Rollback
    } finally {
      setConfirmModal({ isOpen: false, bookingId: null, bookingName: "" });
    }
  };

  const openConfirmModal = (id, name) => {
    setConfirmModal({ isOpen: true, bookingId: id, bookingName: name });
  };

  // Group bookings by temple
  const groupedBookings = bookings.reduce((acc, booking) => {
    const templeName = booking.temple?.name || "Kadasiddeshwar Temple";
    if (!acc[templeName]) acc[templeName] = [];
    acc[templeName].push(booking);
    return acc;
  }, {});

  const todayDate = new Date().toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
    weekday: "long",
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 font-primary">
        <div className="w-8 h-8 border-2 border-stone-200 border-t-orange-400 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-6 font-primary text-gray-800">
      {/* 1. Header Section */}
      <div className="flex flex-col sm:flex-row items-center justify-between mb-10 pb-6 border-b border-stone-100 gap-4">
        <div>
          <h2 className="text-3xl tracking-tight uppercase leading-none">Today's Seva</h2>
          <p className="text-[10px] text-stone-400 uppercase tracking-[0.2em] mt-2 italic">
            “Your schedule for today's poojas”
          </p>
        </div>
        <div className="flex flex-col items-end gap-1">
          <p className="text-xs text-gray-500 font-medium">{todayDate}</p>
          <div className="bg-orange-50 px-3 py-1 border border-orange-100 rounded-sm">
            <span className="text-[10px] text-orange-500 uppercase tracking-widest font-bold">
              {bookings.length} Total Sevas
            </span>
          </div>
        </div>
      </div>

      {bookings.length === 0 ? (
        <motion.div
           initial={{ opacity: 0, scale: 0.95 }}
           animate={{ opacity: 1, scale: 1 }}
           className="text-center py-24 bg-stone-50 border border-dashed border-stone-200 rounded-sm"
        >
          <p className="text-stone-400 uppercase tracking-widest text-sm mb-2">No Sevas Today 🙏</p>
          <p className="text-xs text-stone-400 font-light italic">Take rest or prepare for upcoming poojas</p>
        </motion.div>
      ) : (
        <div className="space-y-12">
          {Object.entries(groupedBookings).map(([templeName, sevas], templeIdx) => (
            <div key={templeName} className="space-y-6">
              {/* Temple Title */}
              <div className="flex items-center gap-4">
                <h3 className="text-xl text-gray-900 tracking-tight uppercase border-l-4 border-orange-400 pl-4 py-1">
                  {templeName}
                </h3>
                <div className="h-[1px] flex-grow bg-stone-100"></div>
                <span className="text-[10px] text-stone-400 bg-stone-50 px-2 py-0.5 rounded-sm border border-stone-100">
                  {sevas.length} {sevas.length === 1 ? "Pooja" : "Poojas"}
                </span>
              </div>

              {/* Grid of Pooja Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <AnimatePresence mode="popLayout">
                  {sevas.map((seva, idx) => (
                    <motion.div
                      key={seva._id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05, duration: 0.4 }}
                      whileHover={{ y: -4, transition: { duration: 0.2 } }}
                      className={`relative bg-white border rounded-sm p-6 flex flex-col gap-5 transition-all duration-300 ${
                        seva.status === "completed"
                          ? "border-green-200 opacity-70 bg-green-50/20 shadow-none grayscale-[0.3]"
                          : "border-stone-200 shadow-sm hover:border-orange-300 hover:shadow-md"
                      }`}
                    >
                      {/* Left Strip */}
                      <div
                        className={`absolute left-0 top-6 bottom-6 w-1 rounded-r-md ${
                          seva.status === "completed" ? "bg-green-400" : "bg-orange-400"
                        }`}
                      ></div>

                      <div className="flex justify-between items-start gap-4">
                        <div className="flex-grow">
                          <h4 className="text-lg text-gray-900 uppercase tracking-wide leading-tight mb-1">
                            {seva.poojaInNameOf}
                          </h4>
                          <p className="text-[10px] text-stone-400 uppercase tracking-widest">
                            ID: #{seva._id?.slice(-8)}
                          </p>
                        </div>
                        {seva.status === "completed" && (
                          <div className="bg-green-100 p-1.5 rounded-full">
                            <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-4 py-2 border-y border-stone-50">
                        <div>
                          <p className="text-[9px] text-stone-400 uppercase tracking-[0.2em] mb-1">Pooja Ritual</p>
                          <p className="text-sm text-gray-700 tracking-wide truncate">
                            {seva.poojas?.map((p) => p.name).join(", ")}
                          </p>
                        </div>
                        <div>
                          <p className="text-[9px] text-stone-400 uppercase tracking-[0.2em] mb-1">Time Preference</p>
                          <p className="text-sm text-gray-700 tracking-wide italic">
                            {seva.assignedTime || "Morning Seva"}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between mt-1">
                        <div className="flex items-center gap-2">
                           <div className={`w-2 h-2 rounded-full ${seva.status === 'completed' ? 'bg-green-400' : 'bg-orange-400 animate-pulse'}`}></div>
                           <p className="text-[10px] uppercase font-bold tracking-widest text-stone-500">
                             {seva.status}
                           </p>
                        </div>

                        {seva.status !== "completed" && (
                          <button
                            onClick={() => openConfirmModal(seva._id, seva.poojaInNameOf)}
                            className="text-[10px] text-gray-700 hover:text-white hover:bg-green-600 border border-stone-200 hover:border-green-600 px-5 py-2 rounded-sm transition-all duration-300 font-bold tracking-widest uppercase active:scale-95"
                          >
                            Mark Completed
                          </button>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modern Confirmation Modal */}
      <AnimatePresence>
        {confirmModal.isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setConfirmModal({ isOpen: false, bookingId: null, bookingName: "" })}
              className="fixed inset-0 bg-black/40 backdrop-blur-[2px] z-[999] flex items-center justify-center p-4"
            >
              {/* Modal Box */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white max-w-sm w-full border border-stone-200 rounded-sm shadow-2xl p-8"
              >
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-orange-50 rounded-full flex items-center justify-center mb-6">
                    <svg className="w-8 h-8 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  
                  <h3 className="text-2xl uppercase tracking-tight text-gray-900 mb-2">Confirm Completion?</h3>
                  <p className="text-sm text-stone-500 leading-relaxed font-light mb-8">
                    Are you sure you want to mark the seva for <strong className="font-bold text-gray-800">{confirmModal.bookingName}</strong> as completed? This action will update the status for the devotee.
                  </p>

                  <div className="grid grid-cols-2 gap-4 w-full">
                    <button
                      onClick={() => setConfirmModal({ isOpen: false, bookingId: null, bookingName: "" })}
                      className="w-full py-3 border border-stone-200 text-[10px] uppercase tracking-widest font-bold hover:bg-stone-50 rounded-sm transition-all active:scale-95"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleStatusUpdate(confirmModal.bookingId, "completed")}
                      className="w-full py-3 bg-green-600 text-white text-[10px] uppercase tracking-widest font-bold hover:bg-green-700 rounded-sm transition-all active:scale-95 shadow-sm"
                    >
                      Confirm
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TodaySeva;
