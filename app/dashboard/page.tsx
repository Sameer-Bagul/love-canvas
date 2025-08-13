
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ProfilePicture from '../../components/ProfilePicture';

// Hardcoded partner connection codes
const PARTNER_CODES = {
  'alex@test.com': 'ALEX2024',
  'sarah@test.com': 'SARAH2024'
};

const CONNECT_CODE = 'LOVE2024'; // Universal code to connect partners

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [partnerName, setPartnerName] = useState('');
  const [showConfetti, setShowConfetti] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Get current user from localStorage
    const userData = localStorage.getItem('currentUser');
    if (!userData) {
      router.push('/auth');
      return;
    }

    const currentUser = JSON.parse(userData);
    setUser(currentUser);

    // Check if user is connected to partner
    const connectionStatus = localStorage.getItem(`connection_${currentUser.email}`);
    if (connectionStatus === 'connected') {
      setIsConnected(true);
      // Set partner name based on user
      if (currentUser.email === 'alex@test.com') {
        setPartnerName('Sarah');
      } else if (currentUser.email === 'sarah@test.com') {
        setPartnerName('Alex');
      } else {
        setPartnerName('Partner');
      }
    }
  }, [router]);

  const [canvasData] = useState({
    lastUpdated: '2 minutes ago',
    elementsCount: 12,
    drawings: 5,
    messages: 3
  });

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    router.push('/welcome');
  };

  const handleProfileImageChange = (imageData: string) => {
    const updatedUser = { ...user, profileImage: imageData };
    setUser(updatedUser);
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
  };

  const triggerConnectionAnimation = () => {
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 3000);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-3">
          <div className="w-8 h-8 border-2 border-pink-400 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-pink-600 font-medium">Loading your love story...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 relative">
      {/* Confetti Animation */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-confetti"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 2}s`
              }}
            >
              {Math.random() > 0.5 ? '💕' : '✨'}
            </div>
          ))}
        </div>
      )}

      {/* Header with Haptic Feedback */}
      <div className="bg-white/80 backdrop-blur-md border-b border-pink-100 px-4 py-4 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold text-gray-800">Welcome back, {user.name}!</h1>
            <p className="text-sm text-gray-600">
              {isConnected ? `Ready to create with ${partnerName}? 💕` : 'Connect with your partner to start creating!'}
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center hover:bg-pink-200 hover:scale-110 transition-all duration-300 !rounded-button active:scale-95"
          >
            <i className="ri-logout-circle-line text-pink-600"></i>
          </button>
        </div>
      </div>

      <div className="px-4 py-6">
        <div className="max-w-md mx-auto space-y-6">
          {/* Enhanced User Profile with Animation */}
          <div className="bg-white/80 backdrop-blur-md rounded-3xl shadow-lg border border-pink-100 p-6 hover:shadow-xl transition-all duration-300">
            <div className="text-center mb-4">
              <div className="relative mb-3">
                <ProfilePicture
                  currentImage={user.profileImage}
                  userName={user.name}
                  size="lg"
                  editable={true}
                  onImageChange={handleProfileImageChange}
                />
              </div>
              <h2 className="text-xl font-bold text-gray-800">{user.name}</h2>
              <p className="text-sm text-gray-600">{user.email}</p>
              <div className="mt-3">
                <div className="bg-gray-50 rounded-full px-4 py-2 inline-block hover:bg-gray-100 transition-colors">
                  <span className="text-sm font-medium text-gray-700">Your Code: {PARTNER_CODES[user.email] || 'USER2024'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Connection Status with Activity Indicators */}
          <div className="bg-white/80 backdrop-blur-md rounded-3xl shadow-lg border border-pink-100 p-6 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-gray-800">Partner Status</h2>
              <div
                className={`flex items-center space-x-2 px-3 py-1 rounded-full transition-all duration-300 ${
                  isConnected ? 'bg-green-100 hover:bg-green-200' : 'bg-orange-100 hover:bg-orange-200'
                }`}
              >
                <div
                  className={`w-2 h-2 rounded-full ${
                    isConnected ? 'bg-green-500 animate-pulse' : 'bg-orange-500 animate-bounce'
                  }`}
                ></div>
                <span
                  className={`text-xs font-medium ${
                    isConnected ? 'text-green-700' : 'text-orange-700'
                  }`}
                >
                  {isConnected ? 'Connected' : 'Not Connected'}
                </span>
              </div>
            </div>

            {isConnected ? (
              <div className="animate-fade-in">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-3">
                    <ProfilePicture
                      currentImage={user.profileImage}
                      userName={user.name}
                      size="md"
                    />
                    <div>
                      <p className="font-medium text-gray-800">{user.name}</p>
                      <div className="text-xs text-gray-500 flex items-center">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-1 animate-pulse"></div>
                        Online now
                      </div>
                    </div>
                  </div>

                  <div className="flex-1 flex justify-center">
                    <i className="ri-heart-fill text-pink-400 text-xl animate-pulse"></i>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div>
                      <p className="font-medium text-gray-800 text-right">{partnerName}</p>
                      <div className="text-xs text-gray-500 text-right flex items-center justify-end">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-1 animate-pulse"></div>
                        Active 1m ago
                      </div>
                    </div>
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
                      <span className="text-white text-lg">👤</span>
                    </div>
                  </div>
                </div>

                {/* Recent Activity Timeline */}
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <h4 className="text-sm font-medium text-gray-600 mb-2">Recent Activity</h4>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 text-xs text-gray-500">
                      <div className="w-2 h-2 bg-pink-400 rounded-full"></div>
                      <span>{partnerName} added a heart sticker • 5 minutes ago</span>
                    </div>
                    <div className="flex items-center space-x-2 text-xs text-gray-500">
                      <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                      <span>You drew on the canvas • 12 minutes ago</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <i className="ri-user-add-line text-gray-400 text-2xl"></i>
                </div>
                <p className="text-gray-600 mb-4">Connect with your partner to start creating together</p>
                <Link
                  href="/partner"
                  className="w-full bg-gradient-to-r from-pink-400 to-purple-400 text-white py-3 rounded-xl font-medium hover:shadow-lg hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-2 !rounded-button"
                >
                  <i className="ri-user-heart-line"></i>
                  <span>Connect Partner</span>
                </Link>
              </div>
            )}
          </div>

          {/* Enhanced Canvas Access with Preview Thumbnails */}
          {isConnected && (
            <div className="bg-white/80 backdrop-blur-md rounded-3xl shadow-lg border border-pink-100 p-6 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-gray-800">Your Love Canvas</h2>
                <span className="text-xs text-gray-500 flex items-center">
                  <i className="ri-time-line mr-1"></i>
                  Updated {canvasData.lastUpdated}
                </span>
              </div>

              {/* Canvas Preview */}
              <div className="bg-pink-50 rounded-2xl p-4 mb-4">
                <div className="aspect-video bg-white rounded-xl border-2 border-dashed border-pink-200 flex items-center justify-center">
                  <div className="text-center">
                    <i className="ri-image-line text-4xl text-pink-300 mb-2"></i>
                    <p className="text-sm text-pink-400">Canvas preview</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="text-center group cursor-pointer">
                  <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform">
                    <i className="ri-brush-line text-pink-600"></i>
                  </div>
                  <div className="text-lg font-bold text-gray-800">{canvasData.drawings}</div>
                  <div className="text-xs text-gray-500">Drawings</div>
                </div>
                <div className="text-center group cursor-pointer">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform">
                    <i className="ri-text text-purple-600"></i>
                  </div>
                  <div className="text-lg font-bold text-gray-800">{canvasData.messages}</div>
                  <div className="text-xs text-gray-500">Messages</div>
                </div>
                <div className="text-center group cursor-pointer">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform">
                    <i className="ri-image-line text-blue-600"></i>
                  </div>
                  <div className="text-lg font-bold text-gray-800">{canvasData.elementsCount}</div>
                  <div className="text-xs text-gray-500">Total Items</div>
                </div>
              </div>

              <Link
                href="/"
                className="w-full bg-gradient-to-r from-pink-400 to-purple-400 text-white py-3 rounded-xl font-medium hover:shadow-lg hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-2 !rounded-button active:scale-95"
              >
                <i className="ri-palette-line"></i>
                <span>Open Your Canvas</span>
              </Link>
            </div>
          )}

          {/* Enhanced Quick Actions with Skeleton Loaders */}
          <div className="bg-white/80 backdrop-blur-md rounded-3xl shadow-lg border border-pink-100 p-6 hover:shadow-xl transition-all duration-300">
            <h2 className="font-semibold text-gray-800 mb-4">Quick Actions</h2>

            <div className="grid grid-cols-2 gap-3">
              <Link
                href="/partner"
                className="group flex flex-col items-center space-y-2 bg-gray-50 hover:bg-blue-50 rounded-xl p-4 transition-all duration-300 hover:scale-105 !rounded-button"
              >
                <div className="w-10 h-10 bg-blue-100 group-hover:bg-blue-200 rounded-full flex items-center justify-center transition-colors">
                  <i className="ri-user-heart-line text-blue-600"></i>
                </div>
                <span className="text-sm font-medium text-gray-700 group-hover:text-blue-700 transition-colors">Partner</span>
              </Link>

              <button className="group flex flex-col items-center space-y-2 bg-gray-50 hover:bg-green-50 rounded-xl p-4 transition-all duration-300 hover:scale-105 !rounded-button">
                <div className="w-10 h-10 bg-green-100 group-hover:bg-green-200 rounded-full flex items-center justify-center transition-colors">
                  <i className="ri-gallery-line text-green-600"></i>
                </div>
                <span className="text-sm font-medium text-gray-700 group-hover:text-green-700 transition-colors">Gallery</span>
              </button>

              <button className="group flex flex-col items-center space-y-2 bg-gray-50 hover:bg-purple-50 rounded-xl p-4 transition-all duration-300 hover:scale-105 !rounded-button">
                <div className="w-10 h-10 bg-purple-100 group-hover:bg-purple-200 rounded-full flex items-center justify-center transition-colors">
                  <i className="ri-settings-3-line text-purple-600"></i>
                </div>
                <span className="text-sm font-medium text-gray-700 group-hover:text-purple-700 transition-colors">Settings</span>
              </button>

              <button className="group flex flex-col items-center space-y-2 bg-gray-50 hover:bg-red-50 rounded-xl p-4 transition-all duration-300 hover:scale-105 !rounded-button">
                <div className="w-10 h-10 bg-red-100 group-hover:bg-red-200 rounded-full flex items-center justify-center transition-colors">
                  <i className="ri-download-line text-red-600"></i>
                </div>
                <span className="text-sm font-medium text-gray-700 group-hover:text-red-700 transition-colors">Save Canvas</span>
              </button>
            </div>
          </div>

          {/* Enhanced Love Note with Interactive Elements */}
          <div className="bg-gradient-to-r from-pink-100 to-purple-100 rounded-2xl p-4 hover:shadow-md transition-shadow duration-300">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center animate-pulse">
                <i className="ri-heart-fill text-white text-sm"></i>
              </div>
              <div>
                <div className="font-medium text-gray-800">💡 Pro Tip</div>
                <div className="text-sm text-gray-600">
                  {isConnected
                    ? 'Try adding photos and voice messages to make your canvas even more special!'
                    : 'Use code "LOVE2024" to connect with your partner and start creating together!'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Background Hearts with Better Animation */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-8 text-pink-200 opacity-20 animate-float">
          <i className="ri-heart-fill text-2xl"></i>
        </div>
        <div className="absolute bottom-32 right-12 text-purple-200 opacity-15 animate-float" style={{ animationDelay: '1s' }}>
          <i className="ri-heart-fill text-lg"></i>
        </div>
        <div className="absolute top-1/3 left-1/4 text-pink-100 opacity-10 animate-float" style={{ animationDelay: '2s' }}>
          <i className="ri-heart-fill text-3xl"></i>
        </div>
      </div>
    </div>
  );
}
