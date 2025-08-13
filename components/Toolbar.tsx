
'use client';

interface ToolbarProps {
  activeMode: 'draw' | 'sticker' | 'text' | 'image' | 'drag';
  setActiveMode: (mode: 'draw' | 'sticker' | 'text' | 'image' | 'drag') => void;
  showPanel: string | null;
  setShowPanel: (panel: string | null) => void;
  brushColor: string;
  setBrushColor: (color: string) => void;
  brushSize: number;
  setBrushSize: (size: number) => void;
}

const colors = ['#ff6b9d', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', '#ff9ff3', '#54a0ff', '#ee5a6f'];

export default function Toolbar({
  activeMode,
  setActiveMode,
  showPanel,
  setShowPanel,
  brushColor,
  setBrushColor,
  brushSize,
  setBrushSize
}: ToolbarProps) {
  const tools = [
    { id: 'draw', icon: 'ri-brush-line', label: 'Draw', color: 'pink' },
    { id: 'sticker', icon: 'ri-emotion-happy-line', label: 'Stickers', color: 'yellow' },
    { id: 'text', icon: 'ri-text', label: 'Text', color: 'blue' },
    { id: 'image', icon: 'ri-image-line', label: 'Image', color: 'green' },
    { id: 'drag', icon: 'ri-drag-move-line', label: 'Move', color: 'purple' },
  ];

  const handleToolClick = (toolId: string) => {
    // Haptic feedback
    if ('vibrate' in navigator) {
      navigator.vibrate(15);
    }
    
    setActiveMode(toolId as any);
    if (['sticker', 'text', 'image'].includes(toolId)) {
      setShowPanel(toolId === 'sticker' ? 'stickers' : toolId === 'text' ? 'text' : 'images');
    } else {
      setShowPanel(null);
    }
  };

  const getToolColorClass = (toolId: string, isActive: boolean) => {
    const colorMap: { [key: string]: { bg: string; text: string; activeBg: string; activeText: string } } = {
      draw: { bg: 'bg-pink-50', text: 'text-pink-600', activeBg: 'bg-pink-500', activeText: 'text-white' },
      sticker: { bg: 'bg-yellow-50', text: 'text-yellow-600', activeBg: 'bg-yellow-500', activeText: 'text-white' },
      text: { bg: 'bg-blue-50', text: 'text-blue-600', activeBg: 'bg-blue-500', activeText: 'text-white' },
      image: { bg: 'bg-green-50', text: 'text-green-600', activeBg: 'bg-green-500', activeText: 'text-white' },
      drag: { bg: 'bg-purple-50', text: 'text-purple-600', activeBg: 'bg-purple-500', activeText: 'text-white' },
    };

    const colors = colorMap[toolId] || colorMap.draw;
    
    if (isActive) {
      return `${colors.activeBg} ${colors.activeText} shadow-lg`;
    }
    return `${colors.bg} ${colors.text} hover:${colors.activeBg} hover:text-white`;
  };

  return (
    <>
      {/* Minimalist Draw Controls */}
      {activeMode === 'draw' && (
        <div className="bg-white/95 backdrop-blur-md border-t border-pink-100 px-4 py-3 shadow-lg">
          <div className="max-w-md mx-auto">
            {/* Simplified Color Palette */}
            <div className="flex justify-center mb-3">
              <div className="flex space-x-2 bg-gray-50/80 p-2 rounded-full">
                {colors.slice(0, 6).map(color => (
                  <button
                    key={color}
                    onClick={() => {
                      setBrushColor(color);
                      if ('vibrate' in navigator) navigator.vibrate(10);
                    }}
                    className={`w-7 h-7 rounded-full border transition-all duration-200 hover:scale-110 active:scale-95 ${
                      brushColor === color 
                        ? 'border-gray-700 shadow-md transform scale-110' 
                        : 'border-gray-300'
                    }`}
                    style={{ backgroundColor: color }}
                  >
                    {brushColor === color && (
                      <div className="w-full h-full rounded-full flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Simplified Brush Size Control */}
            <div className="flex items-center justify-center space-x-3">
              <button
                onClick={() => {
                  setBrushSize(Math.max(2, brushSize - 2));
                  if ('vibrate' in navigator) navigator.vibrate(5);
                }}
                className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow hover:shadow-md transition-all duration-200 !rounded-button"
              >
                <i className="ri-subtract-line text-gray-600 text-sm"></i>
              </button>
              
              <div className="flex items-center space-x-2 px-3">
                <span className="text-xs text-gray-600 font-medium">Size {brushSize}</span>
                <div 
                  className="rounded-full bg-current transition-all duration-200"
                  style={{ 
                    width: `${Math.max(brushSize + 2, 8)}px`, 
                    height: `${Math.max(brushSize + 2, 8)}px`,
                    color: brushColor
                  }}
                />
              </div>
              
              <button
                onClick={() => {
                  setBrushSize(Math.min(20, brushSize + 2));
                  if ('vibrate' in navigator) navigator.vibrate(5);
                }}
                className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow hover:shadow-md transition-all duration-200 !rounded-button"
              >
                <i className="ri-add-line text-gray-600 text-sm"></i>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Minimalist Main Toolbar */}
      <div className="bg-white/95 backdrop-blur-md border-t border-gray-100 shadow-lg">
        <div className="grid grid-cols-5 max-w-md mx-auto">
          {tools.map(tool => (
            <button
              key={tool.id}
              onClick={() => handleToolClick(tool.id)}
              className={`p-3 flex flex-col items-center space-y-1 transition-all duration-200 hover:scale-105 active:scale-95 !rounded-button ${
                getToolColorClass(tool.id, activeMode === tool.id)
              }`}
            >
              <i className={`${tool.icon} text-lg`}></i>
              <span className="text-xs font-medium">{tool.label}</span>
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
