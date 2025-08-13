
'use client';

import { useRef, useEffect, useState } from 'react';

interface CanvasProps {
  activeMode: 'draw' | 'sticker' | 'text' | 'image' | 'drag';
  brushColor: string;
  brushSize: number;
  elements: any[];
  setElements: (elements: any[]) => void;
  selectedElement: string | null;
  setSelectedElement: (id: string | null) => void;
}

export default function Canvas({ 
  activeMode, 
  brushColor, 
  brushSize, 
  elements, 
  setElements,
  selectedElement,
  setSelectedElement
}: CanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [paths, setPaths] = useState<any[]>([]);
  const [isOffline, setIsOffline] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  // Offline detection
  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    setIsOffline(!navigator.onLine);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Auto-save simulation
  useEffect(() => {
    if (elements.length > 0 || paths.length > 0) {
      const timer = setTimeout(() => {
        setLastSaved(new Date());
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [elements, paths]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Minimalist background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Subtle grid (optional)
    if (elements.length === 0 && paths.length === 0) {
      ctx.strokeStyle = '#f8f9fa';
      ctx.lineWidth = 0.5;
      const gridSize = 30;
      for (let x = gridSize; x < canvas.width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = gridSize; y < canvas.height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }
    }
    
    // Draw paths
    paths.forEach(path => {
      if (path.points.length < 2) return;
      
      ctx.strokeStyle = path.color;
      ctx.lineWidth = path.size;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      
      ctx.beginPath();
      ctx.moveTo(path.points[0].x, path.points[0].y);
      
      for (let i = 1; i < path.points.length - 1; i++) {
        const cpx = (path.points[i].x + path.points[i + 1].x) / 2;
        const cpy = (path.points[i].y + path.points[i + 1].y) / 2;
        ctx.quadraticCurveTo(path.points[i].x, path.points[i].y, cpx, cpy);
      }
      
      if (path.points.length > 1) {
        const lastPoint = path.points[path.points.length - 1];
        ctx.lineTo(lastPoint.x, lastPoint.y);
      }
      
      ctx.stroke();
    });
    
    // Draw elements
    elements.forEach(element => {
      ctx.save();
      ctx.translate(element.x, element.y);
      ctx.scale(element.scale || 1, element.scale || 1);
      ctx.rotate((element.rotation || 0) * Math.PI / 180);
      
      if (element.type === 'text') {
        ctx.fillStyle = element.style.color;
        ctx.font = `${element.style.size}px ${element.style.font}`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(element.content, 0, 0);
      } else if (element.type === 'sticker') {
        ctx.font = '48px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(element.content, 0, 0);
      } else if (element.type === 'image' && element.imageElement) {
        const size = 100 * (element.scale || 1);
        ctx.drawImage(element.imageElement, -size/2, -size/2, size, size);
      }
      
      ctx.restore();
      
      // Minimalist selection border
      if (element.id === selectedElement && activeMode !== 'draw') {
        ctx.strokeStyle = '#ff6b9d';
        ctx.lineWidth = 2;
        ctx.setLineDash([6, 3]);
        const padding = element.type === 'image' ? 60 : 40;
        
        ctx.strokeRect(element.x - padding/2, element.y - padding/2, padding, padding);
        ctx.setLineDash([]);
        
        // Simple corner handles
        const corners = [
          { x: element.x - padding/2, y: element.y - padding/2 },
          { x: element.x + padding/2, y: element.y - padding/2 },
          { x: element.x - padding/2, y: element.y + padding/2 },
          { x: element.x + padding/2, y: element.y + padding/2 }
        ];
        
        ctx.fillStyle = '#ff6b9d';
        corners.forEach(corner => {
          ctx.beginPath();
          ctx.arc(corner.x, corner.y, 4, 0, 2 * Math.PI);
          ctx.fill();
        });
      }
    });
  }, [elements, selectedElement, paths, activeMode]);

  const getEventPosition = (e: React.TouchEvent | React.MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    
    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    
    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    };
  };

  const findElementAtPosition = (x: number, y: number) => {
    for (let i = elements.length - 1; i >= 0; i--) {
      const element = elements[i];
      const distance = Math.sqrt((x - element.x) ** 2 + (y - element.y) ** 2);
      const hitRadius = element.type === 'image' ? 50 : 30;
      
      if (distance < hitRadius) {
        return element;
      }
    }
    return null;
  };

  const startDrawing = (e: React.TouchEvent | React.MouseEvent) => {
    const position = getEventPosition(e);
    
    if (activeMode === 'draw') {
      setIsDrawing(true);
      const newPath = {
        id: Date.now().toString(),
        points: [position],
        color: brushColor,
        size: brushSize
      };
      setPaths(prev => [...prev, newPath]);
      
      if ('vibrate' in navigator) {
        navigator.vibrate(10);
      }
    } else {
      const clickedElement = findElementAtPosition(position.x, position.y);
      
      if (clickedElement) {
        setSelectedElement(clickedElement.id);
        setDragOffset({ 
          x: position.x - clickedElement.x, 
          y: position.y - clickedElement.y 
        });
        setIsDragging(true);
        
        if ('vibrate' in navigator) {
          navigator.vibrate(15);
        }
      } else {
        setSelectedElement(null);
      }
    }
  };

  const handleMove = (e: React.TouchEvent | React.MouseEvent) => {
    const position = getEventPosition(e);
    
    if (isDrawing && activeMode === 'draw') {
      setPaths(prev => {
        const newPaths = [...prev];
        const currentPath = newPaths[newPaths.length - 1];
        if (currentPath) {
          currentPath.points.push(position);
        }
        return newPaths;
      });
    } else if (isDragging && selectedElement) {
      setElements(prev => prev.map(element => 
        element.id === selectedElement 
          ? { 
              ...element, 
              x: Math.max(50, Math.min(293, position.x - dragOffset.x)),
              y: Math.max(50, Math.min(350, position.y - dragOffset.y))
            }
          : element
      ));
    }
  };

  const stopInteraction = () => {
    setIsDrawing(false);
    setIsDragging(false);
  };

  // Load images for image elements
  useEffect(() => {
    elements.forEach(element => {
      if (element.type === 'image' && element.content && !element.imageElement) {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
          setElements(prev => prev.map(el => 
            el.id === element.id ? { ...el, imageElement: img } : el
          ));
        };
        img.onerror = () => {
          console.warn('Failed to load image:', element.content);
        };
        img.src = element.content;
      }
    });
  }, [elements, setElements]);

  return (
    <div className="relative">
      {/* Minimalist Offline Indicator */}
      {isOffline && (
        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-3 py-1 rounded-full">
          Offline
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <canvas
          ref={canvasRef}
          width={343}
          height={400}
          className="block touch-none"
          onMouseDown={startDrawing}
          onMouseMove={handleMove}
          onMouseUp={stopInteraction}
          onMouseLeave={stopInteraction}
          onTouchStart={startDrawing}
          onTouchMove={handleMove}
          onTouchEnd={stopInteraction}
          style={{ 
            cursor: isDragging ? 'grabbing' : activeMode === 'draw' ? 'crosshair' : 'grab'
          }}
        />
      </div>
      
      {/* Minimalist Mode Indicator */}
      <div className="absolute -top-8 left-0 right-0 flex justify-center">
        <div className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full border border-gray-200">
          <span className="text-xs text-gray-600 capitalize flex items-center">
            {activeMode === 'draw' && <i className="ri-brush-line mr-1 text-pink-500"></i>}
            {activeMode === 'sticker' && <i className="ri-emotion-happy-line mr-1 text-yellow-500"></i>}
            {activeMode === 'text' && <i className="ri-text mr-1 text-blue-500"></i>}
            {activeMode === 'image' && <i className="ri-image-line mr-1 text-green-500"></i>}
            {activeMode === 'drag' && <i className="ri-drag-move-line mr-1 text-purple-500"></i>}
            {activeMode}
          </span>
        </div>
      </div>

      {/* Simplified Element Controls */}
      {selectedElement && activeMode !== 'draw' && (
        <div className="absolute -bottom-12 left-0 right-0 flex justify-center">
          <div className="bg-white/90 backdrop-blur-sm px-3 py-2 rounded-full border border-gray-200 flex items-center space-x-2">
            <button
              onClick={() => {
                setElements(prev => prev.map(el => 
                  el.id === selectedElement 
                    ? { ...el, scale: Math.max(0.3, (el.scale || 1) - 0.1) }
                    : el
                ));
              }}
              className="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center hover:bg-pink-200 transition-colors !rounded-button"
            >
              <i className="ri-subtract-line text-pink-600 text-sm"></i>
            </button>
            
            <button
              onClick={() => {
                setElements(prev => prev.map(el => 
                  el.id === selectedElement 
                    ? { ...el, scale: Math.min(2, (el.scale || 1) + 0.1) }
                    : el
                ));
              }}
              className="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center hover:bg-pink-200 transition-colors !rounded-button"
            >
              <i className="ri-add-line text-pink-600 text-sm"></i>
            </button>
            
            <button
              onClick={() => {
                setElements(prev => prev.filter(el => el.id !== selectedElement));
                setSelectedElement(null);
              }}
              className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center hover:bg-red-200 transition-colors !rounded-button"
            >
              <i className="ri-delete-bin-line text-red-600 text-sm"></i>
            </button>
          </div>
        </div>
      )}

      {/* Simple Save Status */}
      {lastSaved && (
        <div className="absolute top-2 right-2">
          <div className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs">
            Saved
          </div>
        </div>
      )}

      {/* Minimalist Empty State */}
      {elements.length === 0 && paths.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center text-gray-400">
            <i className="ri-brush-line text-2xl mb-2"></i>
            <p className="text-sm">Start creating</p>
          </div>
        </div>
      )}
    </div>
  );
}
