import jsPDF from 'jspdf';
import { formatDateToDDMMYYYY } from './stringUtils';

// Helper to convert number to words for official receipts
export const numberToWords = (num) => {
  if (num === 0) return 'Zero Rupees Only';
  
  const a = ['', 'One ', 'Two ', 'Three ', 'Four ', 'Five ', 'Six ', 'Seven ', 'Eight ', 'Nine ', 'Ten ', 'Eleven ', 'Twelve ', 'Thirteen ', 'Fourteen ', 'Fifteen ', 'Sixteen ', 'Seventeen ', 'Eighteen ', 'Nineteen '];
  const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

  const convertLessThanOneThousand = (n) => {
    if (n === 0) return '';
    let tempStr = '';
    if (n >= 100) {
      tempStr += a[Math.floor(n / 100)] + 'Hundred ';
      n %= 100;
      if (n > 0) tempStr += 'and ';
    }
    if (n >= 20) {
      tempStr += b[Math.floor(n / 10)] + ' ';
      n %= 10;
    }
    if (n > 0) {
      tempStr += a[n];
    }
    return tempStr;
  };

  let str = '';
  let temp = Math.floor(num);
  
  const crores = Math.floor(temp / 10000000);
  temp %= 10000000;
  if (crores > 0) {
    str += convertLessThanOneThousand(crores) + 'Crore ';
  }

  const lakhs = Math.floor(temp / 100000);
  temp %= 100000;
  if (lakhs > 0) {
    str += convertLessThanOneThousand(lakhs) + 'Lakh ';
  }

  const thousands = Math.floor(temp / 1000);
  temp %= 1000;
  if (thousands > 0) {
    str += convertLessThanOneThousand(thousands) + 'Thousand ';
  }

  if (temp > 0) {
    str += convertLessThanOneThousand(temp);
  }

  return (str.trim() + ' Rupees Only').replace(/\s+/g, ' ');
};

// Internal helper to draw background watermark and official trust borders
const drawReceiptBase = (doc, title, settings) => {
  // Page size is 210 x 148 mm (A5 Landscape)
  
  // 1. Draw double borders
  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(0.25);
  doc.rect(6, 6, 198, 136); // Outer border
  doc.rect(8, 8, 194, 132); // Inner border

  // 2. Saffron accent lines at top and bottom of inner area
  doc.setDrawColor(249, 115, 22); // Saffron Orange
  doc.setLineWidth(1.0);
  doc.line(10, 31, 200, 31);
  doc.line(10, 138, 200, 138);

  // 3. Official Watermark in center (before drawing text)
  doc.setTextColor(248, 248, 248);
  doc.setFontSize(22);
  doc.setFont("times", "bold");
  doc.text("SHRI KADASIDDHESHWAR TEMPLE TRUST", 105, 85, { align: "center", angle: 14 });

  // 4. Header Branding
  doc.setTextColor(30, 30, 30);
  doc.setFont("times", "bold");
  doc.setFontSize(16);
  doc.text("SHRI KADASIDDHESHWAR TEMPLE TRUST, BANAHATTI", 105, 16, { align: "center" });

  // Load contact configurations dynamically
  const address = settings?.address || "SH 53, Rabkavi Banhatti, Bagalkot District, Karnataka - 587311";
  const phone = settings?.phone || "+91 91234 56789";
  const email = settings?.email || "info@banahattitemples.com";

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(80, 80, 80);
  doc.text(address, 105, 22, { align: "center" });
  doc.text(`Email: ${email}  |  Phone: ${phone}  |  Reg: BK-12345/2026`, 105, 27, { align: "center" });

  // 5. Title
  doc.setTextColor(249, 115, 22);
  doc.setFont("times", "bold");
  doc.setFontSize(13);
  doc.text(title.toUpperCase(), 105, 39, { align: "center" });
};

/**
 * Generates an official landscape A5 receipt for pooja bookings.
 * @param {Object} booking - The booking data object.
 * @param {Object} [settings] - The global settings object.
 */
