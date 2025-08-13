
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

// Hardcoded credentials for testing
const TEST_USERS = [
  { email: 'alex@test.com', password: '123456', name: 'Alex', partnerId: null, profileImage: null },
  { email: 'sarah@test.com', password: '123456', name: 'Sarah', partnerId: 'alex@test.com', profileImage: null }
];

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: ''
  });

  const router = useRouter();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const validateForm = () => {
    if (!formData.email || !formData.password) {
      setError('Please fill in all required fields');
      return false;
    }

    if (!isLogin) {
      if (!formData.name) {
        setError('Please enter your name');
        return false;
      }
      
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        return false;
      }

      if (formData.password.length < 6) {
        setError('Password must be at least 6 characters long');
        return false;
      }
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    setError('');

    try {
      // Add page transition animation
      document.body.style.opacity = '0.8';
      
      await new Promise(resolve => setTimeout(resolve, 1000));

      if (isLogin) {
        // Check hardcoded credentials
        const user = TEST_USERS.find(u => u.email === formData.email && u.password === formData.password);
        
        if (!user) {
          setError('Invalid email or password');
          setLoading(false);
          document.body.style.opacity = '1';
          return;
        }

        // Store user data in localStorage for demo
        localStorage.setItem('currentUser', JSON.stringify(user));
        
        // Redirect to dashboard
        router.push('/dashboard');
      } else {
        // Handle signup - create new user
        const newUser = {
          email: formData.email,
          password: formData.password,
          name: formData.name,
          partnerId: null,
          profileImage: null
        };
        
        // Store user data in localStorage for demo
        localStorage.setItem('currentUser', JSON.stringify(newUser));
        
        // After signup, redirect to dashboard
        router.push('/dashboard');
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
      document.body.style.opacity = '1';
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 flex items-center justify-center px-4 relative overflow-hidden">
      {/* Animated Background Hearts */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-8 text-pink-200 opacity-20 animate-pulse">
          <i className="ri-heart-fill text-4xl"></i>
        </div>
        <div className="absolute top-40 right-12 text-purple-200 opacity-15 animate-bounce" style={{animationDelay: '1s'}}>
          <i className="ri-heart-fill text-2xl"></i>
        </div>
        <div className="absolute bottom-32 left-12 text-pink-200 opacity-25 animate-pulse" style={{animationDelay: '2s'}}>
          <i className="ri-heart-fill text-3xl"></i>
        </div>
        <div className="absolute top-1/2 right-20 text-purple-200 opacity-10 animate-bounce" style={{animationDelay: '0.5s'}}>
          <i className="ri-heart-fill text-5xl"></i>
        </div>
      </div>

      <div className="w-full max-w-md relative z-10 animate-fade-in">
        {/* Logo & Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full mx-auto mb-4 flex items-center justify-center animate-bounce">
            <i className="ri-heart-fill text-white text-3xl"></i>
          </div>
          <h1 className="font-['Pacifico'] text-3xl text-gray-800 mb-2">LoveCanvas</h1>
          <p className="text-gray-600">Share your love, one canvas at a time</p>
        </div>

        {/* Collapsible Test Credentials Info */}
        <div className="mb-6">
          <details className="bg-blue-50 border border-blue-200 rounded-xl overflow-hidden">
            <summary className="p-3 cursor-pointer hover:bg-blue-100 transition-colors">
              <div className="flex items-center space-x-2">
                <i className="ri-information-line text-blue-500"></i>
                <span className="text-sm font-medium text-blue-800">Test Credentials</span>
                <i className="ri-arrow-down-s-line text-blue-500 ml-auto"></i>
              </div>
            </summary>
            <div className="px-3 pb-3 text-xs text-blue-700 space-y-1 animate-fade-in">
              <p><strong>User 1:</strong> alex@test.com / 123456</p>
              <p><strong>User 2:</strong> sarah@test.com / 123456</p>
              <p><strong>Partner Code:</strong> LOVE2024 (to connect)</p>
            </div>
          </details>
        </div>

        {/* Auth Form with Enhanced Animations */}
        <div className="bg-white/80 backdrop-blur-md rounded-3xl shadow-xl border border-pink-100 p-6 transition-all duration-300 hover:shadow-2xl">
          {/* Tab Switcher with Smooth Transitions */}
          <div className="flex bg-gray-100 rounded-full p-1 mb-6">
            <button
              onClick={() => {
                setIsLogin(true);
                setError('');
              }}
              className={`flex-1 py-2 px-4 rounded-full text-sm font-medium transition-all duration-300 !rounded-button ${
                isLogin 
                  ? 'bg-white text-pink-600 shadow-sm transform scale-105' 
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => {
                setIsLogin(false);
                setError('');
              }}
              className={`flex-1 py-2 px-4 rounded-full text-sm font-medium transition-all duration-300 !rounded-button ${
                !isLogin 
                  ? 'bg-white text-pink-600 shadow-sm transform scale-105' 
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Error Message with Animation */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-3 mb-4 animate-shake">
              <div className="flex items-center space-x-2">
                <i className="ri-error-warning-line text-red-500"></i>
                <span className="text-sm text-red-700">{error}</span>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="animate-slide-down">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter your name"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-200 focus:border-pink-400 outline-none transition-all duration-300 hover:border-pink-300"
                  required={!isLogin}
                  disabled={loading}
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter your email"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-200 focus:border-pink-400 outline-none transition-all duration-300 hover:border-pink-300"
                required
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Enter your password"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-200 focus:border-pink-400 outline-none transition-all duration-300 hover:border-pink-300"
                required
                disabled={loading}
              />
            </div>

            {!isLogin && (
              <div className="animate-slide-down">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm Password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="Confirm your password"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-200 focus:border-pink-400 outline-none transition-all duration-300 hover:border-pink-300"
                  required={!isLogin}
                  disabled={loading}
                />
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-pink-400 to-purple-400 text-white py-3 rounded-xl font-medium hover:shadow-lg hover:scale-105 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2 !rounded-button"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>{isLogin ? 'Signing In...' : 'Creating Account...'}</span>
                </>
              ) : (
                <span>{isLogin ? 'Sign In' : 'Create Account'}</span>
              )}
            </button>
          </form>

          {isLogin && (
            <div className="text-center mt-4">
              <Link 
                href="/forgot-password"
                className="text-sm text-pink-600 hover:text-pink-700 transition-colors duration-300 hover:underline"
              >
                Forgot your password?
              </Link>
            </div>
          )}
        </div>

        {/* Enhanced Features with Hover Effects */}
        <div className="mt-8 text-center">
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div className="flex flex-col items-center space-y-2 group cursor-pointer">
              <div className="w-10 h-10 bg-white/60 backdrop-blur-sm rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:bg-white/80">
                <i className="ri-brush-line text-pink-500 group-hover:text-pink-600 transition-colors"></i>
              </div>
              <span className="text-gray-600 group-hover:text-gray-800 transition-colors">Draw Together</span>
            </div>
            <div className="flex flex-col items-center space-y-2 group cursor-pointer">
              <div className="w-10 h-10 bg-white/60 backdrop-blur-sm rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:bg-white/80">
                <i className="ri-heart-fill text-pink-500 group-hover:text-pink-600 transition-colors animate-pulse"></i>
              </div>
              <span className="text-gray-600 group-hover:text-gray-800 transition-colors">Stay Connected</span>
            </div>
            <div className="flex flex-col items-center space-y-2 group cursor-pointer">
              <div className="w-10 h-10 bg-white/60 backdrop-blur-sm rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:bg-white/80">
                <i className="ri-lock-line text-pink-500 group-hover:text-pink-600 transition-colors"></i>
              </div>
              <span className="text-gray-600 group-hover:text-gray-800 transition-colors">Private & Secure</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
