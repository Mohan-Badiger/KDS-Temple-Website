import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const ProfileCard = ({ user }) => {
  if (!user) return null;

  // Use a fallback avatar if no image provided
  const avatarUrl = user.profile?.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || 'User')}&background=f97316&color=fff&size=256`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-liquid-glass-card rounded-md p-6 sm:p-8 w-full max-w-3xl mx-auto relative font-primary text-gray-800 border border-white/50"
    >
      <div className="absolute top-6 right-6">
        <Link
          to="/settings"
          className="bg-orange-50 text-orange-500 hover:bg-orange-100 transition px-4 py-2 rounded-md text-xs uppercase tracking-widest border border-orange-100"
        >
          Edit Profile
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 sm:gap-8">
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="w-28 h-28 sm:w-36 sm:h-36 shrink-0"
        >
          <img
            src={avatarUrl}
            alt={user.name || 'User Profile'}
            referrerPolicy="no-referrer"
            className="w-full h-full rounded-full object-cover border-2 border-orange-50 shadow-sm"
          />
        </motion.div>

        <div className="flex-1 w-full text-center sm:text-left mt-2 sm:mt-0">
          <h2 className="text-2xl sm:text-3xl text-gray-900 tracking-tight uppercase mb-1">Namaste, {user.name}</h2>
          <p className="text-stone-400 text-sm mb-6">{user.email}</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 text-xs">
            <div className="bg-white/30 p-4 rounded-md border border-white/40 shadow-sm">
              <p className="text-[10px] text-stone-500 uppercase tracking-widest mb-1">Phone Number</p>
              {user.phone ? (
                <p className="text-gray-800 tracking-wide">{user.phone}</p>
              ) : (
                <div className="flex items-center justify-between">
                  <span className="text-stone-400 italic text-xs">Not provided</span>
                  <Link to="/settings" className="text-[10px] text-orange-600 font-bold uppercase tracking-wider hover:underline">
                    + Add Phone
                  </Link>
                </div>
              )}
            </div>
            <div className="bg-white/30 p-4 rounded-md border border-white/40 shadow-sm sm:col-span-2">
              <p className="text-[10px] text-stone-500 uppercase tracking-widest mb-1">Permanent Address</p>
              {user.profile?.address ? (
                <p className="text-gray-800 tracking-wide">{user.profile.address}</p>
              ) : (
                <div className="flex items-center justify-between">
                  <span className="text-stone-400 italic text-xs">Not provided</span>
                  <Link to="/settings" className="text-[10px] text-orange-600 font-bold uppercase tracking-wider hover:underline">
                    + Add Address
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProfileCard;
