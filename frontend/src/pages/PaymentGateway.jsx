import React, { useContext, useState, useEffect } from "react";
import { TempleContext } from "../context/TempleContext";
import axiosInstance from "../utils/axiosInstance";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { motion } from "framer-motion";

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
  const { selectedPoojas, totalAmount, selectedTemple, selectedDate, setSelectedDate } = useContext(TempleContext);
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [poojaInNameOf, setPoojaInNameOf] = useState("");
  const navigate = useNavigate();
  
  const userToken = localStorage.getItem("token");
  const decoded = decodeToken(userToken);
  const userId = decoded?.id || decoded?._id;

  useEffect(() => {
    if (!selectedTemple) {
      toast.error("Please select a temple first.");
      navigate("/temples");
    }
  }, [selectedTemple, navigate]);

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
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: selectedTemple?.name || "Temple Pooja Booking",
        description: "Divine Pooja Booking Payment",
        order_id: order.id,
        handler: async function (response) {
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
              };

              const bookingRes = await axiosInstance.post(
                `/api/bookings/create`,
                bookingData
              );

              if (bookingRes.data.success) {
                toast.success("Booking confirmed successfully!");
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
        theme: {
          color: "#F97316",
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (err) {
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
          <p className="text-xs text-stone-500 uppercase tracking-widest animate-pulse">Payment received. Harmonizing with ashram records...</p>
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
            <div className="bg-white border border-stone-200 rounded-md p-8 shadow-sm relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-stone-50 -mr-16 -mt-16 rounded-full opacity-50 pointer-events-none"></div>
               
               <h3 className="text-sm text-stone-900 uppercase tracking-widest mb-6 flex items-center gap-3 relative z-10">
                 <span className="w-2 h-2 bg-orange-400 rounded-sm"></span>
                 Selected Divine Services
               </h3>
               
               <div className="space-y-4 relative z-10">
                 {selectedPoojas && selectedPoojas.map((pooja) => (
                   <div key={pooja._id} className="flex justify-between items-start border-b border-stone-100 pb-4 last:border-0 last:pb-0">
                     <div>
                       <h4 className="text-gray-800 uppercase text-sm tracking-wide">{pooja.name}</h4>
                       <p className="text-[11px] text-stone-400 uppercase tracking-widest mt-1">{selectedTemple?.name}</p>
                     </div>
                     <p className="text-gray-900 text-sm tabular-nums">₹{pooja.price}</p>
                   </div>
                 ))}
                 <div className="pt-6 mt-6 border-t-2 border-dashed border-stone-200 flex justify-between items-center">
                   <span className="text-xs text-stone-500 uppercase tracking-widest">Total Offering</span>
                   <span className="text-3xl text-orange-500 tabular-nums">₹{totalAmount}</span>
                 </div>
               </div>
            </div>

            <div className="bg-orange-50/50 border border-orange-100 rounded-md p-6 flex items-start gap-4 shadow-sm">
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
             <div className="bg-white border border-stone-200 p-6 rounded-md shadow-sm space-y-6">
                <div className="space-y-2">
                  <label className="text-xs text-stone-500 uppercase tracking-widest">Pooja in the name of</label>
                  <input
                    type="text"
                    value={poojaInNameOf}
                    onChange={(e) => setPoojaInNameOf(e.target.value.replace(/[^a-zA-Z\s]/g, ''))}
                    className="w-full px-4 py-3 border border-stone-200 rounded-md outline-none focus:border-orange-400 focus:ring-4 focus:ring-orange-50 transition-all text-gray-800 placeholder:text-stone-300"
                    placeholder="Enter devotee name"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs text-stone-500 uppercase tracking-widest">Select Divine Date</label>
                  <div className="relative">
                    <input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      min={new Date().toISOString().split("T")[0]}
                      className="w-full px-4 py-3 border border-stone-200 rounded-md outline-none focus:border-orange-400 focus:ring-4 focus:ring-orange-50 transition-all text-gray-800 appearance-none"
                    />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-stone-400">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  </div>
                  <p className="text-[10px] text-stone-400 uppercase tracking-widest mt-2">Bookings are instantly confirmed.</p>
                </div>
             </div>

             <div className="pt-4 space-y-6">
                <button
                  onClick={handlePayment}
                  disabled={loading || verifying}
                  className={`w-full py-4 text-white text-xs uppercase tracking-widest rounded-md shadow-sm transition-all flex items-center justify-center gap-3 ${
                    loading || verifying
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
                <div className="bg-stone-50 border border-stone-200 rounded-md p-5 flex flex-col gap-4">
                   <div className="flex items-center justify-center gap-2 text-stone-600">
                      <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      <span className="text-xs font-medium uppercase tracking-widest">100% Secure Checkout</span>
                   </div>
                   <div className="flex items-center justify-center gap-5 text-stone-400">
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