import React, { useEffect, useState } from 'react';
import axios from 'axios';

const DonationManage = () => {
  const [donations, setDonations] = useState([]);
  const [filteredDonations, setFilteredDonations] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter state
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/donations/donations`)
      .then(res => {
        setDonations(res.data.donations);
        setFilteredDonations(res.data.donations);
      })
      .catch(err => {
        console.error('Error fetching donations:', err);
      })
      .finally(() => setLoading(false));
  }, []);

  // Filter donations whenever month or year changes
  useEffect(() => {
    if (!selectedYear && !selectedMonth) {
      setFilteredDonations(donations);
      return;
    }

    const filtered = donations.filter(d => {
      const date = new Date(d.createdAt);
      const yearMatch = selectedYear ? date.getFullYear() === Number(selectedYear) : true;
      const monthMatch = selectedMonth ? (date.getMonth() + 1) === Number(selectedMonth) : true;
      return yearMatch && monthMatch;
    });

    setFilteredDonations(filtered);
  }, [selectedYear, selectedMonth, donations]);

  // Generate unique years from donations for the dropdown
  const years = Array.from(
    new Set(donations.map(d => new Date(d.createdAt).getFullYear()))
  ).sort((a, b) => b - a);

  // Months array
  const months = [
    { value: '1', label: 'January' },
    { value: '2', label: 'February' },
    { value: '3', label: 'March' },
    { value: '4', label: 'April' },
    { value: '5', label: 'May' },
    { value: '6', label: 'June' },
    { value: '7', label: 'July' },
    { value: '8', label: 'August' },
    { value: '9', label: 'September' },
    { value: '10', label: 'October' },
    { value: '11', label: 'November' },
    { value: '12', label: 'December' },
  ];

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="max-w-5xl mx-auto mt-6 font-primary">

      <div className='flex justify-between'>
        <h2 className="text-xl font-semibold mb-4">Donation Records</h2>

      {/* Filters */}
      <div className="flex space-x-4 mb-6 items-center">
        <div className='flex gap-2 items-center'>
          <label htmlFor="year" className="block text-sm font-medium text-gray-700">Year</label>
          <select
            id="year"
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="mt-1 block w-full border"
          >
            <option value="">All</option>
            {years.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>

        <div className='flex gap-2 items-center'>
          <label htmlFor="month" className="block text-sm font-medium text-gray-700">Month</label>
          <select
            id="month"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="mt-1 block w-full border"
          >
            <option value="">All</option>
            {months.map(month => (
              <option key={month.value} value={month.value}>{month.label}</option>
            ))}
          </select>
        </div>
      </div>
      </div>

      {filteredDonations.length === 0
        ? <p className="text-gray-500 text-center">No donations found for selected period.</p>
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
                {filteredDonations.map((d, i) => (
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

export default DonationManage;
