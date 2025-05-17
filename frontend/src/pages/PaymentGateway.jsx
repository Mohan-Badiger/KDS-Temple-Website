import React, { useContext, useState } from "react";
import { TempleContext } from "../context/TempleContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

// Utility to decode JWT token
const decodeToken = (token) => {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch (e) {
    return null;
  }
};

const PaymentGateway = () => {
  const { selectedPoojas, totalAmount, backendUrl } = useContext(TempleContext);
  const [loading, setLoading] = useState(false);
  const [poojaInNameOf, setPoojaInNameOf] = useState("");
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

  const handlePayment = async () => {
    setLoading(true);

    if (!userToken || !userId) {
      toast.error("User not authenticated");
      setLoading(false);
      return;
    }

    if (!selectedPoojas || selectedPoojas.length === 0) {
      toast.error("Please select at least one pooja.");
      setLoading(false);
      return;
    }

    if (!poojaInNameOf) {
      toast.error("Please provide a name for the pooja.");
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
      const { data: order } = await axios.post(
        `${backendUrl}/api/payment/create-order`,
        { amount: totalAmount * 100 } 
      );

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: "Temple Pooja Booking",
        description: "Payment for Pooja Booking",
        payment_method:"Razorpay",
        order_id: order.id,
        handler: async function (response) {
          try {
            const verifyRes = await axios.post(
              `${backendUrl}/api/payment/verify-payment`,
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }
            );

            if (verifyRes.data.message === "Payment verified successfully") {
              // Proceed with booking after successful payment
              const bookingData = {
                poojas: selectedPoojas.map((pooja) => pooja._id),
                user: userId,
                totalAmount,
                poojaInNameOf,
              };

              const bookingRes = await axios.post(
                `${backendUrl}/api/bookings/create`,
                bookingData,
                {
                  headers: {
                    Authorization: `Bearer ${userToken}`,
                  },
                }
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
            toast.error("Error verifying payment.");
            console.error("Payment verify error:", error);
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
      <h2 className="text-3xl font-bold mb-3">Payment Gateway</h2>
      <p className="mb-4 text-gray-600">
        You are about to pay <span className="font-semibold">₹{totalAmount}</span> for:
      </p>

      <div className="bg-white border p-6 mb-6">
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
          onChange={(e) => setPoojaInNameOf(e.target.value)}
          className="w-full px-4 py-3 border outline-0"
          placeholder="Enter name"
        />
      </div>

      <div className="flex justify-between items-center">
        <h3 className="text-2xl">Total: ₹{totalAmount}</h3>
        <button
          onClick={handlePayment}
          disabled={loading}
          className={`px-8 py-3 text-white text-lg font-medium ${
            loading ? "bg-gray-600 cursor-not-allowed" : "bg-primary hover:bg-orange-400"
          }`}
        >
          {loading ? "Processing..." : "Pay & Book"}
        </button>
      </div>
    </div>
  );
};

export default PaymentGateway;
