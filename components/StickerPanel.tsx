'use client';

interface StickerPanelProps {
  onClose: () => void;
  onStickerAdd: (sticker: string) => void;
}

const stickerCategories = [
  {
    name: 'Love',
    stickers: ['💕', '💖', '💗', '💘', '💝', '💞', '💟', '❤️', '💔', '❣️', '💋', '😘']
  },
  {
    name: 'Emotions',
    stickers: ['😍', '🥰', '😊', '😂', '🤗', '😉', '😋', '🤔', '😴', '🥺', '🤭', '😇']
  },
  {
    name: 'Fun',
    stickers: ['🎉', '🎊', '🎈', '🎁', '🌟', '⭐', '✨', '🔥', '💯', '👏', '🙌', '🎵']
  },
  {
    name: 'Nature',
    stickers: ['🌸', '🌺', '🌻', '🌹', '🌷', '🌼', '🦋', '🐝', '🌙', '☀️', '🌈', '⭐']
  }
];

export default function StickerPanel({ onClose, onStickerAdd }: StickerPanelProps) {
  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-end">
      <div className="w-full bg-white rounded-t-3xl border-t border-pink-100 animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800">Add Stickers</h3>
          <button 
            onClick={onClose}
            className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center !rounded-button"
          >
            <i className="ri-close-line text-gray-600"></i>
          </button>
        </div>

        {/* Content */}
        <div className="max-h-80 overflow-y-auto p-4">
          {stickerCategories.map(category => (
            <div key={category.name} className="mb-6">
              <h4 className="text-sm font-medium text-gray-600 mb-3">{category.name}</h4>
              <div className="grid grid-cols-6 gap-3">
                {category.stickers.map((sticker, index) => (
                  <button
                    key={index}
                    onClick={() => onStickerAdd(sticker)}
                    className="aspect-square bg-gray-50 rounded-xl flex items-center justify-center text-2xl hover:bg-pink-50 hover:scale-110 transition-all !rounded-button"
                  >
                    {sticker}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Safe Area */}
        <div className="h-8"></div>
      </div>
    </div>
  );
}