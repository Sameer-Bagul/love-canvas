
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ProfilePicture from '../../components/ProfilePicture';

// Hardcoded partner connection data
const PARTNER_CODES = {
  'alex@test.com': 'ALEX2024',
  'sarah@test.com': 'SARAH2024'
};

const CONNECT_CODE = 'LOVE2024'; // Universal code to connect

export default function PartnerPage() {
  const [partnerCode, setPartnerCode] = useState('');
  const [user, setUser] = useState<any>(null);
  const [userCode, setUserCode] = useState('');
  const [copied, setCopied] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);

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
    setUserCode(PARTNER_CODES[currentUser.email] || 'USER2024');

    // Check if already connected
    const connectionStatus = localStorage.getItem(`connection_${currentUser.email}`);
    if (connectionStatus === 'connected') {
      setIsConnected(true);
    }
  }, [router]);

  const handleConnect = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!partnerCode.trim()) return;

    setLoading(true);
    setError('');

    try {
      // Add connection animation
      document.body.style.overflow = 'hidden';

      await new Promise(resolve => setTimeout(resolve, 1500));

      // Check if it's the universal connect code
      if (partnerCode.toUpperCase() === CONNECT_CODE) {
        // Store connection status
        localStorage.setItem(`connection_${user.email}`, 'connected');
        setIsConnected(true);
        setError('');

        // Show success animation with confetti
        setShowSuccessAnimation(true);

        // Redirect after animation
        setTimeout(() => {
          document.body.style.overflow = 'auto';
          router.push('/dashboard');
        }, 3000);
      } else {
        setError('Invalid partner code. Use "LOVE2024" to connect.');
        document.body.style.overflow = 'auto';
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
      document.body.style.overflow = 'auto';
    } finally {
      setLoading(false);
    }
  };

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(userCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = userCode;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const shareCode = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Join me on LoveCanvas',
        text: `Let's create something beautiful together! Use my code: ${userCode} or universal code: ${CONNECT_CODE}`,
        url: window.location.origin
      });
    } else {
      setShowInviteModal(true);
    }
  };

  const openCanvas = () => {
    router.push('/');
  };

  if (!user) {
    return <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 flex items-center justify-center">
      <div className="flex flex-col items-center space-y-3">
        <div className="w-8 h-8 border-2 border-pink-400 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-pink-600 font-medium">Loading connection...</p>
      </div>
    </div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 px-4 relative overflow-hidden">
      {/* Success Animation Overlay */}
      {showSuccessAnimation && (
        <div className="fixed inset-0 bg-gradient-to-br from-pink-400 to-purple-500 z-50 flex items-center justify-center">
          {/* Confetti */}
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-confetti"
              style={{
                left: `${Math.random() * 100}%`,
                top: '-10px',
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 2}s`
              }}
            >
              {[(''), (''), (''), (''), ('')][Math.floor(Math.random() * 5)]}
            </div>
          ))}

          <div className="text-center text-white animate-scale-in">
            <div className="w-24 h-24 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
              <i className="ri-heart-fill text-white text-4xl"></i>
            </div>
            <h2 className="text-3xl font-bold mb-2">Connected! </h2>
            <p className="text-lg opacity-90">Your love story begins now...</p>
            <div className="mt-4 flex justify-center">
              <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Header with Breadcrumb */}
      <div className="flex items-center justify-between pt-6 pb-4">
        <Link
          href="/dashboard"
          className="w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center border border-pink-100 hover:scale-110 hover:bg-white transition-all duration-300 !rounded-button active:scale-95"
        >
          <i className="ri-arrow-left-line text-gray-700"></i>
        </Link>
        <div className="text-center">
          <h1 className="font-semibold text-gray-800">
            {isConnected ? 'Partner Connected' : 'Connect Partner'}
          </h1>
          <p className="text-xs text-gray-500">Step 2 of 3</p>
        </div>
        <div className="w-10"></div>
      </div>

      <div className="max-w-md mx-auto">
        {/* Enhanced Connection Status with Micro-interactions */}
        <div className="bg-white/80 backdrop-blur-md rounded-3xl shadow-lg border border-pink-100 p-6 mb-6 hover:shadow-xl transition-all duration-300">
          <div className="text-center">
            <div className={`w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center transition-all duration-500 ${
              isConnected
                ? 'bg-gradient-to-r from-green-400 to-green-500 animate-pulse'
                : 'bg-gradient-to-r from-pink-400 to-purple-400'
            }`}>
              <i className={`text-white text-2xl transition-all duration-300 ${
                isConnected ? 'ri-heart-fill animate-bounce' : 'ri-heart-line'
              }`}></i>
            </div>
            <h2 className="text-lg font-semibold text-gray-800 mb-2">Your Love Canvas</h2>
            <p className="text-gray-600 text-sm mb-4">
              {isConnected
                ? 'You are connected! Ready to create together.'
                : 'One canvas, two hearts. Connect with your partner to start creating together.'}
            </p>

            {/* Enhanced Status Indicator */}
            <div className={`flex items-center justify-center space-x-2 px-4 py-2 rounded-full transition-all duration-300 hover:scale-105 ${
              isConnected ? 'bg-green-100 hover:bg-green-200' : 'bg-orange-100 hover:bg-orange-200'
            }`}>
              <div className={`w-2 h-2 rounded-full ${
                isConnected ? 'bg-green-500 animate-pulse' : 'bg-orange-500 animate-bounce'
              }`}></div>
              <span className={`text-xs font-medium ${
                isConnected ? 'text-green-700' : 'text-orange-700'
              }`}>
                {isConnected ? 'Connected to Partner' : 'Waiting for Partner'}
              </span>
            </div>

            {/* Enhanced Canvas Access Button */}
            {isConnected && (
              <button
                onClick={openCanvas}
                className="w-full bg-gradient-to-r from-pink-400 to-purple-400 text-white py-3 rounded-xl font-medium hover:shadow-lg hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-2 mt-4 !rounded-button active:scale-95"
              >
                <i className="ri-palette-line"></i>
                <span>Open Your Canvas</span>
              </button>
            )}
          </div>
        </div>

        {!isConnected && (
          <>
            {/* Enhanced Your Code Section */}
            <div className="bg-white/80 backdrop-blur-md rounded-3xl shadow-lg border border-pink-100 p-6 mb-6 hover:shadow-xl transition-all duration-300">
              <h3 className="font-semibold text-gray-800 mb-4 flex items-center">
                <i className="ri-qr-code-line mr-2 text-pink-500"></i>
                Your Connection Code
              </h3>

              <div className="bg-pink-50 rounded-2xl p-4 mb-4 hover:bg-pink-100 transition-colors">
                <div className="text-center">
                  <div className="font-mono text-2xl font-bold text-pink-600 tracking-wider mb-2 select-all">
                    {userCode}
                  </div>
                  <p className="text-sm text-gray-600">Share this code with your partner</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={copyCode}
                  className="flex items-center justify-center space-x-2 bg-pink-100 text-pink-700 py-3 rounded-xl font-medium transition-all duration-300 hover:bg-pink-200 hover:scale-105 !rounded-button active:scale-95"
                >
                  <i className={`${copied ? 'ri-check-line' : 'ri-file-copy-line'} text-sm transition-all duration-300`}></i>
                  <span>{copied ? 'Copied!' : 'Copy Code'}</span>
                </button>

                <button
                  onClick={shareCode}
                  className="flex items-center justify-center space-x-2 bg-purple-100 text-purple-700 py-3 rounded-xl font-medium transition-all duration-300 hover:bg-purple-200 hover:scale-105 !rounded-button active:scale-95"
                >
                  <i className="ri-share-line text-sm"></i>
                  <span>Share</span>
                </button>
              </div>
            </div>

            {/* Enhanced Connect with Partner Section */}
            <div className="bg-white/80 backdrop-blur-md rounded-3xl shadow-lg border border-pink-100 p-6 mb-6 hover:shadow-xl transition-all duration-300">
              <h3 className="font-semibold text-gray-800 mb-4 flex items-center">
                <i className="ri-link mr-2 text-purple-500"></i>
                Connect with Partner
              </h3>

              {/* Enhanced Test Code Info */}
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 mb-4 hover:bg-blue-100 transition-colors">
                <div className="flex items-center space-x-2 mb-1">
                  <i className="ri-information-line text-blue-500 text-sm"></i>
                  <span className="text-sm font-medium text-blue-800">Test Code</span>
                </div>
                <p className="text-xs text-blue-700">Use <strong>"LOVE2024"</strong> to connect and access the canvas</p>
              </div>

              <form onSubmit={handleConnect}>
                <div className="mb-4">
                  <input
                    type="text"
                    value={partnerCode}
                    onChange={(e) => setPartnerCode(e.target.value.toUpperCase())}
                    placeholder="Enter partner's code"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-200 focus:border-pink-400 outline-none font-mono text-center text-lg tracking-wider transition-all duration-300 hover:border-pink-300"
                    maxLength={8}
                    disabled={loading}
                  />
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-3 mb-4 animate-shake">
                    <div className="flex items-center space-x-2">
                      <i className="ri-error-warning-line text-red-500"></i>
                      <span className="text-sm text-red-700">{error}</span>
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={!partnerCode.trim() || loading}
                  className="w-full bg-gradient-to-r from-pink-400 to-purple-400 text-white py-3 rounded-xl font-medium hover:shadow-lg hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2 !rounded-button active:scale-95"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Connecting...</span>
                    </>
                  ) : (
                    <>
                      <i className="ri-heart-line"></i>
                      <span>Connect & Start Creating</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </>
        )}

        {/* Enhanced Connection Success Message */}
        {isConnected && (
          <div className="bg-gradient-to-r from-green-100 to-green-50 rounded-2xl p-4 mb-6 animate-fade-in">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center animate-bounce">
                <i className="ri-check-line text-white text-sm"></i>
              </div>
              <div>
                <h4 className="font-medium text-green-800">Successfully Connected!</h4>
                <p className="text-sm text-green-600">
                  You can now create beautiful memories together on your shared canvas.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Enhanced Info Card */}
        <div className="bg-gradient-to-r from-pink-100 to-purple-100 rounded-2xl p-4 hover:shadow-md transition-shadow duration-300">
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-pink-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 animate-pulse">
              <i className="ri-information-line text-white text-xs"></i>
            </div>
            <div>
              <h4 className="font-medium text-gray-800 mb-1">Stay Loyal! </h4>
              <p className="text-sm text-gray-600">
                Once connected, you can only share your canvas with one partner. This keeps your love exclusive and special.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end animate-fade-in">
          <div className="w-full bg-white rounded-t-3xl border-t border-pink-100 animate-slide-up">
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <h3 className="text-lg font-semibold text-gray-800">Invite Your Partner</h3>
              <button
                onClick={() => setShowInviteModal(false)}
                className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 hover:scale-110 transition-all duration-300 !rounded-button"
              >
                <i className="ri-close-line text-gray-600"></i>
              </button>
            </div>

            <div className="p-4 space-y-4">
              <div className="bg-gray-50 rounded-2xl p-4">
                <p className="text-sm text-gray-600 mb-3">Share this message:</p>
                <div className="bg-white rounded-xl p-3 border border-gray-200 hover:bg-gray-50 transition-colors">
                  <p className="text-sm select-all">
                    Let's create something beautiful together! Join me on LoveCanvas with code: <strong>{userCode}</strong> or use <strong>{CONNECT_CODE}</strong>
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button className="flex items-center justify-center space-x-2 bg-green-100 text-green-700 py-3 rounded-xl font-medium hover:bg-green-200 hover:scale-105 transition-all duration-300 !rounded-button active:scale-95">
                  <i className="ri-message-line text-sm"></i>
                  <span>WhatsApp</span>
                </button>
                <button className="flex items-center justify-center space-x-2 bg-blue-100 text-blue-700 py-3 rounded-xl font-medium hover:bg-blue-200 hover:scale-105 transition-all duration-300 !rounded-button active:scale-95">
                  <i className="ri-mail-line text-sm"></i>
                  <span>Email</span>
                </button>
              </div>
            </div>

            <div className="h-8"></div>
          </div>
        </div>
      )}

      {/* Enhanced Background Hearts */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-8 text-pink-200 opacity-20 animate-float">
          <i className="ri-heart-fill text-3xl"></i>
        </div>
        <div className="absolute bottom-32 right-12 text-purple-200 opacity-15 animate-float" style={{ animationDelay: '1s' }}>
          <i className="ri-heart-fill text-2xl"></i>
        </div>
        <div className="absolute top-1/2 left-1/4 text-pink-100 opacity-10 animate-float" style={{ animationDelay: '2s' }}>
          <i className="ri-heart-fill text-4xl"></i>
        </div>
      </div>
    </div>
  );
}
