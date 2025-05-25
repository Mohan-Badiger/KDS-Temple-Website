import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { TempleContext } from "../context/TempleContext";

const BookingConfirmation = () => {
  const [bookingDetails, setBookingDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const userToken = localStorage.getItem("token");
  const { backendUrl } = useContext(TempleContext);


  useEffect(() => {
    const fetchBookingDetails = async () => {
      if (!userToken) return navigate("/login");

      try {
        const response = await axios.get(`${backendUrl}/api/bookings/latest`, {
          headers: { Authorization: `Bearer ${userToken}` },
        });

        if (response.data.success) {
          setBookingDetails(response.data.booking);
        } else {
          toast.error(response.data.message || "Failed to fetch booking details");
        }
      } catch (error) {
        if (error.response?.status === 404) {
          setBookingDetails(null);
        } else {
          toast.error("Error fetching booking details");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchBookingDetails();
  }, [navigate, userToken, backendUrl]);

  const formatDate = (isoDate) => {
    if (!isoDate) return "Not Assigned";

    const d = new Date(isoDate);
    if (isNaN(d.getTime())) return "Invalid Date";

    return d.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const formatTime = (timeString) => {
    if (!timeString) return "Not Assigned";
    return timeString;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-2xl font-semibold">Loading booking details...</p>
      </div>
    );
  }

  if (!bookingDetails) {
    return (
      <div className="flex justify-center items-center h-140">
        <p className="text-2xl font-semibold text-gray-600">No bookings found..</p>
      </div>
    );
  }

  const {
    user,
    poojas,
    status,
    totalAmount,
    assignedDate,
    assignedTime,
    createdAt,
    poojaInNameOf,
    paymentId,
    receiptId,
    paymentMethod,
    poojaDate,
  } = bookingDetails;

  return (
    <div className="max-w-3xl mx-auto py-6 font-primary">
      <h2 className="text-2xl sm:text-4xl font-semibold text-center mb-6">Booking Confirmation</h2>

      <div className="border border-gray-200 p-3 sm:p-7 mb-6">
        <h3 className="text-2xl text-gray-800 mb-2 sm:mb-4">Booking Summary</h3>
        <hr className="mb-4" />

        {/* User Info */}
        <div className="mb-4 flex flex-col sm:flex-row gap-2">
          <h4 className="text-lg font-medium">User Details:</h4>
          <div className="text-gray-700">
            <p>Name: {user?.name}</p>
            <p>Email: {user?.email}</p>
          </div>
        </div>

        {/* Pooja in Name of */}
        {poojaInNameOf && (
          <div className="mb-4 flex flex-col sm:flex-row gap-2">
            <h4 className="text-lg font-medium">Pooja in the Name of:</h4>
            <p className="text-gray-700 text-lg">{poojaInNameOf}</p>
          </div>
        )}

        {/* Pooja Info */}
        <div className="mb-4 flex gap-4">
          <h4 className="text-lg font-medium mb-2">Poojas Booked:</h4>
          <ul className="flex gap-2 flex-wrap">
            {poojas?.map((pooja) => (
              <li key={pooja._id} className="border px-3 py-1 text-gray-800">
                {pooja.name}
              </li>
            ))}
          </ul>
        </div>

        {/* Booking Status */}
        <div className="mb-4 flex sm:flex-row gap-4">
          <h4 className="text-lg font-medium">Booking Status:</h4>
          <p
            className={`text-lg capitalize ${
              status === "approved" ? "text-green-600" : "text-yellow-600"
            }`}
          >
            {status}
          </p>
        </div>

        {/* Pooja Date */}
        <div className="mb-4 flex sm:flex-row gap-4">
          <h4 className="text-lg font-medium">Pooja Date:</h4>
          <p className="text-gray-700">{formatDate(poojaDate)}</p>
        </div>

        {/* Assigned Time */}
        {assignedTime && (
          <div className="mb-4 flex sm:flex-row gap-4">
            <h4 className="text-lg font-medium">Assigned Time:</h4>
            <p className="text-gray-700">{formatTime(assignedTime)}</p>
          </div>
        )}
        {(paymentId || receiptId || paymentMethod) && (
          <div className="mb-4">
            <div className="text-gray-700 space-y-1">
              {paymentId && (
                <p className="text-lg text-gray-800 mb-4">
                  Payment ID: <span className="text-gray-700">{paymentId}</span>
                </p>
              )}
              {receiptId && (
                <p className="text-lg text-gray-800 mb-4">
                  Receipt ID: <span className="text-gray-700">{receiptId}</span>
                </p>
              )}
              {paymentMethod && (
                <p className="text-lg text-gray-800">
                  Payment Method: <span className="font-medium">{paymentMethod}</span>
                </p>
              )}
            </div>
          </div>
        )}

        {/* Total Amount */}
        <div className="mb-4 flex sm:flex-row gap-4">
          <h4 className="text-lg font-medium">Total Amount:</h4>
          <p className="text-lg text-gray-800">₹{totalAmount}</p>
        </div>

        {/* Booking Created Date */}
        <div className="mb-4 flex sm:flex-row gap-4">
          <h4 className="text-lg font-medium">Booking Created On:</h4>
          <p className="text-gray-700">{formatDate(createdAt)}</p>
        </div>
      </div>

      <div className="flex justify-end mt-8">
        <button
          onClick={() => navigate("/")}
          className="bg-black text-white px-6 py-2 text-lg hover:bg-gray-800 transition"
        >
          Go to Home
        </button>
      </div>
    </div>
  );
};

export default BookingConfirmation;
