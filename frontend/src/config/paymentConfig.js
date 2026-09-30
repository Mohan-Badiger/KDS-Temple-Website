/**
 * Payment Gateway Configuration
 * 
 * ============================================================================
 * TO TURN ON PAYMENTS:
 * Change IS_PAYMENT_ENABLED below from false to true.
 * 
 * export const IS_PAYMENT_ENABLED = false;
 * export const IS_PAYMENT_ENABLED = true;


 * ============================================================================
 */
export const IS_PAYMENT_ENABLED = false;

export const PAYMENT_MAINTENANCE_CONFIG = {
  statusBadge: "Under Progress",
  title: "Online Payment Under Progress",
  message:
    "Our online payment gateway is currently undergoing scheduled maintenance and system upgrades. Online bookings and donations will be resumed shortly.",
  offlineHelp:
    "For immediate Seva bookings, Annadanam, or Donations, please visit the Temple Administrative Office counter directly or contact temple authorities.",
  buttonNotice: "Payment Under Progress (Temporarily Disabled)",
  donationButtonNotice: "Online Donations Under Progress",
  shortBanner: "Online payment is temporarily under progress. Offline bookings available at temple."
};
