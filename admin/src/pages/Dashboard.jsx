import React, { useEffect, useState } from "react";
import axios from "axios";
import { backendUrl } from "../App";

const Dashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [poojaStats, setPoojaStats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await axios.get(`${backendUrl}/api/bookings/all`, {
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (res.data && res.data.bookings) {
          const allBookings = res.data.bookings;

          // Filter only approved bookings
          const approvedBookings = allBookings.filter(
            (b) => b.status === "approved"
          );

          setBookings(approvedBookings);

          // Prepare stats for the grid
          const statsMap = {};
          approvedBookings.forEach((booking) => {
            booking.poojas.forEach((pooja) => {
              statsMap[pooja.name] = (statsMap[pooja.name] || 0) + 1;
            });
          });

          const statsArray = Object.entries(statsMap)
            .map(([name, count]) => ({ name, count }))
            .sort((a, b) => b.count - a.count); // Sort by count desc

          setPoojaStats(statsArray);
        } else {
          console.error("No bookings data found in the response.");
        }
      } catch (error) {
        console.error("Error fetching booking data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  return (
    <div className="sm:p-6 font-primary">
      {loading ? (
        <p className="text-center">Loading data...</p>
      ) : (
        <>
          {/* 📊 Summary Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
            <div className="p-4 border rounded-l">
              <h3 className="text-sm text-gray-500 mb-1">Total Approved Bookings</h3>
              <p className="text-2xl ">{bookings.length}</p>
            </div>
            <div className="p-4 border rounded-l">
              <h3 className="text-sm text-gray-500 mb-1">Total Poojas Booked</h3>
              <p className="text-2xl ">
                {poojaStats.reduce((acc, curr) => acc + curr.count, 0)}
              </p>
            </div>
            <div className="p-4 border rounded-l">
              <h3 className="text-sm text-gray-500 mb-1">Top Booked Pooja</h3>
              <p className="text-xl ">
                {poojaStats[0]?.name || "N/A"} ({poojaStats[0]?.count || 0})
              </p>
            </div>
          </div>

          {/* 📋 Pooja Stats Table */}
          <div className="mb-10">
            <h2 className="text-xl mb-4">Pooja Booking Stats</h2>
            <table className="min-w-full text-sm text-left text-gray-700 overflow-hidden">
              <thead className="bg-gray-100 text-xs uppercase tracking-wider text-gray-600">
                <tr>
                  <th className="py-3 px-4">Pooja Name</th>
                  <th className="py-3 px-4">Bookings</th>
                </tr>
              </thead>
              <tbody>
                {poojaStats.map((stat, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">{stat.name}</td>
                    <td className="py-3 px-4">{stat.count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* 📋 Approved Bookings Table */}
          <div className="overflow-x-auto">
            <h2 className="text-xl mb-4">Approved Pooja Bookings</h2>
            <table className="min-w-full text-sm text-left text-gray-700">
              <thead className="bg-gray-100 text-xs uppercase tracking-wider text-gray-600">
                <tr>
                  <th className="py-3 px-4">User</th>
                  <th className="py-3 px-4">Poojas</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4">Pooja in Name Of</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Date</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking) => (
                  <tr key={booking._id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">{booking.user?.name || "Anonymous"}</td>
                    <td className="py-3 px-4">
                      {booking.poojas.map((pooja) => (
                        <div key={pooja._id}>{pooja.name}</div>
                      ))}
                    </td>
                    <td className="py-3 px-4">₹{booking.totalAmount}</td>
                    <td className="py-3 px-4">{booking.poojaInNameOf || "N/A"}</td>
                    <td className="py-3 px-4 capitalize">{booking.status}</td>
                    <td className="py-3 px-4">
                      {new Date(booking.assignedDate || booking.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
