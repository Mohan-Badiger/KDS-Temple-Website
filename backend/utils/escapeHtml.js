/**
 * Escapes special characters in HTML to prevent XSS.
 * @param {string} unsafe 
 * @returns {string}
 */
export const escapeHtml = (unsafe) => {
  if (typeof unsafe !== 'string') return unsafe;
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
};

export default escapeHtml;
