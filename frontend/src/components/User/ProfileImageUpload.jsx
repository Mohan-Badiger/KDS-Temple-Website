import React, { useState } from 'react';
import { toast } from 'react-toastify';

const ProfileImageUpload = ({ currentImage, onImageUpload }) => {
  const [imagePreview, setImagePreview] = useState(currentImage || '');

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      return toast.error("Please select an image file");
    }

    const reader = new FileReader();
    reader.onload = () => {
      setImagePreview(reader.result);
      if (onImageUpload) onImageUpload(file, reader.result);
    };
    reader.readAsDataURL(file);
  };

  const displayImage = imagePreview || `https://ui-avatars.com/api/?name=User&background=f97316&color=fff&size=256`;

  return (
    <div className="flex flex-col sm:flex-row items-center gap-6 mb-8 font-primary">
      <div className="relative group w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden border-4 border-orange-50 shadow-sm">
        <img 
          src={displayImage} 
          alt="Profile Preview" 
          referrerPolicy="no-referrer"
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
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
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
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
          />
        </div>
      </div>
    </div>
  );
};

export default ProfileImageUpload;
