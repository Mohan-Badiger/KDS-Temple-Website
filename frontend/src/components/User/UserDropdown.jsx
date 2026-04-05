import React, { useState, useRef, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { TempleContext } from '../../context/TempleContext';
import { toast } from 'react-toastify';
import { getFirstName } from '../../utils/stringUtils';
import axiosInstance from '../../utils/axiosInstance';

const UserDropdown = ({ isMobile }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [userName, setUserName] = useState("User");
  const dropdownRef = useRef(null);
  const { token, setToken, navigate, backendUrl } = useContext(TempleContext);

  useEffect(() => {
    // Attempt to fetch user profile, fallback to "User" if any error occurs
    const fetchProfile = async () => {
      if (!token) return;
      try {
        const response = await axiosInstance.get('/api/user/profile');
        if (response.data.success && response.data.user) {
          setUserName(getFirstName(response.data.user.name));
        }
      } catch (error) {
        // Silently fail and keep "User" as fallback
      }
    };
    fetchProfile();
  }, [token, backendUrl]);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('lastActivity');
    setToken('');
    toast.error('Logged Out');
    navigate('/');
    setIsOpen(false);
  };

  const menuVariants = {
    hidden: { opacity: 0, scale: 0.95, y: -10 },
    visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.2, ease: "easeOut" } },
    exit: { opacity: 0, scale: 0.95, y: -10, transition: { duration: 0.15, ease: "easeIn" } }
  };

  return (
    <div className={`relative ${isMobile ? 'mt-4 w-full' : ''}`} ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 ${isMobile ? 'w-full px-6 py-2 bg-primary text-white font-lg cursor-pointer' : 'font-primary text-gray-700 hover:text-orange-500 transition-colors'}`}
      >
        <span className={isMobile ? '' : 'font-medium'}>Namaste, {userName}</span>
        {!isMobile && (
          <svg className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            variants={menuVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className={`${isMobile ? 'w-full bg-orange-50' : 'absolute right-0 mt-2 w-48 bg-white border border-gray-100 rounded-lg shadow-lg'} z-50 overflow-hidden font-primary`}
          >
            <div className="py-1">
              <Link
                to="/myseva"
                onClick={() => setIsOpen(false)}
                className={`block px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors ${isMobile ? 'pl-8' : ''}`}
              >
                My Seva History
              </Link>
              <Link
                to="/profile"
                onClick={() => setIsOpen(false)}
                className={`block px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors ${isMobile ? 'pl-8' : ''}`}
              >
                My Profile
              </Link>
              <Link
                to="/settings"
                onClick={() => setIsOpen(false)}
                className={`block px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors ${isMobile ? 'pl-8' : ''}`}
              >
                Account Settings
              </Link>
              <button
                onClick={handleLogout}
                className={`block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors ${isMobile ? 'pl-8' : ''}`}
              >
                Logout
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UserDropdown;
