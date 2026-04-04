import React, { useState } from 'react';
import { toast } from 'react-toastify';

const ProfileImageUpload = ({ currentImage, onImageUpload }) => {
  const [imagePreview, setImagePreview] = useState(currentImage || '');
  const [isUploading, setIsUploading] = useState(false);

  // Cloudinary settings - User will need to update these or use env variables later
  const CLOUD_NAME = 'your_cloud_name';
  const UPLOAD_PRESET = 'your_unsigned_preset'; 

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      return toast.error("Please select an image file");
    }

    // Local Preview
    const reader = new FileReader();
    reader.onload = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);

    // Upload to Cloudinary
    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', UPLOAD_PRESET);
    formData.append('cloud_name', CLOUD_NAME);

    try {
      const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (data.secure_url) {
        toast.success("Image uploaded successfully");
        onImageUpload(data.secure_url);
      } else {
        // Fallback for placeholder/testing without actual credentials
        if (data.error) {
          console.warn("Cloudinary Upload Error:", data.error.message);
          toast.info("Using local preview since Cloudinary credentials aren't set.");
        }
        onImageUpload(reader.result); // Mock by providing base64
      }
    } catch (error) {
      console.error("Upload failed", error);
      toast.info("Using local preview. Upload failed.");
      onImageUpload(reader.result); // Mock by providing base64
    } finally {
      setIsUploading(false);
    }
  };

  const displayImage = imagePreview || `https://ui-avatars.com/api/?name=User&background=f97316&color=fff&size=256`;

  return (
    <div className="flex flex-col sm:flex-row items-center gap-6 mb-8 font-primary">
      <div className="relative group w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden border-4 border-orange-50 shadow-sm">
        <img 
          src={displayImage} 
          alt="Profile Preview" 
          className="w-full h-full object-cover"
        />
        
        <div className={`absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity ${isUploading ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
          {isUploading ? (
             <div className="w-8 h-8 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
          ) : (
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          )}
        </div>
        
        <input 
          type="file" 
          accept="image/*"
          onChange={handleImageChange}
          disabled={isUploading}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
        />
      </div>
      
      <div className="text-center sm:text-left">
        <h4 className="text-lg font-medium text-gray-800">Profile Picture</h4>
        <p className="text-sm text-gray-500 mt-1 mb-2">JPG, GIF or PNG. Max size of 5MB</p>
        <div className="relative inline-block">
          <button className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 px-4 py-2 rounded-md text-sm font-medium transition pointer-events-none">
            {isUploading ? 'Uploading...' : 'Change Picture'}
          </button>
          <input 
            type="file" 
            accept="image/*"
            onChange={handleImageChange}
            disabled={isUploading}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed z-10"
          />
        </div>
      </div>
    </div>
  );
};

export default ProfileImageUpload;
