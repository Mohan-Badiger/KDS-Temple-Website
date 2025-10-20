import React, { useEffect, useState } from "react";
import axios from "axios";

const MySeva = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        setError("");

        const token = localStorage.getItem("token");
        if (!token) {
          setError("You must be logged in to view your bookings.");
          setLoading(false);
          return;
        }

        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/bookings/my-bookings`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (res.data.success) {
          setBookings(res.data.bookings || []);
        } else {
          setError(res.data.message || "Failed to fetch bookings.");
        }
      } catch (err) {
        console.error("Error fetching bookings:", err);
        setError(err.response?.data?.message || "Server error. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  if (loading) {
    return <p className="text-center text-gray-600 py-10 animate-pulse">Loading your bookings...</p>;
  }

  if (error) {
    return <p className="text-center text-lg text-gray-800 py-10">{error}</p>;
  }

  return (
    <div className="overflow-x-auto px-6 py-10 font-primary">
      <h2 className="text-2xl font-semibold text-center mb-6 text-gray-800">
        My Seva Bookings
      </h2>

      {bookings.length === 0 ? (
        <p className="text-center text-gray-500">No bookings found.</p>
      ) : (
        <table className="min-w-full text-sm text-left text-gray-700">
          <thead className="bg-gray-100 text-xs uppercase tracking-wider text-gray-600">
            <tr>
              <th className="py-3 px-4">Poojas</th>
              <th className="py-3 px-4">Amount</th>
              <th className="py-3 px-4">Pooja In Name Of</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Pooja Date</th>
              <th className="py-3 px-4">Assigned Time</th>
              <th className="py-3 px-4">Receipt ID</th>
              <th className="py-3 px-4">Payment ID</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <tr
                key={booking._id}
                className="border-b hover:bg-gray-50 transition"
              >
                <td className="py-3 px-4">
                  {booking.poojas?.map((pooja) => (
                    <div key={pooja._id} className="text-gray-800">
                      {pooja.name}
                    </div>
                  )) || "N/A"}
                </td>
                <td className="py-3 px-4">₹{booking.totalAmount || 0}</td>
                <td className="py-3 px-4">{booking.poojaInNameOf || "N/A"}</td>
                <td
                  className={`py-3 px-4 font-medium ${
                    booking.status === "approved"
                      ? "text-green-600"
                      : booking.status === "pending"
                      ? "text-yellow-600"
                      : "text-red-600"
                  }`}
                >
                  {booking.status || "N/A"}
                </td>
                <td className="py-3 px-4">
                  {booking.poojaDate
                    ? new Date(booking.poojaDate).toLocaleDateString()
                    : "N/A"}
                </td>
                <td className="py-3 px-4">
                  {booking.assignedTime || "Not Assigned"}
                </td>
                <td className="py-3 px-4">{booking.receiptId || "N/A"}</td>
                <td className="py-3 px-4">{booking.paymentId || "N/A"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default MySeva;
