import React, { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import { getBookingDisplayStatus } from "../utils/bookingUtils";

const MySeva = () => {
  const [bookings, setBookings] = useState([]);
  const [donations, setDonations] = useState([]);
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

        const res = await axiosInstance.get('/api/bookings/my-bookings');
        if (res.data.success) {
          setBookings(res.data.bookings || []);
        } else {
          setError(res.data.message || "Failed to fetch bookings.");
        }

        try {
          const profileRes = await axiosInstance.get('/api/user/profile');
          if (profileRes.data.success && profileRes.data.user?.email) {
            const userEmail = profileRes.data.user.email;
            const donationsRes = await axiosInstance.get('/api/donations/donations');
            if (donationsRes.data.success) {
              const myDonations = donationsRes.data.donations.filter(d => d.email === userEmail);
              setDonations(myDonations);
            }
          }
        } catch (donErr) {
          console.error("Non-critical error fetching donations:", donErr);
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
      <h2 className="text-2xl text-center mb-6 text-gray-800">
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
                    getBookingDisplayStatus(booking) === "Completed"
                      ? "text-green-600"
                      : getBookingDisplayStatus(booking) === "Pending"
                      ? "text-yellow-600"
                      : "text-orange-600"
                  }`}
                >
                  {getBookingDisplayStatus(booking)}
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

      {/* Donations Section */}
      <h2 className="text-2xl text-center mt-12 mb-6 text-gray-800">
        My Donations
      </h2>

      {donations.length === 0 ? (
        <p className="text-center text-gray-500">No donations found.</p>
      ) : (
        <table className="min-w-full text-sm text-left text-gray-700 mt-4">
          <thead className="bg-orange-50 text-xs uppercase tracking-wider text-orange-800">
            <tr>
              <th className="py-3 px-4">Amount</th>
              <th className="py-3 px-4">Date</th>
              <th className="py-3 px-4">Purpose / Message</th>
              <th className="py-3 px-4">Receipt</th>
            </tr>
          </thead>
          <tbody>
            {donations.map((donation) => {
              // Extract Purpose if it exists in message
              let purposeMatch = "General Donation";
              let displayMsg = donation.message || "";
              if (displayMsg.includes("[Purpose:")) {
                  const match = displayMsg.match(/\[Purpose: (.*?)\]/);
                  if (match) purposeMatch = match[1];
                  displayMsg = displayMsg.replace(/\[Purpose: .*?\]\s*/, '');
                  displayMsg = displayMsg.replace(/\[Anonymous: .*?\]\s*/, '');
              }
              
              return (
              <tr
                key={donation._id}
                className="border-b hover:bg-gray-50 transition"
              >
                <td className="py-3 px-4 font-medium text-gray-800">₹{donation.amount || 0}</td>
                <td className="py-3 px-4">
                  {new Date(donation.createdAt).toLocaleDateString()}
                </td>
                <td className="py-3 px-4 text-gray-600">
                  <span className="font-medium text-orange-600 mr-2">{purposeMatch}</span>
                  {displayMsg && <span>- "{displayMsg}"</span>}
                </td>
                <td className="py-3 px-4">
                  <span className="text-green-600 text-xs bg-green-100 px-2 py-1 rounded-full">Paid</span>
                </td>
              </tr>
            )})}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default MySeva;
