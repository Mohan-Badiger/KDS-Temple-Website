import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';
import { toast } from 'react-toastify';
import { TempleContext } from '../../context/TempleContext';

const SettingsForm = ({ initialData }) => {
  const navigate = useNavigate();
  const { token, backendUrl } = useContext(TempleContext);
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        email: initialData.email || '',
        phone: initialData.phone || '',
        address: initialData.profile?.address || ''
      });
      if (initialData.profile?.profileImage) {
        setImagePreview(initialData.profile.profileImage);
      }
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        return toast.error("Please select an image file");
      }
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = new FormData();
      payload.append('name', formData.name);
      payload.append('phone', formData.phone);
      payload.append('address', formData.address);

      if (imageFile) {
        payload.append('profileImage', imageFile);
      }

      const response = await axiosInstance.put(
        `/api/user/update-profile`,
        payload,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );

      if (response.data.success) {
        toast.success("Profile updated successfully!");
        navigate('/profile');
        if (response.data.user?.profile?.profileImage) {
          setImagePreview(response.data.user.profile.profileImage);
        }
      } else {
        toast.error(response.data.message || "Failed to update profile.");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  const displayImage = imagePreview || `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.name || 'User')}&background=f97316&color=fff&size=256`;

  return (
    <form onSubmit={handleSubmit} className="font-primary text-gray-800 pb-10">
      {/* Profile Image Section */}
      <div className="flex flex-col sm:flex-row items-center gap-6 mb-8 p-6 bg-white/30 backdrop-blur-md rounded-xl border border-white/45 shadow-sm">
        <div className="relative group w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden border-4 border-white shadow-sm">
          <img
            src={displayImage}
            alt="Profile Preview"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            disabled={loading}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
          />
        </div>
        <div className="text-center sm:text-left">
          <h4 className="text-lg font-medium text-gray-800">Profile Picture</h4>
          <p className="text-sm text-gray-500 mt-1 mb-2">JPG, GIF or PNG.</p>
          <div className="relative inline-block">
            <button type="button" className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 px-4 py-2 rounded-md text-sm font-medium transition pointer-events-none">
              Change Picture
            </button>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              disabled={loading}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed z-10"
            />
          </div>
        </div>
      </div>

      {/* SECTION 1: Basic Info */}
      <div className="mb-8 p-6 bg-white/30 backdrop-blur-md rounded-xl border border-white/45 shadow-sm">
        <h3 className="text-xl font-medium mb-4 text-orange-650 border-b border-white/20 pb-2">Basic Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-md outline-none transition-all duration-300 font-primary text-sm input-liquid-glass"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email <span className="text-xs text-gray-400 font-normal">(Cannot be changed)</span></label>
            <input
              type="email"
              name="email"
              value={formData.email}
              readOnly
              className="w-full px-4 py-2 rounded-md outline-none font-primary text-sm border border-white/30 bg-white/10 text-stone-500 cursor-not-allowed opacity-75"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-md outline-none transition-all duration-300 font-primary text-sm input-liquid-glass"
              placeholder="+91"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Address</label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              rows="3"
              className="w-full px-4 py-2 rounded-md outline-none transition-all duration-300 font-primary text-sm input-liquid-glass resize-none"
              placeholder="Enter your complete postal address"
            ></textarea>
          </div>
        </div>
      </div>

      {/* SECTION 3: Security */}
      <div className="mb-8 p-6 bg-white/30 backdrop-blur-md rounded-xl border border-white/45 shadow-sm">
        <h3 className="text-xl font-medium mb-4 text-orange-655 border-b border-white/20 pb-2">Security</h3>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h4 className="text-sm font-medium text-gray-800">Account Password</h4>
            <p className="text-xs text-gray-500 mt-1 max-w-sm">To change your password, you will be securely logged out to verify your identity via email OTP.</p>
          </div>
          <button
            type="button"
            onClick={() => {
              if (window.confirm("You will be securely logged out to reset your password. Continue?")) {
                localStorage.removeItem('token');
                window.location.href = '/login';
              }
            }}
            className="px-4 py-2 bg-white/40 border border-white/50 text-stone-700 rounded-md hover:bg-white/60 transition text-sm font-medium cursor-pointer"
          >
            Change Password
          </button>
        </div>
      </div>

      <div className="flex justify-end gap-4 mt-8">
        <button
          type="button"
          onClick={() => window.history.back()}
          className="px-6 py-2 border border-white/65 bg-white/20 text-stone-700 rounded-md hover:bg-white/45 transition cursor-pointer"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-8 py-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white rounded-md transition disabled:opacity-70 disabled:cursor-not-allowed shadow-md cursor-pointer font-bold border-none"
        >
          {loading ? 'Saving Changes...' : 'Save Profile'}
        </button>
      </div>
    </form>
  );
};

export default SettingsForm;
