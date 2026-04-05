import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { backendUrl } from "../App";

const RequestPooja = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await axios.get(`${backendUrl}/api/bookings/all`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBookings(res.data.bookings || []);
      } catch (err) {
        console.error("Error fetching bookings:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [token]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20 font-primary">
        <div className="w-8 h-8 border-2 border-stone-200 border-t-orange-400 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-6 font-primary text-gray-800">
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-stone-100">
        <div>
          <h2 className="text-2xl tracking-tight uppercase">Confirmed Bookings</h2>
          <p className="text-[10px] text-stone-400 uppercase tracking-widest mt-1">Live monitoring of divine services</p>
        </div>
        <div className="bg-orange-50 px-4 py-1 border border-orange-100 rounded-md">
           <span className="text-[10px] text-orange-500 uppercase tracking-widest">{bookings.length} Total</span>
        </div>
      </div>

      {bookings.length === 0 ? (
        <div className="text-center py-20 bg-stone-50 border border-dashed border-stone-200 rounded-md">
          <p className="text-stone-400 uppercase tracking-widest text-xs">No confirmed bookings to display.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {bookings.map((booking) => (
            <BookingCard key={booking._id} booking={booking} />
          ))}
        </div>
      )}
    </div>
  );
};

const BookingCard = ({ booking }) => {
  return (
    <div className="bg-white border border-stone-200 rounded-md p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
      <div className="space-y-4 flex-1">
        <div className="flex items-center gap-3">
          <span className="w-1.5 h-6 bg-orange-400 rounded-md"></span>
          <div>
            <h3 className="text-lg text-gray-900 uppercase tracking-wide leading-none">
              {booking.poojaInNameOf || booking.user?.name}
            </h3>
            <p className="text-[9px] text-stone-400 uppercase tracking-widest mt-1">
              {booking.user?.email} • ID: #{booking._id?.slice(-8)}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
          <div>
            <p className="text-[10px] text-stone-400 uppercase tracking-widest mb-1">Temple Location</p>
            <p className="text-xs text-orange-500 uppercase tracking-wide truncate">{booking.temple?.name || "Kadasiddeshwar Temple"}</p>
          </div>
          <div>
            <p className="text-[10px] text-stone-400 uppercase tracking-widest mb-1">Booked Poojas</p>
            <p className="text-xs text-gray-800 tracking-wide">
               {booking.poojas?.map(p => p.name).join(", ")}
            </p>
          </div>
          <div>
            <p className="text-[10px] text-stone-400 uppercase tracking-widest mb-1">Ritual Date</p>
            <p className="text-xs text-gray-800 tracking-wide">
               {booking.poojaDate ? new Date(booking.poojaDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : "N/A"}
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-end gap-2 shrink-0">
          <div className="text-right mb-2">
            <p className="text-[10px] text-stone-400 uppercase tracking-widest mb-1">Paid Offering</p>
            <p className="text-xl text-gray-900 tabular-nums">₹{booking.totalAmount}</p>
          </div>
          <span className="bg-green-50 text-green-600 border border-green-100 px-3 py-1 text-[10px] uppercase tracking-widest rounded-md">
            Confirmed
          </span>
      </div>
    </div>
  );
};

export default RequestPooja;
