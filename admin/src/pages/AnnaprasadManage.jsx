import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AnnaprasadManage = () => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/annaprasads/annaprasads`)
      .then(res => {
        setDonations(res.data.annaprasads);
      })
      .catch(err => {
        console.error('Error fetching donations:', err);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className=" max-w-5xl mx-auto mt-6 font-primary">
      <h2 className="text-xl font-semibold mb-4">Annaprasad Donation Records</h2>
      {donations.length === 0
        ? <p className="text-gray-500 text-center">No donations found.</p>
        : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-left text-gray-700">
              <thead className="bg-gray-100 text-xs uppercase tracking-wider text-gray-600">
                <tr>
                  <th className="px-4 py-4">SL NO</th>
                  <th className="px-4 py-4">Name</th>
                  <th className="px-4 py-4">Email</th>
                  <th className="px-4 py-4">Phone</th>
                  <th className="px-4 py-4">Amount</th>
                  <th className="px-4 py-4">Date</th>
                </tr>
              </thead>
              <tbody>
                {donations.map((d, i) => (
                  <tr key={d._id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-4">{i + 1}</td>
                    <td className="px-4 py-4">{d.firstName} {d.lastName}</td>
                    <td className="px-4 py-4">{d.email}</td>
                    <td className="px-4 py-4">{d.phone}</td>
                    <td className="px-4 py-4">₹{d.amount}</td>
                    <td className="px-4 py-4">
                      {new Date(d.createdAt).toLocaleString('en-IN')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      }
    </div>
  );
};

export default AnnaprasadManage;
