
'use client';

import Link from 'next/link';

export default function WelcomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 flex items-center justify-center px-4">
      <div className="text-center max-w-sm mx-auto">
        <div className="w-24 h-24 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full mx-auto mb-6 flex items-center justify-center">
          <i className="ri-heart-fill text-white text-4xl"></i>
        </div>
        
        <h1 className="font-['Pacifico'] text-4xl text-gray-800 mb-3">LoveCanvas</h1>
        <p className="text-gray-600 mb-8 text-lg">Create beautiful memories together with your special someone</p>
        
        <div className="space-y-4 mb-8">
          <div className="flex items-center space-x-3 text-left">
            <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center">
              <i className="ri-brush-line text-pink-600"></i>
            </div>
            <div>
              <h3 className="font-medium text-gray-800">Draw Together</h3>
              <p className="text-sm text-gray-600">Create art in real-time</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 text-left">
            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
              <i className="ri-heart-fill text-purple-600"></i>
            </div>
            <div>
              <h3 className="font-medium text-gray-800">Share Moments</h3>
              <p className="text-sm text-gray-600">Add photos and messages</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 text-left">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <i className="ri-user-heart-line text-blue-600"></i>
            </div>
            <div>
              <h3 className="font-medium text-gray-800">Stay Connected</h3>
              <p className="text-sm text-gray-600">One special partner, one canvas</p>
            </div>
          </div>
        </div>
        
        <div className="space-y-3">
          <Link 
            href="/auth"
            className="block w-full bg-gradient-to-r from-pink-400 to-purple-400 text-white py-4 rounded-xl font-medium hover:shadow-lg transition-all !rounded-button"
          >
            Get Started
          </Link>
          
          <Link 
            href="/auth"
            className="block w-full border border-pink-200 text-pink-600 py-4 rounded-xl font-medium hover:bg-pink-50 transition-all !rounded-button"
          >
            I Already Have an Account
          </Link>
        </div>
        
        <p className="text-xs text-gray-400 mt-6">
          Made with 💕 for couples who want to create together
        </p>
      </div>

      {/* Background Hearts */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-8 text-pink-200 opacity-20">
          <i className="ri-heart-fill text-3xl animate-pulse"></i>
        </div>
        <div className="absolute top-1/3 right-12 text-purple-200 opacity-15">
          <i className="ri-heart-fill text-2xl animate-bounce"></i>
        </div>
        <div className="absolute bottom-1/3 left-12 text-pink-200 opacity-25">
          <i className="ri-heart-fill text-xl animate-pulse"></i>
        </div>
        <div className="absolute bottom-20 right-8 text-purple-200 opacity-20">
          <i className="ri-heart-fill text-lg animate-bounce"></i>
        </div>
      </div>
    </div>
  );
}
