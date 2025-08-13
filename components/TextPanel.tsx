'use client';

import { useState } from 'react';

interface TextPanelProps {
  onClose: () => void;
  onTextAdd: (text: string, style: any) => void;
}

const fonts = [
  { name: 'Arial', value: 'Arial' },
  { name: 'Pacifico', value: 'Pacifico' },
  { name: 'Georgia', value: 'Georgia' },
  { name: 'Times', value: 'Times' }
];

const colors = ['#ff6b9d', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', '#ff9ff3', '#54a0ff', '#ee5a6f'];

export default function TextPanel({ onClose, onTextAdd }: TextPanelProps) {
  const [text, setText] = useState('');
  const [selectedFont, setSelectedFont] = useState('Arial');
  const [selectedColor, setSelectedColor] = useState('#ff6b9d');
  const [fontSize, setFontSize] = useState(24);

  const handleAdd = () => {
    if (!text.trim()) return;
    
    onTextAdd(text, {
      font: selectedFont,
      color: selectedColor,
      size: fontSize
    });
    setText('');
  };

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-end">
      <div className="w-full bg-white rounded-t-3xl border-t border-pink-100 animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800">Add Text</h3>
          <button 
            onClick={onClose}
            className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center !rounded-button"
          >
            <i className="ri-close-line text-gray-600"></i>
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          {/* Text Input */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">Your Text</label>
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Type something sweet..."
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-200 focus:border-pink-400 outline-none"
              maxLength={50}
            />
            <div className="text-xs text-gray-400 mt-1">{text.length}/50</div>
          </div>

          {/* Font Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">Font</label>
            <div className="grid grid-cols-2 gap-2">
              {fonts.map(font => (
                <button
                  key={font.value}
                  onClick={() => setSelectedFont(font.value)}
                  className={`p-3 rounded-xl border text-left transition-all !rounded-button ${
                    selectedFont === font.value 
                      ? 'border-pink-400 bg-pink-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  style={{ fontFamily: font.value }}
                >
                  {font.name}
                </button>
              ))}
            </div>
          </div>

          {/* Color Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">Color</label>
            <div className="flex space-x-2">
              {colors.map(color => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={`w-10 h-10 rounded-full border-2 transition-all ${
                    selectedColor === color ? 'border-gray-400 scale-110' : 'border-gray-200'
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          {/* Font Size */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">Size: {fontSize}px</label>
            <input
              type="range"
              min="16"
              max="48"
              value={fontSize}
              onChange={(e) => setFontSize(parseInt(e.target.value))}
              className="w-full accent-pink-400"
            />
          </div>

          {/* Preview */}
          {text && (
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="text-xs text-gray-500 mb-2">Preview:</div>
              <div 
                style={{ 
                  fontFamily: selectedFont, 
                  color: selectedColor, 
                  fontSize: `${fontSize}px`,
                  textAlign: 'center'
                }}
              >
                {text}
              </div>
            </div>
          )}

          {/* Add Button */}
          <button
            onClick={handleAdd}
            disabled={!text.trim()}
            className="w-full bg-gradient-to-r from-pink-400 to-purple-400 text-white py-3 rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all !rounded-button"
          >
            Add Text
          </button>
        </div>

        {/* Bottom Safe Area */}
        <div className="h-8"></div>
      </div>
    </div>
  );
}