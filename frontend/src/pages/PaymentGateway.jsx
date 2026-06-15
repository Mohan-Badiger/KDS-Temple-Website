import React, { useContext, useState, useEffect, useRef } from "react";
import { TempleContext } from "../context/TempleContext";
import axiosInstance from "../utils/axiosInstance";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import { formatDateToDDMMYYYY } from "../utils/stringUtils";

const decodeToken = (token) => {
  try {
    const payload = token.split(".")[1];
    return JSON.parse(atob(payload));
  } catch (error) {
    console.error("Failed to decode token:", error);
    return null;
  }
};

const PaymentGateway = () => {
  const {
    selectedPoojas, setSelectedPoojas,
    totalAmount,
    selectedTemple, setSelectedTemple,
    selectedDate, setSelectedDate,
    fetchTemples
  } = useContext(TempleContext);
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [poojaInNameOf, setPoojaInNameOf] = useState("");
  const navigate = useNavigate();
  const [isRazorpayOpen, setIsRazorpayOpen] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const calendarRef = useRef(null);

  useEffect(() => {
    if (isRazorpayOpen) {
      document.body.classList.add('razorpay-active');
    } else {
      document.body.classList.remove('razorpay-active');
    }
    return () => {
      document.body.classList.remove('razorpay-active');
    };
  }, [isRazorpayOpen]);

  const userToken = localStorage.getItem("token");
  const decoded = decodeToken(userToken);
  const userId = decoded?.id || decoded?._id;

  // Autofill login user name by default
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!userToken) return;
      try {
        const profileRes = await axiosInstance.get('/api/user/profile');
        if (profileRes.data.success && profileRes.data.user) {
          const user = profileRes.data.user;
          if (user.name) {
            setPoojaInNameOf(user.name);
          }
        }
      } catch (error) {
        console.error("Error fetching user profile for autofill:", error);
      }
    };
    fetchUserProfile();
  }, [userToken]);

  // Click outside listener for date picker calendar
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (calendarRef.current && !calendarRef.current.contains(event.target)) {
        setShowCalendar(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Calendar helper functions
  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year, month) => {
    return new Date(year, month, 1).getDay();
  };

  const generateCalendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();

    const totalDays = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);

    const days = [];

    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }

    for (let day = 1; day <= totalDays; day++) {
      const dayStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      days.push({
        day,
        dateString: dayStr,
      });
    }

    return days;
  };

  const formatDateFormatted = (dateStr) => {
    if (!dateStr) return "";
    const [year, month, day] = dateStr.split("-").map(Number);
    const date = new Date(year, month - 1, day);
    return date.toLocaleDateString("en-IN", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric"
    });
  };

  const isPrevMonthDisabled = () => {
    const today = new Date();
    return (
      currentMonth.getFullYear() === today.getFullYear() &&
      currentMonth.getMonth() === today.getMonth()
    );
  };

  const handlePrevMonth = () => {
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const isPastDate = (dateStr) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const [y, m, d] = dateStr.split("-").map(Number);
    const checkDate = new Date(y, m - 1, d);
    return checkDate < today;
  };

  useEffect(() => {
    if (!selectedTemple) {
      toast.error("Please select a temple first.");
      navigate("/temples");
      return;
    }

    // Force a fresh fetch of temple and pooja data to ensure we have latest availability
    const refreshData = async () => {
      try {
        // 1. Refresh temple list (which syncs selectedTemple in context)
        await fetchTemples();

        // 2. Refresh selected poojas data
        if (selectedPoojas.length > 0) {
          const { data } = await axiosInstance.get(`/api/pooja/all?templeId=${selectedTemple._id}`);
          if (data.success) {
            const updatedPoojas = selectedPoojas.map(selectedPooja => {
              const freshPooja = data.poojas.find(p => p._id === selectedPooja._id);
              return freshPooja || selectedPooja;
            });
            setSelectedPoojas(updatedPoojas);
          }
        }
      } catch (error) {
        console.error("Error refreshing divine availability:", error);
      }
    };
    refreshData();
  }, [selectedTemple?._id]); // Run when temple is confirmed, or on mount

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    if (!userToken || !userId) {
      toast.error("User not authenticated.");
      return;
    }

    if (!selectedPoojas || selectedPoojas.length === 0) {
      toast.error("Please select at least one pooja.");
      return;
    }

    if (!poojaInNameOf.trim()) {
      toast.error("Please provide a name for the pooja.");
      return;
    }

    if (!selectedDate) {
      toast.error("Please select a date for the pooja.");
      return;
    }

    // Check availability
    const templeBlocked = selectedTemple?.unavailableDates?.includes(selectedDate);

    const blockedPooja = selectedPoojas.find(pooja => {
      const config = pooja.temples.find(t => (t.templeId?._id || t.templeId) === selectedTemple._id);
      return config?.unavailableDates?.includes(selectedDate);
    });

    if (templeBlocked) {
      toast.error(`The ${selectedTemple.name} is closed on ${formatDateToDDMMYYYY(selectedDate)} for a festival/maintenance. Please select another divine date.`);
      return;
    }

    if (blockedPooja) {
      toast.error(`The service "${blockedPooja.name}" is restricted on this date. Please choose another date.`);
      return;
    }

    const selectedDateTime = new Date(selectedDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDateTime < today) {
      toast.error("Please select today or a future date.");
      return;
    }

    setLoading(true);

    const isLoaded = await loadRazorpayScript();
    if (!isLoaded) {
      toast.error("Razorpay SDK failed to load.");
      setLoading(false);
      return;
    }

    try {
      const { data: orderResponse } = await axiosInstance.post(
        `/api/payment/create-order`,
        { amount: Number(totalAmount) }
      );

      const order = orderResponse.order;

      const options = {
        key: (import.meta.env.VITE_RAZORPAY_KEY_ID || '').replace(/['"]/g, '').trim(),
        amount: order.amount,
        currency: order.currency,
        name: selectedTemple?.name || "Temple Pooja Booking",
        description: "Divine Pooja Booking Payment",
        order_id: order.id,
        handler: async function (response) {
          setIsRazorpayOpen(false);
          setVerifying(true);
          try {
            const verifyRes = await axiosInstance.post(
              `/api/payment/verify-payment`,
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }
            );

            if (verifyRes.data.success || verifyRes.data.message === "Payment verified successfully") {
              const [year, month, day] = selectedDate.split("-");
              const bookingData = {
                poojas: selectedPoojas.map((pooja) => pooja._id),
                templeId: selectedTemple._id,
                totalAmount,
                poojaInNameOf,
                poojaDate: `${day}-${month}-${year}`, // Backend expects dd-mm-yyyy
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              };

              const bookingRes = await axiosInstance.post(
                `/api/bookings/create`,
                bookingData
              );

              if (bookingRes.data.success) {
                toast.success("Booking confirmed successfully!");
                setSelectedPoojas([]);
                setSelectedDate("");
                navigate("/booking-confirmation");
              } else {
                toast.error("Booking failed.");
                setVerifying(false);
              }
            } else {
              toast.error("Payment verification failed.");
              setVerifying(false);
            }
          } catch (error) {
            console.error("Error verifying payment:", error);
            toast.error("Payment verification failed.");
            setVerifying(false);
          }
        },
        modal: {
          ondismiss: () => {
            setLoading(false);
            setIsRazorpayOpen(false);
            toast.info("Payment cancelled.");
          },
        },
        theme: {
          color: "#F97316",
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
      setIsRazorpayOpen(true);
    } catch (err) {
      setIsRazorpayOpen(false);
      console.error("Payment initiation failed:", err);
      toast.error("Payment initiation failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {verifying && (
        <div className="fixed inset-0 bg-white/90 backdrop-blur-sm z-[9999] flex flex-col items-center justify-center font-primary">
          <div className="w-16 h-16 border-4 border-stone-200 border-t-orange-500 rounded-full animate-spin mb-8 shadow-sm"></div>
          <h2 className="text-2xl text-gray-900 tracking-tight uppercase mb-2">Securing Your Booking</h2>
          <p className="text-xs text-stone-500 uppercase tracking-widest animate-pulse">Payment received. Harmonizing with temple records...</p>
        </div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-5xl mx-auto px-4 py-16 font-primary text-gray-800 relative"
      >
        <div className="flex items-center gap-4 mb-10 border-b border-stone-200 pb-8">
          <div className="w-1.5 h-10 bg-orange-400 rounded-sm shadow-sm"></div>
          <div>
            <p className="text-xs text-orange-500 uppercase tracking-widest mb-1">Finalize your</p>
            <h1 className="text-3xl text-gray-900 tracking-tight uppercase">Booking Details</h1>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Side: Summary */}
          <div className="lg:col-span-7 space-y-8">
            <div className="bg-liquid-glass-card rounded-md p-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 -mr-16 -mt-16 rounded-full opacity-50 pointer-events-none"></div>

              <h3 className="text-sm text-stone-900 uppercase tracking-widest mb-6 flex items-center gap-3 relative z-10">
                <span className="w-2 h-2 bg-orange-400 rounded-sm"></span>
                Selected Divine Services
              </h3>

              <div className="space-y-4 relative z-10">
                {selectedPoojas && selectedPoojas.map((pooja) => (
                  <div key={pooja._id} className="flex justify-between items-start border-b border-white/20 pb-4 last:border-0 last:pb-0">
                    <div>
                      <h4 className="text-gray-800 uppercase text-sm tracking-wide">{pooja.name}</h4>
                      <p className="text-[11px] text-stone-400 uppercase tracking-widest mt-1">{selectedTemple?.name}</p>
                    </div>
                    <p className="text-gray-900 text-sm tabular-nums">₹{pooja.price}</p>
                  </div>
                ))}
                <div className="pt-6 mt-6 border-t-2 border-dashed border-white/20 flex justify-between items-center">
                  <span className="text-xs text-stone-500 uppercase tracking-widest">Total Offering</span>
                  <span className="text-3xl text-orange-500 tabular-nums">₹{totalAmount}</span>
                </div>
              </div>
            </div>

            <div className="bg-orange-500/10 border border-orange-500/20 text-orange-600 rounded-md p-6 flex items-start gap-4 shadow-sm">
              <div className="w-10 h-10 bg-orange-100 text-orange-500 rounded-md flex items-center justify-center shrink-0">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <h4 className="text-xs text-orange-700 uppercase tracking-widest mb-1">Temple Location</h4>
                <p className="text-sm text-orange-800 tracking-wide">
                  {selectedTemple?.location}
                </p>
              </div>
            </div>
          </div>

          {/* Right Side: Inputs & Checkout */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-liquid-glass-card p-6 rounded-md space-y-6">
              <div className="space-y-2">
                <label className="text-xs text-stone-500 uppercase tracking-widest">Pooja in the name of</label>
                <input
                  type="text"
                  value={poojaInNameOf}
                  onChange={(e) => setPoojaInNameOf(e.target.value.replace(/[^a-zA-Z\s]/g, ''))}
                  className="w-full px-4 py-3 rounded-md outline-none transition-all text-gray-800 placeholder:text-stone-300 input-liquid-glass"
                  placeholder="Enter devotee name"
                />
              </div>

              <div className="space-y-2 relative" ref={calendarRef}>
                <label className="text-xs text-stone-500 uppercase tracking-widest">Select Divine Date</label>
                <button
                  type="button"
                  onClick={() => setShowCalendar(!showCalendar)}
                  className="w-full flex items-center justify-between px-4 py-3 border border-stone-200 rounded-md bg-white text-left text-gray-800 focus:border-orange-400 focus:ring-4 focus:ring-orange-50 transition-all cursor-pointer shadow-sm hover:border-stone-300"
                >
                  <span className={selectedDate ? "text-gray-800" : "text-stone-300"}>
                    {selectedDate ? formatDateFormatted(selectedDate) : "Select Divine Date"}
                  </span>
                  <svg className="w-5 h-5 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </button>

                <AnimatePresence>
                  {showCalendar && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 left-0 sm:left-auto sm:w-[320px] bottom-full mb-2 p-4 bg-white border border-stone-200 rounded-md shadow-xl z-50"
                    >
                      <div className="flex items-center justify-between mb-4 border-b border-stone-100 pb-2">
                        <button
                          type="button"
                          onClick={handlePrevMonth}
                          className="p-1.5 hover:bg-stone-100 rounded-full transition-colors text-stone-600 hover:text-orange-500 disabled:opacity-30 disabled:hover:bg-transparent"
                          disabled={isPrevMonthDisabled()}
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                          </svg>
                        </button>
                        <h4 className="font-cinzel text-xs font-semibold text-stone-900 tracking-wider">
                          {currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
                        </h4>
                        <button
                          type="button"
                          onClick={handleNextMonth}
                          className="p-1.5 hover:bg-stone-100 rounded-full transition-colors text-stone-600 hover:text-orange-500"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                      </div>

                      <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-2">
                        <div>Su</div>
                        <div>Mo</div>
                        <div>Tu</div>
                        <div>We</div>
                        <div>Th</div>
                        <div>Fr</div>
                        <div>Sa</div>
                      </div>

                      <div className="grid grid-cols-7 gap-1 text-center">
                        {generateCalendarDays().map((dayObj, idx) => {
                          if (!dayObj) {
                            return <div key={`empty-${idx}`} className="h-8 text-[11px]"></div>;
                          }

                          const isSelected = selectedDate === dayObj.dateString;
                          const isDisabled = isPastDate(dayObj.dateString) ||
                            selectedTemple?.unavailableDates?.includes(dayObj.dateString) ||
                            selectedPoojas.some(pooja => {
                              const config = pooja.temples?.find(t => (t.templeId?._id || t.templeId) === selectedTemple?._id);
                              return config?.unavailableDates?.includes(dayObj.dateString);
                            });

                          let buttonClass = "h-8 w-8 mx-auto flex items-center justify-center text-[11px] font-semibold rounded-full transition-all duration-150 ";
                          if (isDisabled) {
                            buttonClass += "text-stone-400/50 line-through bg-transparent cursor-not-allowed ";
                          } else if (isSelected) {
                            buttonClass += "bg-orange-500 text-white shadow-sm font-bold ";
                          } else {
                            buttonClass += "text-stone-700 hover:bg-orange-500/10 hover:text-orange-600 cursor-pointer ";
                          }

                          return (
                            <button
                              key={dayObj.dateString}
                              type="button"
                              disabled={isDisabled}
                              onClick={() => {
                                setSelectedDate(dayObj.dateString);
                                setShowCalendar(false);
                              }}
                              className={buttonClass}
                            >
                              {dayObj.day}
                            </button>
                          );
                        })}
                      </div>


                    </motion.div>
                  )}
                </AnimatePresence>
                <p className="text-[10px] text-stone-400 uppercase tracking-widest mt-2">Bookings are instantly confirmed.</p>
              </div>

              {/* Restricted Date Notice - Premium Styling */}
              {selectedDate && (selectedTemple?.unavailableDates?.includes(selectedDate) || selectedPoojas.some(p => {
                const config = p.temples.find(t => (t.templeId?._id || t.templeId) === selectedTemple._id);
                return config?.unavailableDates?.includes(selectedDate);
              })) && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="p-4 bg-red-50 border border-red-100 rounded-md flex gap-3 items-start"
                  >
                    <svg className="w-4 h-4 text-red-500 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <div>
                      <h4 className="text-[10px] text-red-700 uppercase tracking-widest font-bold mb-1">Divine Restriction Active</h4>
                      <p className="text-[10px] text-red-600 leading-relaxed uppercase tracking-widest opacity-80">
                        {selectedTemple?.unavailableDates?.includes(selectedDate)
                          ? `The temple is closed on ${formatDateToDDMMYYYY(selectedDate)} for maintenance or festival.`
                          : "Certain selected services are restricted on this date. Please select a different date to proceed."}
                      </p>
                    </div>
                  </motion.div>
                )}
            </div>

            <div className="pt-4 space-y-6">
              <button
                onClick={handlePayment}
                disabled={loading || verifying || (selectedDate && (selectedTemple?.unavailableDates?.includes(selectedDate) || selectedPoojas.some(p => {
                  const config = p.temples.find(t => (t.templeId?._id || t.templeId) === selectedTemple._id);
                  return config?.unavailableDates?.includes(selectedDate);
                })))}
                className={`w-full py-4 text-white text-xs uppercase tracking-widest rounded-md shadow-sm transition-all flex items-center justify-center gap-3 ${loading || verifying || (selectedDate && (selectedTemple?.unavailableDates?.includes(selectedDate) || selectedPoojas.some(p => {
                  const config = p.temples.find(t => (t.templeId?._id || t.templeId) === selectedTemple._id);
                  return config?.unavailableDates?.includes(selectedDate);
                })))
                  ? "bg-stone-300 cursor-not-allowed shadow-none"
                  : "bg-orange-500 hover:bg-orange-600 active:scale-[0.98]"
                  }`}
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    Pay Securely • ₹{totalAmount}
                  </>
                )}
              </button>

              {/* Secure Payment Badges section */}
              <div className="bg-white/10 border border-white/20 rounded-md p-5 flex flex-col gap-4">
                <div className="flex items-center justify-center gap-2 text-stone-600">
                  <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  <span className="text-xs font-medium uppercase tracking-widest text-stone-700">100% Secure Checkout</span>
                </div>
                <div className="flex items-center justify-center gap-5 text-stone-500">
                  <div className="flex items-center gap-1.5 text-[10px] tracking-wider uppercase"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg> Cards</div>
                  <div className="flex items-center gap-1.5 text-[10px] tracking-wider uppercase"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg> UPI</div>
                  <div className="flex items-center gap-1.5 text-[10px] tracking-wider uppercase"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" /></svg> NetBanking</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default PaymentGateway;