import React, { useEffect, useState, useContext } from 'react';
import { motion } from 'framer-motion';
import { TempleContext } from '../context/TempleContext';
import ProfileCard from '../components/User/ProfileCard';
import BookingTimeline from '../components/User/BookingTimeline';
import axiosInstance from '../utils/axiosInstance';

const Profile = () => {
  const { token, userData, fetchUserData } = useContext(TempleContext);
  const [loading, setLoading] = useState(!userData);

  useEffect(() => {
    if (token) {
      fetchUserData().finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [token]);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto px-4 py-8 sm:py-12 min-h-[70vh]"
    >
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8 border-b border-stone-200 pb-6">
          <div className="w-1.5 h-10 bg-orange-400 rounded-md shadow-sm"></div>
          <h1 className="text-3xl text-gray-900 tracking-tight uppercase">My Profile</h1>
        </div>

        {/* Incomplete Profile Alert for missing phone number (e.g. Google Sign-In users) */}
        {userData && !userData.phone && (
          <div className="mb-8 p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-amber-900 font-primary">
            <div className="flex items-center gap-3">
              <span className="text-xl">⚠️</span>
              <div>
                <p className="text-sm font-semibold">Your phone number is missing</p>
                <p className="text-xs text-amber-800/80">Please add your 10-digit mobile number to receive SMS & WhatsApp booking updates.</p>
              </div>
            </div>
            <a
              href="/settings"
              className="px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white text-xs uppercase tracking-wider font-bold rounded-md shadow-sm hover:shadow transition shrink-0"
            >
              + Add Phone Number
            </a>
          </div>
        )}
        
        {loading ? (
          <div className="text-center py-10 font-primary text-gray-600">
             Loading profile...
          </div>
        ) : (
          <>{userData ? <ProfileCard user={userData} /> : <p className="text-center py-5 font-primary">Profile data not found.</p>}</>
        )}
        
        <div className="mt-12">
          {!loading && <BookingTimeline />}
        </div>
      </div>
    </motion.div>
  );
};

export default Profile;
