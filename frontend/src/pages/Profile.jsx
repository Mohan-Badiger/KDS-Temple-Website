import React, { useEffect, useState, useContext } from 'react';
import { motion } from 'framer-motion';
import { TempleContext } from '../context/TempleContext';
import ProfileCard from '../components/User/ProfileCard';
import BookingTimeline from '../components/User/BookingTimeline';
import axiosInstance from '../utils/axiosInstance';

const Profile = () => {
  const { token, backendUrl } = useContext(TempleContext);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        if (!token) return;
        const response = await axiosInstance.get('/api/user/profile');
        if (response.data.success && response.data.user) {
          setUserData(response.data.user);
        }
      } catch (error) {
        console.error("Profile fetch error", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProfile();
  }, [token, backendUrl]);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto px-4 py-8 sm:py-12 min-h-[70vh]"
    >
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-primary text-gray-800 mb-8 border-l-4 border-orange-500 pl-4 font-medium">My Profile</h1>
        
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
