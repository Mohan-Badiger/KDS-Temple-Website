import React, { useEffect, useState } from 'react';
import axios from 'axios';

// Reusable custom dropdown to replace native OS select lists
const CustomSelect = ({ value, onChange, options, placeholder }) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectedOption = options.find(opt => opt.value === value);

  useEffect(() => {
    if (!isOpen) return;
    const handleClose = () => setIsOpen(false);
    window.addEventListener('click', handleClose);
    return () => window.removeEventListener('click', handleClose);
  }, [isOpen]);

  return (
    <div className="relative w-full select-none" onClick={(e) => e.stopPropagation()}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full text-xs px-3 py-2 border border-stone-200 rounded-sm bg-white text-gray-700 shadow-sm hover:border-stone-300 focus:border-orange-500 focus:outline-none transition-all duration-200 cursor-pointer text-left"
      >
        <span className="truncate">{selectedOption ? selectedOption.label : placeholder}</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#78716c"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`transition-transform duration-200 shrink-0 ml-2 ${isOpen ? 'rotate-180' : ''}`}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute z-50 mt-1 w-full bg-white border border-stone-200 rounded-sm shadow-lg max-h-60 overflow-y-auto py-1 animate-in fade-in duration-100">
          {options.map((opt, index) => (
            <button
              key={`${opt.value || ''}-${index}`}
              type="button"
              onClick={() => {
                onChange(opt.value);
                setIsOpen(false);
              }}
              className={`w-full text-left text-xs px-3 py-2 transition-colors duration-150 cursor-pointer ${opt.value === value
                  ? 'bg-orange-50 text-orange-600 font-medium'
                  : 'text-gray-700 hover:bg-stone-50'
                }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const DonationManage = () => {
  const [donations, setDonations] = useState([]);
  const [filteredDonations, setFilteredDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [temples, setTemples] = useState([]);

  // Filter state
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedTemple, setSelectedTemple] = useState('');

  const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [donationsRes, templesRes] = await Promise.all([
          axios.get(`${backendUrl}/api/donations/donations`),
          axios.get(`${backendUrl}/api/temple/list`)
        ]);

        if (donationsRes.data.success) {
          setDonations(donationsRes.data.donations);
          setFilteredDonations(donationsRes.data.donations);
        }

        if (templesRes.data.success) {
          setTemples(templesRes.data.temples);
        }
      } catch (err) {
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [backendUrl]);

  // Filter donations whenever month, year, or temple changes
  useEffect(() => {
    let filtered = donations;

    if (selectedYear) {
      filtered = filtered.filter(d => new Date(d.createdAt).getFullYear() === Number(selectedYear));
    }
    if (selectedMonth) {
      filtered = filtered.filter(d => (new Date(d.createdAt).getMonth() + 1) === Number(selectedMonth));
    }
    if (selectedTemple) {
      filtered = filtered.filter(d => d.temple === selectedTemple || d.temple?._id === selectedTemple);
    }

    setFilteredDonations(filtered);
  }, [selectedYear, selectedMonth, selectedTemple, donations]);

  const years = Array.from(
    new Set(donations.map(d => new Date(d.createdAt).getFullYear()))
  ).sort((a, b) => b - a);

  const months = [
    { value: '1', label: 'Jan' }, { value: '2', label: 'Feb' }, { value: '3', label: 'Mar' },
    { value: '4', label: 'Apr' }, { value: '5', label: 'May' }, { value: '6', label: 'Jun' },
    { value: '7', label: 'Jul' }, { value: '8', label: 'Aug' }, { value: '9', label: 'Sep' },
    { value: '10', label: 'Oct' }, { value: '11', label: 'Nov' }, { value: '12', label: 'Dec' },
  ];

  // Map options for custom select components
  const templeOptions = [
    { value: '', label: 'All Temples' },
    ...temples.map(t => ({ value: t._id, label: t.name }))
  ];

  const yearOptions = [
    { value: '', label: 'All Years' },
    ...years.map(y => ({ value: String(y), label: String(y) }))
  ];

  const monthOptions = [
    { value: '', label: 'All Months' },
    ...months.map(m => ({ value: m.value, label: m.label }))
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
          <h2 className="text-2xl uppercase tracking-tight text-gray-900">Donation</h2>
        </div>

        <div className="grid grid-cols-2 md:flex md:flex-row gap-3 items-end w-full lg:w-auto md:justify-end">
          <div className="space-y-1 w-full md:w-56">
            <label className="text-[9px] text-stone-400 uppercase tracking-widest ml-1 block">Temple</label>
            <CustomSelect
              value={selectedTemple}
              onChange={setSelectedTemple}
              options={templeOptions}
              placeholder="All Temples"
            />
          </div>

          <div className="space-y-1 w-full md:w-36">
            <label className="text-[9px] text-stone-400 uppercase tracking-widest ml-1 block">Year</label>
            <CustomSelect
              value={selectedYear}
              onChange={setSelectedYear}
              options={yearOptions}
              placeholder="All Years"
            />
          </div>

          <div className="space-y-1 hidden md:block md:w-36">
            <label className="text-[9px] text-stone-400 uppercase tracking-widest ml-1 block">Month</label>
            <CustomSelect
              value={selectedMonth}
              onChange={setSelectedMonth}
              options={monthOptions}
              placeholder="All Months"
            />
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
                <th className="px-6 py-4">Temple association</th>
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
                    <span className="text-[10px] text-orange-600 uppercase tracking-widest bg-orange-50 px-3 py-1 rounded-sm border border-orange-100">
                      {d.temple?.name || "General Welfare"}
                    </span>
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

export default DonationManage;