export const generateBookingReceipt = (booking, settings) => {
  const doc = new jsPDF({ orientation: 'l', unit: 'mm', format: 'a5' });
  
  const templeName = booking.temple?.name || "Kadasiddeshwar Temple";
  const devoteeName = booking.poojaInNameOf || "Devotee";
  const date = booking.poojaDate ? formatDateToDDMMYYYY(booking.poojaDate) : "N/A";
  const paymentId = booking.paymentId || "Verified";
  const receiptId = booking.receiptId || booking._id?.slice(-8).toUpperCase() || "N/A";
  const totalAmount = booking.totalAmount;
  const emailId = booking.user?.email || "N/A";
  const mobileNo = booking.user?.phone || "N/A";
  const createdDate = booking.createdAt ? new Date(booking.createdAt).toLocaleDateString('en-IN') : new Date().toLocaleDateString('en-IN');

  drawReceiptBase(doc, "Official E-Receipt (Pooja Booking)", settings);

  // Render Metadata Grid
  doc.setTextColor(40, 40, 40);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);

  // Left Column
  doc.setFont("helvetica", "bold");
  doc.text("Receipt No:", 15, 48);
  doc.setFont("helvetica", "normal");
  doc.text(receiptId, 38, 48);

  doc.setFont("helvetica", "bold");
  doc.text("Receipt Date:", 15, 54);
  doc.setFont("helvetica", "normal");
  doc.text(createdDate, 38, 54);

  doc.setFont("helvetica", "bold");
  doc.text("Payment ID:", 15, 60);
  doc.setFont("helvetica", "normal");
  doc.text(paymentId, 38, 60);

  // Right Column
  doc.setFont("helvetica", "bold");
  doc.text("Devotee Name:", 110, 48);
  doc.setFont("helvetica", "normal");
  doc.text(devoteeName, 136, 48);

  doc.setFont("helvetica", "bold");
  doc.text("Phone No:", 110, 54);
  doc.setFont("helvetica", "normal");
  doc.text(mobileNo, 136, 54);

  doc.setFont("helvetica", "bold");
  doc.text("Email ID:", 110, 60);
  doc.setFont("helvetica", "normal");
  doc.text(emailId, 136, 60);

  // 6. Draw Table Header
  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(0.3);
  doc.line(12, 65, 198, 65);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(30, 30, 30);
  doc.text("Sl.", 15, 69.5);
  doc.text("Offering / Service Description", 25, 69.5);
  doc.text("Pooja Date & Target Temple", 110, 69.5);
  doc.text("Amount (INR)", 195, 69.5, { align: "right" });

  doc.line(12, 72.5, 198, 72.5);

  // 7. Render Table Rows
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(60, 60, 60);
  const poojas = booking.poojas || [];
  let currentY = 77;
  poojas.forEach((pooja, index) => {
    doc.text((index + 1).toString(), 15, currentY);
    doc.text(pooja.name, 25, currentY);
    doc.text(`${date} - ${templeName}`, 110, currentY);
    doc.text(`Rs. ${pooja.price.toFixed(2)}`, 195, currentY, { align: "right" });
    currentY += 5.5;
  });

  // Draw table bottom border
  doc.line(12, currentY, 198, currentY);

  // 8. Total section
  const tableBottomY = currentY;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(30, 30, 30);
  doc.text("Amount in words:", 15, tableBottomY + 4.5);
  
  doc.setFont("helvetica", "italic");
  doc.setFontSize(8.5);
  doc.setTextColor(80, 80, 80);
  const amtWords = numberToWords(totalAmount);
  doc.text(amtWords, 15, tableBottomY + 9);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(11.5);
  doc.setTextColor(249, 115, 22);
  doc.text(`TOTAL: INR ${Number(totalAmount).toFixed(2)}`, 195, tableBottomY + 7, { align: "right" });

  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(0.3);
  doc.line(12, tableBottomY + 12.5, 198, tableBottomY + 12.5);

  // 9. Signatures and notes
  const signY = tableBottomY + 17;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(110, 110, 110);
  doc.text("Receipt Notes:", 15, signY);
  doc.text("• Computer-generated receipt. No physical signature required.", 15, signY + 4);
  doc.text("• Please carry this e-receipt to the temple for seva validation.", 15, signY + 8);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(50, 50, 50);
  doc.text("For SHRI KADASIDDHESHWAR TEMPLE TRUST", 195, signY, { align: "right" });

  doc.setFont("helvetica", "normal");
  doc.setTextColor(120, 120, 120);
  doc.text("(Authorized Signatory)", 195, signY + 12.5, { align: "right" });

  // 10. Divine blessings
  doc.setFont("times", "italic");
  doc.setFontSize(10.5);
  doc.setTextColor(217, 119, 6);
  doc.text('"May the divine grace and blessings of Shri Kadasiddheshwar be with you and your family."', 105, 133, { align: "center" });

  doc.save(`Temple_E_Ticket_${receiptId}.pdf`);
};

/**
 * Generates an official landscape A5 receipt for donations.
 * @param {Object} donation - The donation details object.
 * @param {Object} [settings] - The global settings object.
 */
