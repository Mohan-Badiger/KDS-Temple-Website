/**
 * Calculates the display status of a booking.
 * Requirements: If status is 'approved', it should show "Upcoming" until 
 * poojaDate + assignedTime, after which it should show "Completed".
 */
const getBookingDisplayStatus = (booking) => {
  if (booking.status === "pending") return "Pending";
  if (booking.status === "completed") return "Completed";
  if (booking.status === "cancelled") return "Cancelled";
  
  if (booking.status === "approved" || booking.status === "Upcoming") {
    if (!booking.poojaDate || !booking.assignedTime) {
      return "Upcoming";
    }

    try {
      const poojaDate = new Date(booking.poojaDate);
      
      const timeMatch = booking.assignedTime.match(/(\d+):(\d+)\s*(AM|PM)/i);
      if (!timeMatch) return "Upcoming";
      
      let hours = parseInt(timeMatch[1], 10);
      const minutes = parseInt(timeMatch[2], 10);
      const ampm = timeMatch[3].toUpperCase();
      
      if (ampm === "PM" && hours < 12) hours += 12;
      if (ampm === "AM" && hours === 12) hours = 0;
      
      poojaDate.setHours(hours, minutes, 0, 0);
      
      const now = new Date();
      
      if (now >= poojaDate) {
        return "Completed";
      } else {
        return "Upcoming";
      }
    } catch (e) {
      console.error("Error parsing date/time for booking status", e);
      return "Upcoming";
    }
  }
  
  return booking.status || "Upcoming";
};

export { getBookingDisplayStatus };
