'use client';

interface ImagePanelProps {
  onClose: () => void;
  onImageAdd: (image: string) => void;
}

const loveImages = [
  'Romantic couple silhouette at sunset, warm pink and orange sky, minimalist illustration style, soft gradient background, dreamy atmosphere, vector art, clean composition',
  'Heart-shaped balloons floating in pastel sky, pink and purple gradient, romantic illustration, soft lighting, dreamy clouds, minimalist design, love theme',
  'Two coffee cups with heart-shaped steam, cozy morning scene, warm brown and cream colors, romantic illustration, soft shadows, intimate atmosphere',
  'Cute cartoon couple holding hands, kawaii style, pastel colors, pink and blue theme, simple illustration, happy expressions, love hearts floating',
  'Beautiful rose bouquet, soft pink petals, romantic lighting, elegant composition, pastel background, love gift illustration, delicate details',
  'Wedding rings on soft fabric, romantic close-up, warm golden lighting, elegant jewelry photography, love symbol, soft focus background'
];

export default function ImagePanel({ onClose, onImageAdd }: ImagePanelProps) {
  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-end">
      <div className="w-full bg-white rounded-t-3xl border-t border-pink-100 animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800">Add Images</h3>
          <button 
            onClick={onClose}
            className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center !rounded-button"
          >
            <i className="ri-close-line text-gray-600"></i>
          </button>
        </div>

        {/* Content */}
        <div className="max-h-80 overflow-y-auto p-4">
          <div className="grid grid-cols-2 gap-3">
            {loveImages.map((prompt, index) => (
              <button
                key={index}
                onClick={() => onImageAdd(`https://readdy.ai/api/search-image?query=$%7BencodeURIComponent%28prompt%29%7D&width=150&height=150&seq=${index}&orientation=squarish`)}
                className="aspect-square bg-gray-100 rounded-xl overflow-hidden hover:scale-105 transition-all !rounded-button"
              >
                <img
                  src={`https://readdy.ai/api/search-image?query=$%7BencodeURIComponent%28prompt%29%7D&width=150&height=150&seq=${index}&orientation=squarish`}
                  alt="Love theme"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Upload Section */}
        <div className="p-4 border-t border-gray-100">
          <button className="w-full border-2 border-dashed border-pink-200 rounded-xl py-6 flex flex-col items-center text-pink-400 hover:border-pink-300 hover:bg-pink-50 transition-all !rounded-button">
            <i className="ri-upload-cloud-line text-2xl mb-2"></i>
            <span className="text-sm font-medium">Upload Your Photo</span>
            <span className="text-xs text-gray-400">Share your special moments</span>
          </button>
        </div>

        {/* Bottom Safe Area */}
        <div className="h-8"></div>
      </div>
    </div>
  );
}