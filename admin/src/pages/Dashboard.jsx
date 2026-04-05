import React, { useEffect, useState } from "react";
import axios from "axios";
import { backendUrl } from "../App";

const Dashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [poojaStats, setPoojaStats] = useState([]);
  
  const [donations, setDonations] = useState([]);
  const [annaprasads, setAnnaprasads] = useState([]);
  const [temples, setTemples] = useState([]);
  
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [bookingsRes, donationsRes, annaprasadsRes, templesRes] = await Promise.all([
          axios.get(`${backendUrl}/api/bookings/all`, { headers: { "Content-Type": "application/json" } }),
          axios.get(`${backendUrl}/api/donations/donations`),
          axios.get(`${backendUrl}/api/annaprasads/annaprasads`),
          axios.get(`${backendUrl}/api/temple/all`)
        ]);

        // Process Bookings
        if (bookingsRes.data && bookingsRes.data.bookings) {
          const allBookings = bookingsRes.data.bookings;
          const approvedBookings = allBookings.filter((b) => b.status === "approved" || b.status === "confirmed");
          setBookings(approvedBookings);

          const statsMap = {};
          approvedBookings.forEach((booking) => {
            booking.poojas.forEach((pooja) => {
              statsMap[pooja.name] = (statsMap[pooja.name] || 0) + 1;
            });
          });

          const statsArray = Object.entries(statsMap)
            .map(([name, count]) => ({ name, count }))
            .sort((a, b) => b.count - a.count);
          setPoojaStats(statsArray);
        }

        // Process Donations
        if (donationsRes.data && donationsRes.data.donations) {
          setDonations(donationsRes.data.donations);
        }

        // Process Annaprasads
        if (annaprasadsRes.data && annaprasadsRes.data.annaprasads) {
          setAnnaprasads(annaprasadsRes.data.annaprasads);
        }

        // Process Temples
        if (templesRes.data && templesRes.data.temples) {
          setTemples(templesRes.data.temples);
        }

      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const totalDonationAmount = donations.reduce((sum, d) => sum + Number(d.amount), 0);
  const totalAnnaprasadAmount = annaprasads.reduce((sum, a) => sum + Number(a.amount), 0);
  
  const recentDonations = [...donations].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5);
  const recentAnnaprasads = [...annaprasads].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5);

  return (
    <div className="sm:mt-6 font-primary text-gray-800">
      {loading ? (
        <div className="flex items-center justify-center py-20 font-primary">
          <div className="w-8 h-8 border-2 border-stone-200 border-t-orange-400 rounded-full animate-spin"></div>
        </div>
      ) : (
        <>
          {/* 📊 Summary Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            <div className="p-4 border rounded-l bg-white">
              <h3 className="text-sm text-gray-500 mb-1">Active Temples</h3>
              <p className="text-2xl">{temples.length}</p>
            </div>
            <div className="p-4 border rounded-l bg-white">
              <h3 className="text-sm text-gray-500 mb-1">Approved Bookings</h3>
              <p className="text-2xl">{bookings.length}</p>
            </div>
            <div className="p-4 border rounded-l bg-white">
              <h3 className="text-sm text-gray-500 mb-1">Total Poojas Booked</h3>
              <p className="text-2xl">
                {poojaStats.reduce((acc, curr) => acc + curr.count, 0)}
              </p>
            </div>
            <div className="p-4 border rounded-l bg-white">
              <h3 className="text-sm text-gray-500 mb-1">Top Booked Pooja</h3>
              <p className="text-xl">
                {poojaStats[0]?.name || "N/A"}
              </p>
            </div>
            <div className="p-4 border rounded-l bg-white">
              <h3 className="text-sm text-gray-500 mb-1">Total Donations</h3>
              <p className="text-2xl">₹{totalDonationAmount.toLocaleString('en-IN')}</p>
            </div>
            <div className="p-4 border rounded-l bg-white">
              <h3 className="text-sm text-gray-500 mb-1">Donation Counts</h3>
              <p className="text-2xl">{donations.length}</p>
            </div>
            <div className="p-4 border rounded-l bg-white">
              <h3 className="text-sm text-gray-500 mb-1">Annaprasad Revenue</h3>
              <p className="text-2xl">₹{totalAnnaprasadAmount.toLocaleString('en-IN')}</p>
            </div>
            <div className="p-4 border rounded-l bg-white">
              <h3 className="text-sm text-gray-500 mb-1">Annaprasad Counts</h3>
              <p className="text-2xl">{annaprasads.length}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-10">
            {/* 📋 Pooja Stats Table */}
            <div>
              <h2 className="text-xl mb-4 uppercase tracking-tight">Pooja Booking Stats</h2>
              <div className="bg-white border overflow-hidden">
                <table className="min-w-full text-sm text-left">
                  <thead className="bg-gray-100 text-xs uppercase tracking-wider text-gray-500 border-b">
                    <tr>
                      <th className="py-3 px-4">Pooja Name</th>
                      <th className="py-3 px-4">Total Bookings</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {poojaStats.map((stat, index) => (
                      <tr key={index} className="hover:bg-gray-50/50">
                        <td className="py-3 px-4">{stat.name}</td>
                        <td className="py-3 px-4">{stat.count}</td>
                      </tr>
                    ))}
                    {poojaStats.length === 0 && (
                       <tr><td colSpan="2" className="py-6 text-center text-gray-400">No pooja stats available</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* 📋 Recent Donations Table */}
            <div>
              <h2 className="text-xl mb-4 uppercase tracking-tight">Recent Donations</h2>
              <div className="bg-white border overflow-hidden">
                <table className="min-w-full text-sm text-left">
                  <thead className="bg-gray-100 text-xs uppercase tracking-wider text-gray-500 border-b">
                    <tr>
                      <th className="py-3 px-4">Donor</th>
                      <th className="py-3 px-4">Amount</th>
                      <th className="py-3 px-4 text-right">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {recentDonations.map((d) => (
                      <tr key={d._id} className="hover:bg-gray-50/50 border-b">
                        <td className="py-3 px-4 uppercase text-xs">{d.firstName} {d.lastName}</td>
                        <td className="py-3 px-4">₹{d.amount}</td>
                        <td className="py-3 px-4 text-right text-xs text-gray-500">
                          {new Date(d.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                        </td>
                      </tr>
                    ))}
                    {recentDonations.length === 0 && (
                       <tr><td colSpan="3" className="py-6 text-center text-gray-400">No donations found</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-10">
            {/* 📋 Recent Annaprasad Table */}
            <div>
              <h2 className="text-xl mb-4 uppercase tracking-tight">Recent Annaprasad</h2>
              <div className="bg-white border overflow-hidden">
                <table className="min-w-full text-sm text-left">
                  <thead className="bg-gray-100 text-xs uppercase tracking-wider text-gray-500 border-b">
                    <tr>
                      <th className="py-3 px-4">Donor</th>
                      <th className="py-3 px-4">Amount</th>
                      <th className="py-3 px-4 text-right">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {recentAnnaprasads.map((a) => (
                      <tr key={a._id} className="hover:bg-gray-50/50 border-b">
                        <td className="py-3 px-4 uppercase text-xs">{a.firstName} {a.lastName}</td>
                        <td className="py-3 px-4">₹{a.amount}</td>
                        <td className="py-3 px-4 text-right text-xs text-gray-500">
                          {new Date(a.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                        </td>
                      </tr>
                    ))}
                    {recentAnnaprasads.length === 0 && (
                       <tr><td colSpan="3" className="py-6 text-center text-gray-400">No records found</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* 📋 Approved Bookings Table */}
            <div className="overflow-x-auto w-full">
              <h2 className="text-xl mb-4 uppercase tracking-tight">Latest Bookings</h2>
              <div className="bg-white border overflow-hidden">
                <table className="min-w-full text-sm text-left">
                  <thead className="bg-gray-100 text-xs uppercase tracking-wider text-gray-500 border-b">
                    <tr>
                      <th className="py-3 px-4">User</th>
                      <th className="py-3 px-4">Poojas</th>
                      <th className="py-3 px-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {bookings.slice(0, 5).map((booking) => (
                      <tr key={booking._id} className="hover:bg-gray-50/50 border-b">
                        <td className="py-3 px-4">{booking.user?.name || "Anonymous"}</td>
                        <td className="py-3 px-4 text-xs uppercase text-orange-500">
                          {booking.poojas[0]?.name} {booking.poojas.length > 1 ? `+${booking.poojas.length - 1}` : ''}
                        </td>
                        <td className="py-3 px-4 uppercase text-[10px] text-green-600 tracking-widest">{booking.status}</td>
                      </tr>
                    ))}
                    {bookings.length === 0 && (
                       <tr><td colSpan="3" className="py-6 text-center text-gray-400">No bookings yet</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
