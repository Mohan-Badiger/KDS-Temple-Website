export const getFirstName = (name) => {
  if (!name || typeof name !== 'string') return 'User';
  const trimmed = name.trim();
  if (!trimmed) return 'User';
  return trimmed.split(' ')[0];
};

export const formatDateToDDMMYYYY = (dateString) => {
  if (!dateString) return "";
  
  // If it's already dd-mm-yyyy (starts with 1 or 2 digits followed by -)
  if (/^\d{1,2}-\d{1,2}-\d{4}/.test(dateString)) {
    return dateString;
  }

  // If it's yyyy-mm-dd or ISO
  try {
    const date = new Date(dateString);
    if (!isNaN(date.getTime())) {
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      return `${day}-${month}-${year}`;
    }
  } catch (e) {
    console.error("Error formatting date:", e);
  }

  // Fallback split if it's yyyy-mm-dd string but Date fails
  const parts = dateString.split(/[-/]/);
  if (parts.length === 3) {
    if (parts[0].length === 4) { // yyyy-mm-dd
      return `${parts[2]}-${parts[1]}-${parts[0]}`;
    }
  }

  return dateString;
};
