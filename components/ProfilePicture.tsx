
'use client';

import { useState, useRef } from 'react';

interface ProfilePictureProps {
  currentImage?: string | null;
  userName: string;
  size?: 'sm' | 'md' | 'lg';
  editable?: boolean;
  onImageChange?: (imageData: string) => void;
}

export default function ProfilePicture({ 
  currentImage, 
  userName, 
  size = 'md', 
  editable = false,
  onImageChange 
}: ProfilePictureProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const sizeClasses = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-12 h-12 text-lg',
    lg: 'w-20 h-20 text-2xl'
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size must be less than 5MB');
      return;
    }

    setIsUploading(true);

    // Create file reader to convert to base64
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (result && onImageChange) {
        onImageChange(result);
      }
      setIsUploading(false);
      setShowUploadModal(false);
    };
    reader.readAsDataURL(file);
  };

  const handleCameraCapture = () => {
    if (fileInputRef.current) {
      fileInputRef.current.setAttribute('capture', 'camera');
      fileInputRef.current.click();
    }
  };

  const handleGallerySelect = () => {
    if (fileInputRef.current) {
      fileInputRef.current.removeAttribute('capture');
      fileInputRef.current.click();
    }
  };

  const removeImage = () => {
    if (onImageChange) {
      onImageChange('');
    }
    setShowUploadModal(false);
  };

  return (
    <>
      <div className="relative inline-block">
        <div 
          className={`${sizeClasses[size]} bg-gradient-to-r from-pink-400 to-purple-400 rounded-full flex items-center justify-center relative overflow-hidden cursor-pointer transition-all duration-300 ${editable ? 'hover:scale-105' : ''}`}
          onClick={editable ? () => setShowUploadModal(true) : undefined}
        >
          {currentImage ? (
            <img 
              src={currentImage} 
              alt={userName}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-white font-semibold">
              {getInitials(userName)}
            </span>
          )}
          
          {isUploading && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
          
          {editable && !isUploading && (
            <div className="absolute inset-0 bg-black/30 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
              <i className="ri-camera-line text-white text-sm"></i>
            </div>
          )}
        </div>

        {editable && (
          <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-pink-500 rounded-full flex items-center justify-center border-2 border-white">
            <i className="ri-edit-line text-white text-xs"></i>
          </div>
        )}
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Upload Modal */}
      {showUploadModal && editable && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white rounded-3xl p-6 mx-4 max-w-sm w-full animate-scale-in">
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Update Profile Picture</h3>
              <p className="text-sm text-gray-600">Choose how you'd like to add your photo</p>
            </div>

            <div className="space-y-3">
              <button
                onClick={handleCameraCapture}
                className="w-full flex items-center space-x-3 bg-blue-50 hover:bg-blue-100 text-blue-700 p-4 rounded-xl transition-colors !rounded-button"
              >
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <i className="ri-camera-line text-blue-600"></i>
                </div>
                <div className="text-left">
                  <div className="font-medium">Take Photo</div>
                  <div className="text-xs text-blue-600">Use camera to capture</div>
                </div>
              </button>

              <button
                onClick={handleGallerySelect}
                className="w-full flex items-center space-x-3 bg-green-50 hover:bg-green-100 text-green-700 p-4 rounded-xl transition-colors !rounded-button"
              >
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <i className="ri-gallery-line text-green-600"></i>
                </div>
                <div className="text-left">
                  <div className="font-medium">Choose from Gallery</div>
                  <div className="text-xs text-green-600">Select existing photo</div>
                </div>
              </button>

              {currentImage && (
                <button
                  onClick={removeImage}
                  className="w-full flex items-center space-x-3 bg-red-50 hover:bg-red-100 text-red-700 p-4 rounded-xl transition-colors !rounded-button"
                >
                  <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                    <i className="ri-delete-bin-line text-red-600"></i>
                  </div>
                  <div className="text-left">
                    <div className="font-medium">Remove Photo</div>
                    <div className="text-xs text-red-600">Use initials instead</div>
                  </div>
                </button>
              )}
            </div>

            <button
              onClick={() => setShowUploadModal(false)}
              className="w-full mt-4 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-xl font-medium transition-colors !rounded-button"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </>
  );
}
