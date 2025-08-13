
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Canvas from '../components/Canvas';
import Toolbar from '../components/Toolbar';
import StickerPanel from '../components/StickerPanel';
import TextPanel from '../components/TextPanel';
import ImagePanel from '../components/ImagePanel';

export default function Home() {
  const [activeMode, setActiveMode] = useState<'draw' | 'sticker' | 'text' | 'image' | 'drag'>('draw');
  const [showPanel, setShowPanel] = useState<string | null>(null);
  const [brushColor, setBrushColor] = useState('#ff6b9d');
  const [brushSize, setBrushSize] = useState(5);
  const [canvasElements, setCanvasElements] = useState<any[]>([]);
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [partnerName, setPartnerName] = useState('');
  const [showWelcome, setShowWelcome] = useState(true);

  const router = useRouter();

  useEffect(() => {
    // Check authentication
    const userData = localStorage.getItem('currentUser');
    if (!userData) {
      router.push('/welcome');
      return;
    }

    const currentUser = JSON.parse(userData);
    setUser(currentUser);

    // Check connection status
    const connectionStatus = localStorage.getItem(`connection_${currentUser.email}`);
    if (connectionStatus !== 'connected') {
      router.push('/dashboard');
      return;
    }

    setIsConnected(true);
    // Set partner name based on user
    if (currentUser.email === 'alex@test.com') {
      setPartnerName('Sarah');
    } else if (currentUser.email === 'sarah@test.com') {
      setPartnerName('Alex');
    } else {
      setPartnerName('Partner');
    }
  }, [router]);

  useEffect(() => {
    // Check if user has elements to hide welcome
    if (canvasElements.length > 0) {
      setShowWelcome(false);
    }
  }, [canvasElements]);

  if (!user || !isConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-pink-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your love canvas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 relative overflow-hidden">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-pink-100">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center space-x-2">
            <Link href="/dashboard" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full flex items-center justify-center">
                <i className="ri-heart-fill text-white text-sm"></i>
              </div>
              <h1 className="font-['Pacifico'] text-lg text-gray-800">LoveCanvas</h1>
            </Link>
          </div>
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-2 px-3 py-1 rounded-full bg-green-100">
              <div className="w-2 h-2 rounded-full animate-pulse bg-green-500"></div>
              <span className="text-xs font-medium text-green-700">
                {user.name} & {partnerName}
              </span>
            </div>
            <Link
              href="/dashboard"
              className="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center !rounded-button"
            >
              <i className="ri-home-line text-pink-600 text-sm"></i>
            </Link>
          </div>
        </div>
      </div>

      {/* Canvas Area */}
      <div className="pt-16 pb-20 px-4">
        <div className="max-w-md mx-auto">
          <Canvas
            activeMode={activeMode}
            brushColor={brushColor}
            brushSize={brushSize}
            elements={canvasElements}
            setElements={setCanvasElements}
            selectedElement={selectedElement}
            setSelectedElement={setSelectedElement}
          />
        </div>
      </div>

      {/* Bottom Toolbar - Hidden when welcome overlay is shown */}
      {!showWelcome && (
        <div className="fixed bottom-0 left-0 right-0 z-50">
          <Toolbar
            activeMode={activeMode}
            setActiveMode={setActiveMode}
            showPanel={showPanel}
            setShowPanel={setShowPanel}
            brushColor={brushColor}
            setBrushColor={setBrushColor}
            brushSize={brushSize}
            setBrushSize={setBrushSize}
          />
        </div>
      )}

      {/* Panels */}
      {showPanel === 'stickers' && (
        <StickerPanel
          onClose={() => setShowPanel(null)}
          onStickerAdd={(sticker) => {
            const newSticker = {
              id: Date.now().toString(),
              type: 'sticker',
              content: sticker,
              x: 150,
              y: 200,
              scale: 1,
              rotation: 0
            };
            setCanvasElements((prev) => [...prev, newSticker]);
            setShowPanel(null);
          }}
        />
      )}

      {showPanel === 'text' && (
        <TextPanel
          onClose={() => setShowPanel(null)}
          onTextAdd={(text, style) => {
            const newText = {
              id: Date.now().toString(),
              type: 'text',
              content: text,
              style,
              x: 150,
              y: 200,
              scale: 1,
              rotation: 0
            };
            setCanvasElements((prev) => [...prev, newText]);
            setShowPanel(null);
          }}
        />
      )}

      {showPanel === 'images' && (
        <ImagePanel
          onClose={() => setShowPanel(null)}
          onImageAdd={(image) => {
            const newImage = {
              id: Date.now().toString(),
              type: 'image',
              content: image,
              x: 150,
              y: 200,
              scale: 0.5,
              rotation: 0
            };
            setCanvasElements((prev) => [...prev, newImage]);
            setShowPanel(null);
          }}
        />
      )}

      {/* Minimalist Background Hearts */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-32 left-8 text-pink-200/20 opacity-50">
          <i className="ri-heart-fill text-xl"></i>
        </div>
        <div className="absolute top-64 right-12 text-purple-200/20 opacity-40">
          <i className="ri-heart-fill text-sm"></i>
        </div>
        <div className="absolute bottom-48 left-16 text-pink-200/20 opacity-30">
          <i className="ri-heart-fill text-lg"></i>
        </div>
      </div>

      {/* Welcome Overlay - Full screen with proper z-index */}
      {showWelcome && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-center justify-center px-4">
          <div className="bg-white rounded-3xl p-8 max-w-sm mx-auto text-center shadow-xl animate-fade-in">
            <div className="w-16 h-16 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full mx-auto mb-6 flex items-center justify-center">
              <i className="ri-palette-line text-white text-2xl"></i>
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-3">Welcome to Your Shared Canvas!</h2>
            <p className="text-gray-600 mb-8 text-sm leading-relaxed">You and {partnerName} can now create beautiful memories together. Start by choosing any tool!</p>

            <div className="flex items-center justify-center space-x-6 mb-8">
              <div className="text-center">
                <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <i className="ri-brush-line text-pink-600 text-lg"></i>
                </div>
                <span className="text-xs text-gray-600">Draw</span>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <i className="ri-emotion-happy-line text-yellow-600 text-lg"></i>
                </div>
                <span className="text-xs text-gray-600">Stickers</span>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <i className="ri-text text-blue-600 text-lg"></i>
                </div>
                <span className="text-xs text-gray-600">Text</span>
              </div>
            </div>

            <button
              onClick={() => {
                setShowWelcome(false);
                setActiveMode('draw');
                if ('vibrate' in navigator) {
                  navigator.vibrate(20);
                }
              }}
              className="w-full bg-gradient-to-r from-pink-400 to-purple-400 text-white py-4 rounded-2xl font-medium hover:shadow-lg transition-all duration-300 hover:scale-105 active:scale-95 !rounded-button"
            >
              Start Creating Together ✨
            </button>
          </div>
        </div>
      )}

      {/* Floating Start Button (alternative for minimalist approach) */}
      {showWelcome && (
        <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-[65]">
          <button
            onClick={() => {
              setShowWelcome(false);
              setActiveMode('draw');
            }}
            className="w-16 h-16 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full shadow-lg flex items-center justify-center text-white hover:shadow-xl transition-all duration-300 hover:scale-110 active:scale-95 !rounded-button"
          >
            <i className="ri-play-fill text-xl"></i>
          </button>
        </div>
      )}
    </div>
  );
}
