import React, { useContext, useEffect, useState } from 'react';
import { TempleContext } from '../context/TempleContext.jsx';
import { toast } from 'react-toastify';
import axiosInstance from '../utils/axiosInstance.js';
import Gallery1 from '../assets/Gallery-01.jpg';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import jsPDF from 'jspdf';

const Donation = () => {
  const { token } = useContext(TempleContext);
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // New State for Advanced Donation Flow
  const [purpose, setPurpose] = useState('General Donation');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [totalRaised, setTotalRaised] = useState(0);
  const goalAmount = 1000000; // Example goal: 10 Lakhs

  // Success state
  const [isSuccess, setIsSuccess] = useState(false);
  const [transactionData, setTransactionData] = useState(null);

  // Constants
  const DONATION_PURPOSES = [
    'General Donation',
    'Annadanam',
    'Temple Development',
    'Festival Support',
  ];

  const PRESET_AMOUNTS = [100, 500, 1000, 5000];

  useEffect(() => {
    if (!token) {
      toast.info('Please log in securely to make a donation');
      navigate('/login');
    }
  }, [token, navigate]);

  useEffect(() => {
    const fetchData = async () => {
      if (!token) return;
      try {
        // Fetch User Profile for Autofill
        const profileRes = await axiosInstance.get('/api/user/profile');
        if (profileRes.data.success && profileRes.data.user) {
          const user = profileRes.data.user;
          const nameParts = user.name ? user.name.split(' ') : [];
          setFirstName(nameParts[0] || '');
          setLastName(nameParts.slice(1).join(' ') || '');
          setPhone(user.phone || '');
        }

        // Fetch Total Donations for Progress Bar
        const donationsRes = await axiosInstance.get('/api/donations/donations');
        if (donationsRes.data.success) {
          const total = donationsRes.data.donations.reduce((sum, d) => sum + (Number(d.amount) || 0), 0);
          setTotalRaised(total);
        }
      } catch (error) {
        console.error("Error fetching donation pre-data:", error);
      }
    };
    fetchData();
  }, [token]);

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const getImpactMessage = (amt) => {
    const num = Number(amt);
    if (!num || num <= 0) return '';
    if (num < 500) return `₹${num} helps maintain daily temple cleanliness.`;
    if (num < 1000) return `₹${num} supports Annadanam for several devotees.`;
    if (num < 5000) return `₹${num} supports temple rituals for 1 whole day.`;
    return `₹${num} significantly aids in long-term temple development.`;
  };

  const generatePDF = (txData) => {
    const doc = new jsPDF();
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.setTextColor(249, 115, 22); // Orange primary
    doc.text("KADASIDDESHWAR TEMPLE, BANAHATTI", 105, 20, null, null, "center");

    doc.setFontSize(16);
    doc.setTextColor(50, 50, 50);
    doc.text("Official Donation Certificate", 105, 30, null, null, "center");

    doc.setLineWidth(0.5);
    doc.line(20, 35, 190, 35);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.text(`Date: ${new Date().toLocaleDateString('en-IN')}`, 20, 45);
    doc.text(`Receipt No: ${txData.paymentId || 'TXN-' + Math.floor(Math.random() * 1000000)}`, 130, 45);

    doc.setFont("helvetica", "italic");
    doc.setFontSize(14);
    doc.text(`"Heartfelt gratitude for your generous support."`, 105, 60, null, null, "center");

    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.text("Donor Information:", 20, 75);
    doc.text(`Name: ${isAnonymous ? 'Anonymous Devotee' : `${firstName} ${lastName}`}`, 25, 85);
    doc.text(`Purpose: ${purpose}`, 25, 95);
    if (!isAnonymous && phone) doc.text(`Phone: ${phone}`, 25, 105);

    doc.setFont("helvetica", "bold");
    doc.text(`Donation Amount: INR ${txData.amount}/-`, 20, 120);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text("May you and your family be blessed with peace and prosperity.", 105, 150, null, null, "center");
    doc.text("This is a computer-generated receipt and requires no signature.", 105, 160, null, null, "center");

    doc.save(`Temple_Donation_Receipt_${new Date().getTime()}.pdf`);
  };

  const handlePayment = async () => {
    if (!amount || amount < 1) {
      toast.error('Please enter a valid donation amount');
      return;
    }

    const isLoaded = await loadRazorpayScript();
    if (!isLoaded) {
      toast.error('Razorpay SDK failed to load.');
      return;
    }

    setLoading(true);

    try {
      const { data: order } = await axiosInstance.post(
        `/api/payment/create-order`,
        { amount: amount * 100 }
      );

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: 'Temple Donation',
        description: `Donation for ${purpose}`,
        order_id: order.id,
        handler: async function (response) {
          try {
            const verifyRes = await axiosInstance.post(
              `/api/payment/verify-payment`,
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }
            );

            if (verifyRes.data.message === 'Payment verified successfully') {
              const enrichedMessage = `[Purpose: ${purpose}] [Anonymous: ${isAnonymous ? 'Yes' : 'No'}] ${message || 'No additional message'}`;

              const donationData = {
                firstName: isAnonymous ? 'Anonymous' : firstName,
                lastName: isAnonymous ? 'Devotee' : lastName,
                phone,
                amount,
                message: enrichedMessage,
                date: new Date().toISOString(),
              };

              const donationRes = await axiosInstance.post(
                `/api/donations/donate`,
                donationData
              );

              if (donationRes.data.success) {
                toast.success('Donation Successful');

                setTransactionData({
                  paymentId: response.razorpay_payment_id,
                  amount,
                  purpose,
                  date: new Date(),
                });
                setIsSuccess(true);
              } else {
                toast.error(donationRes.data.message || 'Donation Failed');
              }
            } else {
              toast.error('Payment verification failed');
            }
          } catch (error) {
            toast.error('Error verifying payment.');
            console.error('Payment verify error:', error);
          } finally {
            setLoading(false);
          }
        },
        modal: {
          ondismiss: () => {
            setLoading(false);
            toast.info("Donation cancelled.");
          },
        },
        theme: {
          color: '#F97316',
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (err) {
      toast.error('Payment initiation failed.');
      console.error('Payment initiation error:', err);
      setLoading(false);
    }
  };

  const onSubmitHandler = (e) => {
    e.preventDefault();
    if (!isAnonymous && (!firstName || !lastName)) {
      toast.error('Please provide a name or select Anonymous.');
      return;
    }
    if (!phone || !amount || amount < 1) {
      toast.error('Please fill in required fields correctly.');
      return;
    }
    handlePayment();
  };

  const progressPercentage = Math.min((totalRaised / goalAmount) * 100, 100).toFixed(1);

  if (isSuccess && transactionData) {
    return (
      <div className="font-primary min-h-[70vh] flex flex-col items-center justify-center p-4 bg-transparent border-t border-gray-100">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-lg text-center"
        >
          <div className="w-16 h-16 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-medium text-gray-800 mb-2">Donation Successful</h2>
          <p className="text-gray-600 mb-8">Thank you for your generous contribution.</p>

          <div className="text-left mb-8 space-y-4 border-y border-gray-200 py-6">
            <div className="flex justify-between items-center text-base">
              <span className="text-gray-600">Amount</span>
              <span className="font-medium text-gray-900 border-b border-gray-200 border-dotted pb-1">₹{Number(transactionData.amount).toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between items-center text-base">
              <span className="text-gray-600">Purpose</span>
              <span className="font-medium text-gray-900 border-b border-gray-200 border-dotted pb-1">{transactionData.purpose}</span>
            </div>
            <div className="flex justify-between items-center text-base">
              <span className="text-gray-600">Transaction ID</span>
              <span className="font-medium text-gray-900 border-b border-gray-200 border-dotted pb-1 text-sm">{transactionData.paymentId}</span>
            </div>
            <div className="flex justify-between items-center text-base">
              <span className="text-gray-600">Date</span>
              <span className="font-medium text-gray-900 border-b border-gray-200 border-dotted pb-1">{transactionData.date.toLocaleDateString('en-IN')}</span>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <button
              onClick={() => generatePDF(transactionData)}
              className="w-full bg-primary text-white py-3 px-4 rounded-md font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Download Certificate
            </button>
            <button
              onClick={() => navigate('/myseva')}
              className="w-full border border-gray-300 text-gray-700 py-3 px-4 rounded-md font-medium hover:bg-gray-50 transition-colors"
            >
              View History
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="font-primary relative pb-20 bg-transparent min-h-screen">
      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white bg-opacity-80">
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="flex flex-col items-center"
          >
            <div className="w-10 h-10 border-2 border-gray-200 border-t-primary rounded-full animate-spin mb-4"></div>
            <div className="text-base text-gray-600">Processing...</div>
          </motion.div>
        </div>
      )}

      <div className="w-full max-w-5xl mx-auto px-4 py-8 sm:py-12 relative z-10">

        {/* Header Section */}
        <div className="mb-10 border-b border-gray-400 pb-8 text-center sm:text-left">
          <h2 className="text-2xl sm:text-3xl font-medium text-gray-900 mb-3">
            Make a Donation
          </h2>
          <p className="text-base text-gray-600 max-w-xl mx-auto sm:mx-0">
            Your generous contribution supports temple rituals, infrastructure development, and community welfare programs.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start">

          {/* Left Column: Image & Progress */}
          <div className="w-full lg:w-5/12 flex flex-col gap-8">
            <div className="overflow-hidden rounded-md border border-gray-200">
              <img
                src={Gallery1}
                alt="Temple Donation"
                className="w-full h-48 sm:h-64 lg:h-[350px] object-cover"
              />
            </div>

            <div className="border bg-gray-100 border-gray-200 p-5 rounded-md">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Temple Development Fund</h3>

              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600">Raised</span>
                <span className="text-base font-medium text-gray-900">₹{totalRaised.toLocaleString('en-IN')}</span>
              </div>

              <div className="w-full bg-orange-200 rounded-sm h-2 mb-3">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${progressPercentage}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="bg-primary h-full rounded-sm"
                ></motion.div>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-gray-600">{progressPercentage}% Achieved</span>
                <span className="text-gray-600">Goal: ₹{goalAmount.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          {/* Right Column: Donation Form */}
          <div className="w-full lg:w-7/12">
            <form onSubmit={onSubmitHandler} className="flex flex-col gap-8">

              {/* 1. Purpose Cards */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">1. Select Purpose</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {DONATION_PURPOSES.map(cat => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setPurpose(cat)}
                      className={`text-left px-4 py-3 border rounded-sm transition-colors text-base
                        ${purpose === cat
                          ? 'border-primary bg-orange-50 text-primary font-medium'
                          : 'border-gray-200 bg-transparent border-gray-300 text-gray-700'
                        }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div className="border-t border-gray-200"></div>

              {/* 2. Amount Selection */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">2. Select Amount</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                  {PRESET_AMOUNTS.map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setAmount(preset)}
                      className={`py-3 border rounded-sm text-base font-medium flex items-center justify-center gap-1 transition-all duration-150
                        ${Number(amount) === preset
                          ? 'border-primary bg-primary text-white'
                          : 'border-gray-300 text-gray-700 hover:border-primary'
                        }`}
                    >
                      <span className="text-sm leading-none -mt-[1px]">₹</span>
                      <span className="leading-none tabular-nums">
                        {preset.toLocaleString('en-IN')}
                      </span>
                    </button>
                  ))}
                </div>

                <div className="relative">
                  <div className="flex items-center border border-gray-300 rounded-sm px-3">
                    <span className="text-gray-600 text-sm leading-none mr-1">
                      ₹
                    </span>

                    <input
                      type="number"
                      placeholder="Enter custom amount"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="w-full py-3 text-base text-gray-900 bg-transparent outline-none leading-none tabular-nums"
                      min="1"
                      required
                    />
                  </div>

                  <AnimatePresence>
                    {getImpactMessage(amount) && (
                      <motion.p
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="text-sm text-gray-600 mt-2"
                      >
                        {getImpactMessage(amount)}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              <div className="border-t border-gray-200"></div>

              {/* 3. Donor Details */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">3. Your Details</h3>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      className="w-4 h-4 text-primary rounded-sm border-gray-300 focus:ring-primary"
                      checked={isAnonymous}
                      onChange={(e) => setIsAnonymous(e.target.checked)}
                    />
                    <span className="text-sm text-gray-600">Donate Anonymously</span>
                  </label>
                </div>

                <AnimatePresence>
                  {!isAnonymous && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden mb-4"
                    >
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <input
                          type="text"
                          placeholder="First Name"
                          value={firstName}
                          onChange={e => setFirstName(e.target.value.replace(/[^a-zA-Z\s]/g, ''))}
                          className="w-full text-base text-gray-900 py-3 px-4 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary bg-transparent"
                          required={!isAnonymous}
                        />
                        <input
                          type="text"
                          placeholder="Last Name"
                          value={lastName}
                          onChange={e => setLastName(e.target.value.replace(/[^a-zA-Z\s]/g, ''))}
                          className="w-full text-base text-gray-900 py-3 px-4 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary bg-transparent"
                          required={!isAnonymous}
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="flex flex-col gap-4">
                  <input
                    type="tel"
                    inputMode="numeric"
                    autoComplete="new-password"
                    name="phone"
                    placeholder="Phone Number"
                    value={phone}
                    onChange={(e) => {
                      const val = e.target.value
                        .replace(/^\+91/, '')   // ✅ remove +91 if autofilled/pasted
                        .replace(/\D/g, '')     // ✅ only digits
                        .slice(0, 10);          // ✅ max 10 digits

                      setPhone(val);
                    }}
                    className="w-full text-base text-gray-900 py-3 px-4 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary bg-transparent"
                    maxLength={10}
                    required
                  />
                  <textarea
                    placeholder="Message (Optional)"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full text-base text-gray-900 py-3 px-4 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary bg-transparent h-24 resize-none"
                  />
                </div>
              </div>

              {/* 4. CTA */}
              <button
                type="submit"
                className="w-full bg-primary text-base text-white font-medium py-4 rounded-sm hover:opacity-90 transition-opacity mt-2"
                disabled={loading}
              >
                Donate {amount ? `₹${Number(amount).toLocaleString('en-IN')}` : 'Now'}
              </button>

            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Donation;
