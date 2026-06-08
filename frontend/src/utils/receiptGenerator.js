import jsPDF from 'jspdf';
import { formatDateToDDMMYYYY } from './stringUtils';

/**
 * Generates a premium E-Ticket PDF for temple bookings.
 * @param {Object} booking - The booking data object.
 */
export const generateBookingReceipt = (booking) => {
  const doc = new jsPDF();
  const templeName = booking.temple?.name || "Kadasiddeshwar Temple";
  const templeLocation = booking.temple?.location || "Banahatti";
  const devoteeName = booking.poojaInNameOf || "Devotee";
  const date = booking.poojaDate ? formatDateToDDMMYYYY(booking.poojaDate) : "N/A";
  const paymentId = booking.paymentId || "Verified";
  const receiptId = booking.receiptId || booking._id?.slice(-8).toUpperCase();
  const totalAmount = booking.totalAmount;

  // Header - Trust Branding
  doc.setFillColor(249, 115, 22); // Orange primary
  doc.rect(0, 0, 210, 40, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text("BANAHATTI TEMPLES MANAGEMENT TRUST COMMITTEE", 105, 15, { align: "center" });
  
  doc.setFont("helvetica", "bold");
  doc.setFontSize(24);
  doc.text("OFFICIAL E-TICKET", 105, 28, { align: "center" });

  // Body Content
  doc.setTextColor(31, 41, 55);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);
  doc.text(`Namaskara ${devoteeName}, your divine reservation is confirmed.`, 105, 55, { align: "center" });

  // Main Info Box
  doc.setDrawColor(229, 231, 235);
  doc.setFillColor(249, 250, 251);
  doc.roundedRect(20, 65, 170, 100, 3, 3, 'FD');

  // Devotee and Date row
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(156, 163, 175);
  doc.text("DEVOTEE DETAILS", 30, 75);
  doc.text("SCHEDULED DATE", 180, 75, { align: "right" });

  doc.setTextColor(17, 24, 39);
  doc.setFontSize(14);
  doc.text(devoteeName.toUpperCase(), 30, 85);
  doc.text(date, 180, 85, { align: "right" });

  // Temple Destination
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(156, 163, 175);
  doc.text("TEMPLE DESTINATION", 30, 105);
  
  doc.setTextColor(17, 24, 39);
  doc.setFontSize(14);
  doc.text(templeName.toUpperCase(), 30, 115);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(107, 114, 128);
  doc.text(templeLocation, 30, 122);

  // Poojas List
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(156, 163, 175);
  doc.text("SELECTED SERVICES", 30, 140);
  
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.setTextColor(55, 65, 81);
  const poojaList = booking.poojas?.map(p => `- ${p.name} (INR ${p.price})`) || [];
  poojaList.forEach((text, i) => {
    doc.text(text, 35, 148 + (i * 7));
  });

  // Total Divider and Amount
  doc.setLineDashPattern([2, 1], 0);
  doc.line(30, 175, 180, 175);
  doc.setLineDashPattern([], 0);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(75, 85, 99);
  doc.text("TOTAL OFFERING", 30, 185);
  
  doc.setTextColor(249, 115, 22);
  doc.setFontSize(22);
  doc.text(`INR ${totalAmount}/-`, 180, 185, { align: "right" });

  // Transaction Info
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(229, 231, 235);
  doc.roundedRect(20, 200, 170, 30, 2, 2, 'D');
  
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(107, 114, 128);
  doc.text(`Payment ID: ${paymentId}`, 105, 210, { align: "center" });
  doc.text(`Order ID: ${receiptId}`, 105, 217, { align: "center" });
  doc.text(`Booking Ref: #${booking._id}`, 105, 224, { align: "center" });

  // Inspirational Quote
  doc.setFont("helvetica", "italic");
  doc.setFontSize(14);
  doc.setTextColor(217, 119, 6);
  doc.text('"May the continuous flow of divine grace illuminate your path and bring profound peace."', 105, 250, { align: "center", maxWidth: 160 });

  // Footer
  doc.setFillColor(243, 244, 246);
  doc.rect(0, 275, 210, 22, 'F');
  doc.setTextColor(156, 163, 175);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.text("SYSTEM AUTO-GENERATED TICKET • KADASIDDESHWAR TEMPLE TRUST SERVICES", 105, 287, { align: "center" });

  doc.save(`Temple_E_Ticket_${receiptId}.pdf`);
};
