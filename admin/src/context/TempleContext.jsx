import { createContext, useState, useEffect } from 'react';

export const TempleContext = createContext();

export const TempleProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token') || '');

  return (
    <TempleContext.Provider value={{ token, setToken }}>
      {children}
    </TempleContext.Provider>
  );
};