export const generateDonationReceipt = (donation, settings) => {
  const { amount, purpose, paymentId, date, donorName, phone, email } = donation;
  const doc = new jsPDF({ orientation: 'l', unit: 'mm', format: 'a5' });

  const receiptNo = paymentId ? 'DN-' + paymentId.slice(-8).toUpperCase() : 'DN-' + Math.floor(Math.random() * 1000000);
  const createdDate = date ? new Date(date).toLocaleDateString('en-IN') : new Date().toLocaleDateString('en-IN');
  const displayPhone = phone || "N/A";
  const displayEmail = email || "N/A";

  drawReceiptBase(doc, "Official Donation Receipt", settings);

  // Render Metadata Grid
  doc.setTextColor(40, 40, 40);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);

  // Left Column
  doc.setFont("helvetica", "bold");
  doc.text("Receipt No:", 15, 48);
  doc.setFont("helvetica", "normal");
  doc.text(receiptNo, 38, 48);

  doc.setFont("helvetica", "bold");
  doc.text("Donation Date:", 15, 54);
  doc.setFont("helvetica", "normal");
  doc.text(createdDate, 38, 54);

  doc.setFont("helvetica", "bold");
  doc.text("Payment ID:", 15, 60);
  doc.setFont("helvetica", "normal");
  doc.text(paymentId || "Direct", 38, 60);

  // Right Column
  doc.setFont("helvetica", "bold");
  doc.text("Donor Name:", 110, 48);
  doc.setFont("helvetica", "normal");
  doc.text(donorName, 136, 48);

  doc.setFont("helvetica", "bold");
  doc.text("Phone No:", 110, 54);
  doc.setFont("helvetica", "normal");
  doc.text(displayPhone, 136, 54);

  doc.setFont("helvetica", "bold");
  doc.text("Email ID:", 110, 60);
  doc.setFont("helvetica", "normal");
  doc.text(displayEmail, 136, 60);

  // 6. Draw Table Header
  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(0.3);
  doc.line(12, 65, 198, 65);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(30, 30, 30);
  doc.text("Sl.", 15, 69.5);
  doc.text("Donation Purpose / Support Category", 25, 69.5);
  doc.text("Mode of Contribution", 110, 69.5);
  doc.text("Amount (INR)", 195, 69.5, { align: "right" });

  doc.line(12, 72.5, 198, 72.5);

  // 7. Render Table Rows
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(60, 60, 60);
  let currentY = 77;
  doc.text("1", 15, currentY);
  doc.text(`Contribution towards ${purpose}`, 25, currentY);
  doc.text("Online Payment", 110, currentY);
  doc.text(`Rs. ${Number(amount).toFixed(2)}`, 195, currentY, { align: "right" });
  currentY += 5.5;

  // Draw table bottom border
  doc.line(12, currentY, 198, currentY);

  // 8. Total section
  const tableBottomY = currentY;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(30, 30, 30);
  doc.text("Amount in words:", 15, tableBottomY + 4.5);
  
  doc.setFont("helvetica", "italic");
  doc.setFontSize(8.5);
  doc.setTextColor(80, 80, 80);
  const amtWords = numberToWords(amount);
  doc.text(amtWords, 15, tableBottomY + 9);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(11.5);
  doc.setTextColor(249, 115, 22);
  doc.text(`TOTAL: INR ${Number(amount).toFixed(2)}`, 195, tableBottomY + 7, { align: "right" });

  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(0.3);
  doc.line(12, tableBottomY + 12.5, 198, tableBottomY + 12.5);

  // 9. Signatures and notes
  const signY = tableBottomY + 17;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(110, 110, 110);
  doc.text("Receipt Notes:", 15, signY);
  doc.text("• Computer-generated receipt. No physical signature required.", 15, signY + 4);
  doc.text("• Heartfelt thanks from the Trust for supporting the devasthana.", 15, signY + 8);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(50, 50, 50);
  doc.text("For SHRI KADASIDDHESHWAR TEMPLE TRUST", 195, signY, { align: "right" });

  doc.setFont("helvetica", "normal");
  doc.setTextColor(120, 120, 120);
  doc.text("(Authorized Signatory)", 195, signY + 12.5, { align: "right" });

  // 10. Divine blessings
  doc.setFont("times", "italic");
  doc.setFontSize(10.5);
  doc.setTextColor(217, 119, 6);
  doc.text('"May the divine grace and blessings of Shri Kadasiddheshwar be with you and your family."', 105, 133, { align: "center" });

  doc.save(`Temple_Donation_Receipt_${new Date().getTime()}.pdf`);
};
