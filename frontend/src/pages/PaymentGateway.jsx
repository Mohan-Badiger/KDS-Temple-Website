import React, { useContext, useState } from "react";
import { TempleContext } from "../context/TempleContext";
import axiosInstance from "../utils/axiosInstance";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

// Utility to decode JWT token safely
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
  const { selectedPoojas, totalAmount, backendUrl } = useContext(TempleContext);
  const [loading, setLoading] = useState(false);
  const [poojaInNameOf, setPoojaInNameOf] = useState("");
  const [poojaDate, setPoojaDate] = useState("");
  const navigate = useNavigate();

  const userToken = localStorage.getItem("token");
  const decoded = decodeToken(userToken);
  const userId = decoded?.id || decoded?._id;

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const formatDateToDDMMYYYY = (dateString) => {
    if (!dateString) return "";
    const [year, month, day] = dateString.split("-");
    return `${day}-${month}-${year}`;
  };

  const handlePayment = async () => {
    setLoading(true);

    if (!userToken || !userId) {
      toast.error("User not authenticated.");
      setLoading(false);
      return;
    }

    if (!selectedPoojas || selectedPoojas.length === 0) {
      toast.error("Please select at least one pooja.");
      setLoading(false);
      return;
    }

    if (!poojaInNameOf.trim()) {
      toast.error("Please provide a name for the pooja.");
      setLoading(false);
      return;
    }

    if (!poojaDate) {
      toast.error("Please select a date for the pooja.");
      setLoading(false);
      return;
    }

    const selectedDate = new Date(poojaDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      toast.error("Please select today or a future date.");
      setLoading(false);
      return;
    }

    const isLoaded = await loadRazorpayScript();
    if (!isLoaded) {
      toast.error("Razorpay SDK failed to load.");
      setLoading(false);
      return;
    }

    try {
      const { data: order } = await axiosInstance.post(
        `/api/payment/create-order`,
        { amount: totalAmount * 100 }
      );

      const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY_ID || "rzp_test_dummyKey";

      const options = {
        key: razorpayKey,
        amount: order.amount,
        currency: order.currency,
        name: "Temple Pooja Booking",
        description: "Payment for Pooja Booking",
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

            if (verifyRes.data.message === "Payment verified successfully") {
              const bookingData = {
                poojas: selectedPoojas.map((pooja) => pooja._id),
                user: userId,
                totalAmount,
                poojaInNameOf,
                poojaDate: formatDateToDDMMYYYY(poojaDate),
              };

              const bookingRes = await axiosInstance.post(
                `/api/bookings/create`,
                bookingData
              );

              if (bookingRes.data.success) {
                toast.success("Booking successful!");
                navigate("/booking-confirmation");
              } else {
                toast.error("Booking failed.");
              }
            } else {
              toast.error("Payment verification failed.");
            }
          } catch (error) {
            console.error("Error verifying payment:", error);
            toast.error("Failed to verify payment.");
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
    <div className="max-w-3xl mx-auto px-4 py-6 font-primary">
      <h2 className="text-3xl mb-3">Payment Gateway</h2>
      <p className="mb-4 text-gray-600">
        You are about to pay <span className="font-semibold">₹{totalAmount}</span> for:
      </p>

      <div className="border p-6 mb-6 shadow">
        {selectedPoojas.map((pooja) => (
          <div key={pooja._id} className="mb-4 border-b pb-4">
            <h3 className="text-xl">{pooja.name}</h3>
            <p className="text-gray-600">{pooja.description}</p>
            <p className="text-gray-800 font-medium">₹{pooja.price}</p>
          </div>
        ))}
      </div>

      <div className="mb-6">
        <label className="block text-lg mb-2">Pooja in the name of:</label>
        <input
          type="text"
          value={poojaInNameOf}
          onChange={(e) => setPoojaInNameOf(e.target.value.replace(/[^a-zA-Z\s]/g, ''))}
          className="w-full px-4 py-3 border outline-0"
          placeholder="Enter name"
        />
      </div>

      <div className="mb-6">
        <label className="block text-lg mb-2">Select Pooja Date:</label>
        <input
          type="date"
          value={poojaDate}
          onChange={(e) => setPoojaDate(e.target.value)}
          min={new Date().toISOString().split("T")[0]}
          className="w-full px-4 py-3 border outline-0"
        />
      </div>

      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-semibold">Total: ₹{totalAmount}</h3>
        <button
          onClick={handlePayment}
          disabled={loading}
          className={`px-8 py-3 text-white text-lg font-medium ${
            loading
              ? "bg-gray-600 cursor-not-allowed"
              : "bg-primary hover:bg-orange-500"
          }`}
        >
          {loading ? "Processing..." : "Pay & Book"}
        </button>

       {/* { <button
        onClick={()=>{toast.error("Payment Disabled for Demo Mode")}}
        className={`px-8 py-3 text-white text-lg font-medium ${
            loading
              ? "bg-gray-600 cursor-not-allowed"
              : "bg-primary hover:bg-orange-500"
          }`}
        >Pay & Book</button>} */}
      </div>
    </div>
  );
};

export default PaymentGateway;