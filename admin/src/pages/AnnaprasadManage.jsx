import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AnnaprasadManage = () => {
  const [donations, setDonations] = useState([]);
  const [filteredDonations, setFilteredDonations] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter state
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    axios.get(`${backendUrl}/api/annaprasads/annaprasads`)
      .then(res => {
        setDonations(res.data.annaprasads);
        setFilteredDonations(res.data.annaprasads);
      })
      .catch(err => {
        console.error('Error fetching donations:', err);
      })
      .finally(() => setLoading(false));
  }, [backendUrl]);

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

  const years = Array.from(
    new Set(donations.map(d => new Date(d.createdAt).getFullYear()))
  ).sort((a, b) => b - a);

  const months = [
    { value: '1', label: 'Jan' }, { value: '2', label: 'Feb' }, { value: '3', label: 'Mar' },
    { value: '4', label: 'Apr' }, { value: '5', label: 'May' }, { value: '6', label: 'Jun' },
    { value: '7', label: 'Jul' }, { value: '8', label: 'Aug' }, { value: '9', label: 'Sep' },
    { value: '10', label: 'Oct' }, { value: '11', label: 'Nov' }, { value: '12', label: 'Dec' },
  ];

  if (loading) return (
    <div className="flex items-center justify-center py-20 font-primary">
       <div className="w-8 h-8 border-2 border-stone-200 border-t-orange-400 rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto py-6 font-primary text-gray-800">
      <div className="flex flex-col lg:flex-row justify-between lg:items-end mb-10 pb-6 border-b border-stone-100 gap-6">
        <div>
          <h2 className="text-2xl uppercase tracking-tight text-gray-900">Annaprasad Audit</h2>
          <p className="text-[10px] text-stone-400 uppercase tracking-widest mt-1">Registry of food donations</p>
        </div>

        <div className="grid grid-cols-2 gap-4 items-end">
          <div className="space-y-1">
            <label className="text-[9px] text-stone-400 uppercase tracking-widest ml-1">Year</label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="w-full text-xs p-2 border border-stone-200 outline-0 bg-white rounded-sm text-gray-700"
            >
              <option value="">All Years</option>
              {years.map(y => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>

          <div className="space-y-1 hidden md:block">
            <label className="text-[9px] text-stone-400 uppercase tracking-widest ml-1">Month</label>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="w-full text-xs p-2 border border-stone-200 outline-0 bg-white rounded-sm text-gray-700"
            >
              <option value="">All Months</option>
              {months.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
            </select>
          </div>
        </div>
      </div>

      {filteredDonations.length === 0 ? (
        <div className="text-center py-20 bg-stone-50 border border-dashed border-stone-200 rounded-sm">
          <p className="text-stone-400 uppercase tracking-widest text-xs">No contribution records match these filters.</p>
        </div>
      ) : (
        <div className="bg-white border border-stone-200 rounded-sm overflow-hidden shadow-sm">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-[9px] uppercase tracking-[0.2em] text-stone-400 border-b border-stone-100">
              <tr>
                <th className="px-6 py-4">Donor Details</th>
                <th className="px-6 py-4">Offering</th>
                <th className="px-6 py-4 text-right">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-50">
              {filteredDonations.map((d) => (
                <tr key={d._id} className="hover:bg-stone-50/50 transition-colors">
                  <td className="px-6 py-5">
                    <p className="text-sm text-gray-900 uppercase leading-none mb-1">{d.firstName} {d.lastName}</p>
                    <p className="text-[10px] text-stone-400 uppercase tracking-widest">{d.phone} • {d.email}</p>
                  </td>
                  <td className="px-6 py-5">
                    <p className="text-lg text-gray-900 tabular-nums">₹{Number(d.amount).toLocaleString('en-IN')}</p>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <p className="text-[10px] text-gray-800 uppercase tracking-tighter">
                      {new Date(d.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </p>
                    <p className="text-[9px] text-stone-400 uppercase tracking-widest mt-1">
                       {new Date(d.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AnnaprasadManage;
