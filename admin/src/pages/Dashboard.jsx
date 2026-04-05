import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { backendUrl } from "../App";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, AreaChart, Area
} from "recharts";
import {
  DollarSign, Landmark, Calendar, ShoppingBag, TrendingUp,
  Filter, Download, FileText, ChevronRight, Search, Gift, User
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { toast } from "react-toastify";

const COLORS = ["#f97316", "#fb923c", "#fdba74", "#fed7aa", "#ffedd5"];

const Dashboard = () => {
  const [summary, setSummary] = useState({
    totalRevenue: 0,
    poojaRevenue: 0,
    donationRevenue: 0,
    todayRevenue: 0,
    thisMonthRevenue: 0,
    totalBookings: 0,
    totalDonors: 0,
    totalUsers: 0,
    newUsersMonth: 0,
    totalUserAmount: 0,
  });
  const [analytics, setAnalytics] = useState({ templeAnalytics: [], poojaAnalytics: [] });
  const [dailyTrend, setDailyTrend] = useState([]);
  const [monthlyTrend, setMonthlyTrend] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [donations, setDonations] = useState([]);
  const [temples, setTemples] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters State
  const [filters, setFilters] = useState({
    templeId: "",
    startDate: "",
    endDate: "",
  });

  const apiToken = localStorage.getItem("token");

  const fetchData = async () => {
    setLoading(true);
    try {
      const headers = { token: apiToken };
      const [summaryRes, analyticsRes, trendRes, templeRes, userStatsRes] = await Promise.all([
        axios.get(`${backendUrl}/api/reports/summary`, { headers }),
        axios.get(`${backendUrl}/api/reports/analytics`, { headers }),
        axios.get(`${backendUrl}/api/reports/trend`, { headers }),
        axios.get(`${backendUrl}/api/temple/all`, { headers }),
        axios.get(`${backendUrl}/api/user/admin/stats`, { headers })
      ]);

      if (summaryRes.data.success) {
        let updatedSummary = summaryRes.data.summary;
        if (userStatsRes.data.success) {
           updatedSummary = {
             ...updatedSummary,
             totalUsers: userStatsRes.data.stats.totalUsers,
             newUsersMonth: userStatsRes.data.stats.newUsersMonth,
             totalUserAmount: userStatsRes.data.stats.totalAmount
           };
        }
        setSummary(updatedSummary);
      }
      if (analyticsRes.data.success) setAnalytics(analyticsRes.data);
      if (trendRes.data.success) {
        setDailyTrend(trendRes.data.dailyTrend);
        setMonthlyTrend(trendRes.data.monthlyTrend);
      }
      if (templeRes.data.success) setTemples(templeRes.data.temples);

      // Fetch initial transactions
      await fetchTransactions();

    } catch (error) {
      console.error("Dashboard error:", error);
      toast.error("Failed to load divine analytics.");
    } finally {
      setLoading(false);
    }
  };

  const fetchTransactions = async () => {
    try {
      const params = new URLSearchParams(filters).toString();
      const res = await axios.get(`${backendUrl}/api/reports/transactions?${params}`, {
        headers: { token: apiToken }
      });
      if (res.data.success) {
        setTransactions(res.data.transactions);
        setDonations(res.data.donations || []);
      }
    } catch (error) {
      toast.error("Failed to update transaction list.");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Update table when filters change with a small delay for better UX
  useEffect(() => {
    if (!loading) fetchTransactions();
  }, [filters]);

  // Export to Excel
  const exportExcel = () => {
    const data = transactions.map(t => ({
      Date: new Date(t.date).toLocaleDateString(),
      Temple: t.temple,
      Pooja: t.pooja,
      Devotee: t.devotee,
      Amount: t.amount,
      "Payment ID": t.paymentId
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    
    // Add Donation Records Sheet section or separate sheet
    // For simplicity while maintaining data integrity, we append it after a gap
    const donationData = donations.map(d => ({
      Date: new Date(d.date).toLocaleDateString(),
      Temple: d.temple,
      Donor: d.donor,
      Phone: d.phone,
      Amount: d.amount,
      "Payment ID": d.paymentId
    }));

    XLSX.utils.sheet_add_aoa(worksheet, [[""], ["Donation Records"]], { origin: -1 });
    XLSX.utils.sheet_add_json(worksheet, donationData, { origin: -1, skipHeader: false });

    // Add Overall Summary
    XLSX.utils.sheet_add_aoa(worksheet, [
      [],
      ["FINANCIAL AUDIT SUMMARY"],
      ["Total Pooja Revenue", `Rs. ${summary.poojaRevenue}`],
      ["Total Donation Revenue", `Rs. ${summary.donationRevenue}`],
      ["OVERALL GRAND TOTAL", `Rs. ${summary.totalRevenue}`],
      ["Report Generated", new Date().toLocaleString()]
    ], { origin: -1 });

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Financial Report");
    XLSX.writeFile(workbook, `Divine_Report_${new Date().toISOString().split('T')[0]}.xlsx`);
    toast.success("Excel audit file generated.");
  };

  // Export to PDF
  const exportPDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    
    // 1. HEADER - TRUST BRANDING
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.setTextColor(249, 115, 22); // Orange-500
    doc.text("KDS TEMPLE TRUST", pageWidth / 2, 25, { align: "center" });
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(115, 115, 115);
    doc.text("Divine Management System - Official Finance Audit Report", pageWidth / 2, 32, { align: "center" });
    
    doc.setDrawColor(245, 245, 245);
    doc.line(14, 38, pageWidth - 14, 38);
    
    // 2. METADATA
    doc.setFontSize(9);
    doc.text(`Generated On: ${new Date().toLocaleString()}`, 14, 45);
    doc.text(`Audit Period: ${filters.startDate || "Earliest"} - ${filters.endDate || "Latest"}`, 14, 50);

    // 3. TABLE 1 - POOJA TRANSACTIONS
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text("Seva & Pooja Collections", 14, 60);

    autoTable(doc, {
      startY: 65,
      head: [["Date", "Temple", "Service", "Devotee", "Amount", "Payment ID"]],
      body: transactions.map(t => [
        new Date(t.date).toLocaleDateString(),
        t.temple,
        t.pooja,
        t.devotee,
        `Rs. ${t.amount}`,
        t.paymentId
      ]),
      theme: 'grid',
      headStyles: { fillColor: [249, 115, 22] }, // Orange-500
      styles: { fontSize: 8, font: "helvetica" }
    });

    // 4. TABLE 2 - DONATION RECORDS
    let nextY = doc.lastAutoTable.finalY + 15;
    doc.setFontSize(12);
    doc.text("Donated People Details", 14, nextY);

    autoTable(doc, {
      startY: nextY + 5,
      head: [["Date", "Temple", "Donor", "Contact", "Amount", "Payment ID"]],
      body: donations.map(d => [
        new Date(d.date).toLocaleDateString(),
        d.temple,
        d.donor,
        d.phone,
        `Rs. ${d.amount}`,
        d.paymentId
      ]),
      theme: 'grid',
      headStyles: { fillColor: [31, 41, 55] }, // Dark Gray
      styles: { fontSize: 8, font: "helvetica" }
    });

    // 5. SUMMARY BOX
    nextY = doc.lastAutoTable.finalY + 15;
    if (nextY + 40 > doc.internal.pageSize.getHeight()) {
      doc.addPage();
      nextY = 30;
    }

    doc.setFillColor(250, 250, 249);
    doc.rect(14, nextY, pageWidth - 28, 35, 'F');
    
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    doc.text("FINANCIAL SUMMARY", 20, nextY + 10);
    doc.text(`Total Pooja Revenue: Rs. ${summary.poojaRevenue.toLocaleString()}`, 20, nextY + 18);
    doc.text(`Total Donation Revenue: Rs. ${summary.donationRevenue.toLocaleString()}`, 20, nextY + 25);
    
    doc.setFontSize(11);
    doc.setTextColor(249, 115, 22);
    doc.text(`GRAND TOTAL COLLECTION: Rs. ${summary.totalRevenue.toLocaleString()}`, 20, nextY + 33);

    // 6. FOOTER - DIGITAL SIGNATURE
    const footerY = doc.internal.pageSize.getHeight() - 40;
    doc.setDrawColor(229, 229, 229);
    doc.line(pageWidth - 70, footerY, pageWidth - 14, footerY);
    
    doc.setFontSize(10);
    doc.setTextColor(50, 50, 50);
    doc.text("Admin Digital Signature", pageWidth - 70, footerY + 8);
    
    doc.setFontSize(7);
    doc.setTextColor(150, 150, 150);
    doc.text("Digitally Verified by Divine Audit System", pageWidth - 70, footerY + 13);
    doc.text(`Doc ID: RT-${Date.now().toString(36).toUpperCase()}`, pageWidth - 70, footerY + 17);

    doc.save(`KDS_Finance_Report_${Date.now()}.pdf`);
    toast.success("Professional PDF report generated.");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          className="w-12 h-12 border-4 border-stone-200 border-t-orange-500 rounded-full"
        />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="pb-20 space-y-10 font-primary"
    >
      {/* Header & Main Export */}
      <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-stone-100 pb-8 gap-6">
        <div>
          <h1 className="text-4xl tracking-tight text-gray-900 uppercase font-normal">Dashboard</h1>
          <p className="text-[11px] text-stone-500 uppercase tracking-[0.3em] mt-2">Divine Revenue Monitoring & Audit System</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={exportExcel}
            className="flex items-center gap-2 px-5 py-2.5 border border-stone-200 text-[10px] uppercase tracking-widest text-stone-600 hover:bg-white hover:shadow-sm transition-all rounded-sm active:scale-95"
          >
            <Download size={14} className="text-stone-400" /> Excel
          </button>
          <button
            onClick={exportPDF}
            className="flex items-center gap-2 px-5 py-2.5 bg-gray-900 text-white text-[10px] uppercase tracking-widest hover:bg-orange-500 transition-all rounded-sm active:scale-95 shadow-lg"
          >
            <FileText size={14} /> PDF Report
          </button>
        </div>
      </div>

      {/* 1. Summary Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          { label: "Daily Revenue", val: summary.todayRevenue, icon: DollarSign, color: "bg-orange-50 border-orange-200 text-gray-800" },
          { label: "Monthly Revenue", val: summary.thisMonthRevenue, icon: Landmark, color: "bg-white border-stone-200" },
          { label: "Total Divine Collections", val: summary.totalUserAmount, icon: TrendingUp, color: "bg-white border-stone-200" },
          { label: "Total Registered Devotees", val: summary.totalUsers, icon: User, color: "bg-white border-stone-200", prefix: "" },
          { label: "New Devotees (This Month)", val: summary.newUsersMonth, icon: User, color: "bg-white border-stone-200", prefix: "" },
          { label: "Donation/Pooja Split", val: summary.poojaRevenue, icon: Gift, color: "bg-white border-stone-200" },
        ].map((card, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`p-6 rounded-sm flex flex-col justify-between h-40 group border transition-all ${card.color} ${card.color.includes('bg-white') ? 'hover:border-orange-200' : ''}`}
          >
            <div className="flex justify-between items-start">
              <span className={`text-[9px] uppercase tracking-[0.3em] ${card.color === 'bg-gray-900 text-white' ? 'text-stone-400' : 'text-stone-400'}`}>{card.label}</span>
              <card.icon size={18} className={card.color === 'bg-gray-900 text-white' ? 'text-orange-400' : 'text-orange-400'} />
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-normal tabular-nums">{card.prefix !== undefined ? card.prefix : '₹'}{card.val.toLocaleString('en-IN')}</span>
              <span className="text-[10px] uppercase tracking-widest opacity-40 ml-1">{card.prefix === "" ? "Users" : "INR"}</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* 2. Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Daily Revenue Line Chart */}
        <div className="bg-white border border-stone-100 p-8 rounded-sm space-y-6 shadow-sm">
          <div className="flex justify-between items-center">
            <h3 className="text-xs uppercase tracking-widest text-stone-400">Daily Revenue Growth</h3>
            <span className="text-[10px] bg-green-50 text-green-600 px-2 py-1 uppercase font">Daily Stream</span>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dailyTrend}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f5f5f5" />
                <XAxis dataKey="name" fontSize={10} axisLine={false} tickLine={false} tick={{ fill: '#a8a29e' }} />
                <YAxis fontSize={10} axisLine={false} tickLine={false} tick={{ fill: '#a8a29e' }} tickFormatter={(v) => `₹${v / 1000}k`} />
                <Tooltip
                  contentStyle={{ border: 'none', borderRadius: '4px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontSize: '11px' }}
                  formatter={(v) => [`₹${v.toLocaleString()}`, 'Daily Income']}
                />
                <Line type="monotone" dataKey="revenue" stroke="#f97316" strokeWidth={2} dot={{ r: 3, fill: '#f97316' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Monthly Revenue Line Chart */}
        <div className="bg-white border border-stone-100 p-8 rounded-sm space-y-6 shadow-sm">
          <div className="flex justify-between items-center">
            <h3 className="text-xs uppercase tracking-widest text-stone-400">Monthly Revenue Comparison</h3>
            <span className="text-[10px] bg-orange-50 text-orange-600 px-2 py-1 uppercase font">MoM Insights</span>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyTrend}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f5f5f5" />
                <XAxis dataKey="name" fontSize={10} axisLine={false} tickLine={false} tick={{ fill: '#a8a29e' }} />
                <YAxis fontSize={10} axisLine={false} tickLine={false} tick={{ fill: '#a8a29e' }} tickFormatter={(v) => `₹${v / 1000}k`} />
                <Tooltip
                  contentStyle={{ border: 'none', borderRadius: '4px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontSize: '11px' }}
                  formatter={(v) => [`₹${v.toLocaleString()}`, 'Monthly Revenue']}
                />
                <Line type="monotone" dataKey="revenue" stroke="#f97316" strokeWidth={2} dot={{ r: 4, fill: '#f97316' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* 3. Breakdown Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Temple Breakdown Pie Chart */}
        <div className="bg-white border border-stone-100 p-8 rounded-sm space-y-6 shadow-sm">
          <h3 className="text-xs uppercase tracking-widest text-stone-400">Temple Revenue Breakdown</h3>
          <div className="flex flex-col md:flex-row items-center gap-8 h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={analytics.templeAnalytics}
                  innerRadius={45}
                  outerRadius={65}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {analytics.templeAnalytics.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ border: 'none', borderRadius: '4px', fontSize: '11px' }}
                  formatter={(v) => [`₹${v.toLocaleString()}`, 'Total Revenue']}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-col gap-3 w-full md:w-48 pr-2">
              {analytics.templeAnalytics.map((entry, index) => (
                <div key={index} className="flex items-center justify-between group gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                    <span className="text-[9px] text-stone-600 uppercase tracking-tight truncate max-w-[100px]">{entry.name}</span>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-[10px] font-bold tabular-nums text-gray-900 leading-none">₹{entry.value.toLocaleString()}</span>
                    <span className="text-[8px] opacity-40 tabular-nums">
                      {((entry.value / summary.totalRevenue) * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Pooja Performance Bar Chart */}
        <div className="bg-white border border-stone-100 p-8 rounded-sm shadow-sm">
          <h3 className="text-xs uppercase tracking-widest text-stone-400 mb-8">Pooja Service Analytics</h3>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analytics.poojaAnalytics} layout="vertical" margin={{ left: 10, right: 30 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f8fafc" />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" fontSize={9} axisLine={false} tickLine={false} width={120} tick={{ fill: '#475569' }} />
                <Tooltip
                  contentStyle={{ border: 'none', borderRadius: '4px', fontSize: '11px' }}
                  cursor={{ fill: '#f8fafc' }}
                  formatter={(v) => [`₹${v.toLocaleString()}`, 'Revenue']}
                />
                <Bar dataKey="revenue" fill="#f97316" radius={[0, 4, 4, 0]} barSize={15} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* 4. Controls & Transactions */}
      <div className="space-y-6">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6 bg-stone-50/50 p-6 rounded-sm border border-stone-100">
          <div className="flex items-center gap-4 text-[10px] uppercase tracking-widest text-stone-400">
            <Filter size={14} /> Global Filters
          </div>
          <div className="flex flex-wrap items-center gap-4 w-full lg:w-auto">
            <div className="flex flex-col gap-1.5 flex-1 min-w-[200px]">
              <label className="text-[9px] uppercase tracking-[0.2em] text-stone-400 ml-1">Specific Temple</label>
              <select
                value={filters.templeId}
                onChange={(e) => setFilters({ ...filters, templeId: e.target.value })}
                className="bg-white border border-stone-100 px-4 py-2.5 text-xs outline-none focus:border-orange-400 transition-all rounded-sm cursor-pointer"
              >
                <option value="">All Temples</option>
                {temples.map(t => <option key={t._id} value={t._id}>{t.name}</option>)}
              </select>
            </div>
            <div className="flex flex-col gap-1.5 flex-1 min-w-[150px]">
              <label className="text-[9px] uppercase tracking-[0.2em] text-stone-400 ml-1">Start Date</label>
              <input
                type="date"
                value={filters.startDate}
                onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
                className="bg-white border border-stone-100 px-4 py-2 text-xs outline-none focus:border-orange-400 transition-all rounded-sm"
              />
            </div>
            <div className="flex flex-col gap-1.5 flex-1 min-w-[150px]">
              <label className="text-[9px] uppercase tracking-[0.2em] text-stone-400 ml-1">End Date</label>
              <input
                type="date"
                value={filters.endDate}
                onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
                className="bg-white border border-stone-100 px-4 py-2 text-xs outline-none focus:border-orange-400 transition-all rounded-sm"
              />
            </div>
            <button
              onClick={() => setFilters({ templeId: "", startDate: "", endDate: "" })}
              className="mt-5 px-4 py-2 text-[9px] uppercase tracking-widest text-orange-500 hover:text-orange-600"
            >
              Clear All
            </button>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="bg-white border border-stone-100 rounded-sm overflow-hidden shadow-sm">
          <div className="p-6 border-b border-stone-50 flex justify-between items-center">
            <h3 className="text-xs uppercase tracking-[0.2em] font-medium text-gray-900">Completed Data Stream</h3>
            <span className="text-[10px] text-stone-400 tabular-nums">{transactions.length} Records Found</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-stone-50/50 text-[10px] uppercase tracking-widest text-stone-500 border-b border-stone-100">
                <tr>
                  <th className="px-6 py-4 font-normal">Divine Date</th>
                  <th className="px-6 py-4 font-normal">Temple</th>
                  <th className="px-6 py-4 font-normal">Pooja Service</th>
                  <th className="px-6 py-4 font-normal">Devotee Name</th>
                  <th className="px-6 py-4 font-normal">Total Amount</th>
                  <th className="px-6 py-4 font-normal">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-50">
                {transactions.map((t, idx) => (
                  <tr key={idx} className="hover:bg-stone-50/20 transition-all group">
                    <td className="px-6 py-5 text-[11px] tabular-nums text-stone-400 font-normal">
                      {new Date(t.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-5 text-[11px] uppercase tracking-tight text-gray-900">{t.temple}</td>
                    <td className="px-6 py-5 text-[11px] uppercase tracking-tight text-orange-500">{t.pooja}</td>
                    <td className="px-6 py-5 text-[11px] text-gray-600">{t.devotee}</td>
                    <td className="px-6 py-5 text-[11px] tabular-nums font-bold text-gray-900">₹{t.amount.toLocaleString()}</td>
                    <td className="px-6 py-5">
                      <span className="text-[8px] uppercase tracking-widest bg-green-50 text-green-600 px-2 py-1 rounded-sm border border-green-100">Completed</span>
                    </td>
                  </tr>
                ))}
                {transactions.length === 0 && (
                  <tr>
                    <td colSpan="6" className="py-20 text-center font-normal italic opacity-40 text-stone-400 text-xs uppercase tracking-widest">
                      No financial records found for current filters
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Dashboard;
