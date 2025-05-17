import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { backendUrl } from "../App"; // fixed import

const RequestPooja = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [approvingId, setApprovingId] = useState(null); // ✅ New state
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await axios.get(`${backendUrl}/api/bookings/pooja-requests`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setRequests(res.data.requests || []);
      } catch (err) {
        console.log("Error fetching pooja requests:", err);
        // toast.error("Failed to load pooja requests.");
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, [token]);

  const handleApprove = async (bookingId, date, time) => {
    if (!date || !time) {
      return toast.warn("Please enter both date and time");
    }

    setApprovingId(bookingId); // ✅ Set loading state for the button

    try {
      const formattedDate = `${date}T${time}:00`;

      await axios.put(
        `${backendUrl}/api/bookings/approve/${bookingId}`,
        { assignedDate: formattedDate },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("Pooja approved!");
      setRequests((prev) => prev.filter((req) => req._id !== bookingId));
    } catch (err) {
      toast.error("Approval failed.");
      console.error("Approval failed:", err);
    } finally {
      setApprovingId(null); // ✅ Reset loading state
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-2xl font-semibold">Loading requests...</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto py-6 font-primary">
      <h2 className="sm:text-2xl mb-6">Pooja Booking Requests</h2>

      {requests.length === 0 ? (
        <p className="text-center text-gray-600">No pending requests.</p>
      ) : (
        <div className="space-y-6">
          {requests.map((req) => (
            <RequestCard
              key={req._id}
              req={req}
              onApprove={handleApprove}
              isApproving={approvingId === req._id} // ✅ Pass loading ID
            />
          ))}
        </div>
      )}
    </div>
  );
};

const RequestCard = ({ req, onApprove, isApproving }) => {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  return (
    <div className="border p-6 font-primary space-y-3">
      <h3 className="sm:text-xl text-gray-600">
        Name: {req.user?.name} — Email: {req.user?.email}
      </h3>

      <div>
        <h4 className="text-lg font-medium">Poojas:</h4>
        <ul className="list-disc pl-5">
          {req.poojas.map((p) => (
            <li key={p._id}>{p.name}</li>
          ))}
        </ul>
      </div>

      <div className="flex flex-col md:flex-row justify-end md:items-center md:space-x-4">
        <input
          type="date"
          className="border px-3 py-2 mb-2 md:mb-0"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          min={new Date().toISOString().split("T")[0]}
        />
        <input
          type="time"
          className="border px-3 py-2 mb-2 md:mb-0"
          value={time}
          onChange={(e) => setTime(e.target.value)}
        />
        <button
          onClick={() => onApprove(req._id, date, time)}
          className="bg-primary text-white px-6 py-2 hover:bg-orange-400 transition disabled:opacity-60"
          disabled={isApproving}
        >
          {isApproving ? "Approving..." : "Approve"}
        </button>
      </div>
    </div>
  );
};

export default RequestPooja;
