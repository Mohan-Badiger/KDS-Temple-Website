export const getFirstName = (name) => {
  if (!name || typeof name !== 'string') return 'User';
  const trimmed = name.trim();
  if (!trimmed) return 'User';
  return trimmed.split(' ')[0];
};
