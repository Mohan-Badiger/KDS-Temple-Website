import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { backendUrl } from "../App";

const RequestPooja = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [approvingId, setApprovingId] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await axios.get(`${backendUrl}/api/bookings/pooja-requests`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setRequests(res.data.requests || []);
      } catch (err) {
        console.error("Error fetching pooja requests:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, [token]);

  const handleApprove = async (bookingId, time) => {
    if (!time) {
      toast.error("Please select a time before approving.");
      return;
    }

    setApprovingId(bookingId);

    try {
      await axios.put(
        `${backendUrl}/api/bookings/approve/${bookingId}`,
        { assignedTime: time },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("Pooja approved successfully!");
      setRequests((prev) => prev.filter((req) => req._id !== bookingId));
    } catch (err) {
      console.error("Approval failed:", err?.response?.data || err);
      toast.error(err?.response?.data?.message || "Approval failed.");
    } finally {
      setApprovingId(null);
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
              isApproving={approvingId === req._id}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const RequestCard = ({ req, onApprove, isApproving }) => {
  const [time, setTime] = useState("");

  console.log(time);
  

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
          type="time"
          className="border px-3 py-2 mb-2 md:mb-0"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          required
        />
        <button
          onClick={() => onApprove(req._id, time)}
          className="bg-primary text-white px-6 py-2 hover:bg-orange-400 transition disabled:opacity-60"
          disabled={isApproving || !time}
        >
          {isApproving ? "Approving..." : "Approve"}
        </button>
      </div>
    </div>
  );
};

export default RequestPooja;


// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { toast } from "react-toastify";
// import { backendUrl } from "../App";

// const RequestPooja = () => {
//   const [requests, setRequests] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [approvingId, setApprovingId] = useState(null);
//   const token = localStorage.getItem("token");

//   useEffect(() => {
//     const fetchRequests = async () => {
//       try {
//         const res = await axios.get(`${backendUrl}/api/bookings/pooja-requests`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         setRequests(res.data.requests || []);
//       } catch (err) {
//         console.error("Error fetching pooja requests:", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchRequests();
//   }, [token]);

//   const handleApprove = async (bookingId, time) => {
//     if (!time) {
//       toast.error("Please select a valid time before approving.");
//       return;
//     }

//     setApprovingId(bookingId);

//     try {
//       await axios.put(
//         `${backendUrl}/api/bookings/approve/${bookingId}`,
//         { assignedTime: time },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       toast.success("Pooja approved successfully!");
//       setRequests((prev) => prev.filter((req) => req._id !== bookingId));
//     } catch (err) {
//       console.error("Approval failed:", err?.response?.data || err);
//       toast.error(err?.response?.data?.message || "Approval failed.");
//     } finally {
//       setApprovingId(null);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-screen">
//         <p className="text-2xl font-semibold">Loading requests...</p>
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-5xl mx-auto py-6 font-primary">
//       <h2 className="sm:text-2xl mb-6">Pooja Booking Requests</h2>

//       {requests.length === 0 ? (
//         <p className="text-center text-gray-600">No pending requests.</p>
//       ) : (
//         <div className="space-y-6">
//           {requests.map((req) => (
//             <RequestCard
//               key={req._id}
//               req={req}
//               onApprove={handleApprove}
//               isApproving={approvingId === req._id}
//             />
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// const RequestCard = ({ req, onApprove, isApproving }) => {
//   const [time, setTime] = useState("");
//   const [minTime, setMinTime] = useState("");
//   const maxTime = "22:00"; // 10:00 PM

//   const getCurrentTime = () => {
//     const now = new Date();
//     const pad = (n) => (n < 10 ? "0" + n : n);
//     return `${pad(now.getHours())}:${pad(now.getMinutes())}`;
//   };

//   useEffect(() => {
//     const now = getCurrentTime();
//     setMinTime(now);
//     setTime(now);

//     const interval = setInterval(() => {
//       const updated = getCurrentTime();
//       setMinTime(updated);
//       if (time < updated) setTime(updated);
//     }, 60000);

//     return () => clearInterval(interval);
//   }, []);

//   const handleTimeChange = (e) => {
//     const value = e.target.value;
//     if (value >= minTime && value <= maxTime) {
//       setTime(value);
//     } else {
//       toast.warn("Please select a time from now to 10:00 PM only.");
//       setTime(minTime); 
//     }
//   };

//   return (
//     <div className="border p-6 font-primary space-y-3">
//       <h3 className="sm:text-xl text-gray-600">
//         Name: {req.user?.name} — Email: {req.user?.email}
//       </h3>

//       <div>
//         <h4 className="text-lg font-medium">Poojas:</h4>
//         <ul className="list-disc pl-5">
//           {req.poojas.map((p) => (
//             <li key={p._id}>{p.name}</li>
//           ))}
//         </ul>
//       </div>

//       <div className="flex flex-col md:flex-row justify-end md:items-center md:space-x-4">
//         <input
//           type="time"
//           className="border px-3 py-2 mb-2 md:mb-0"
//           value={time}
//           min={minTime}
//           max={maxTime}
//           onChange={handleTimeChange}
//           onFocus={() => setTime(getCurrentTime())}
//           required
//           disabled={!minTime}
//         />
//         <button
//           onClick={() => onApprove(req._id, time)}
//           className="bg-primary text-white px-6 py-2 hover:bg-orange-400 transition disabled:opacity-60"
//           disabled={isApproving || !time}
//         >
//           {isApproving ? "Approving..." : "Approve"}
//         </button>
//       </div>
//     </div>
//   );
// };

// export default RequestPooja;
