'use client';

import { useState, useEffect, useCallback } from 'react';
import { apiClient, wsManager } from '../lib/api';
import { useAuth } from '../contexts/AuthContext';

export interface CanvasElement {
  id: string;
  type: 'text' | 'sticker' | 'image' | 'drawing';
  content: string;
  x: number;
  y: number;
  scale?: number;
  rotation?: number;
  style?: any;
  imageElement?: HTMLImageElement;
}

export function useCanvas() {
  const { user, isAuthenticated, isConnected } = useAuth();
  const [elements, setElements] = useState<CanvasElement[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  
  // Auto-save delay
  const AUTOSAVE_DELAY = 2000; // 2 seconds
  const [saveTimeout, setSaveTimeout] = useState<NodeJS.Timeout | null>(null);

  // Load canvas data on component mount
  useEffect(() => {
    if (isAuthenticated && isConnected) {
      loadCanvas();
      initWebSocket();
    }
    
    return () => {
      wsManager.disconnect();
    };
  }, [isAuthenticated, isConnected]);

  // Auto-save when elements change
  useEffect(() => {
    if (elements.length > 0 && isAuthenticated && isConnected) {
      // Clear existing timeout
      if (saveTimeout) {
        clearTimeout(saveTimeout);
      }
      
      // Set new timeout for auto-save
      const timeout = setTimeout(() => {
        saveCanvas();
      }, AUTOSAVE_DELAY);
      
      setSaveTimeout(timeout);
    }
    
    return () => {
      if (saveTimeout) {
        clearTimeout(saveTimeout);
      }
    };
  }, [elements]);

  const loadCanvas = async () => {
    try {
      setIsLoading(true);
      const response = await apiClient.getCanvas();
      setElements(response.elements || []);
      setLastSaved(new Date(response.lastUpdated));
    } catch (error) {
      console.error('Failed to load canvas:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveCanvas = async () => {
    try {
      setIsSaving(true);
      await apiClient.saveCanvas(elements);
      setLastSaved(new Date());
      
      // Broadcast update to partner
      if (isConnected) {
        await apiClient.broadcastCanvasUpdate(elements);
      }
    } catch (error) {
      console.error('Failed to save canvas:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const initWebSocket = () => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      wsManager.connect(token, handleWebSocketMessage);
    }
  };

  const handleWebSocketMessage = useCallback((data: any) => {
    switch (data.type) {
      case 'canvas_update':
        // Update canvas elements from partner
        if (data.elements && data.userId !== user?.id) {
          setElements(data.elements);
        }
        break;
      
      case 'partner_connected':
        console.log('Partner connected:', data.partner);
        break;
        
      case 'partner_disconnected':
        console.log('Partner disconnected');
        break;
        
      default:
        console.log('Unknown WebSocket message:', data);
    }
  }, [user?.id]);

  const addElement = useCallback((element: Omit<CanvasElement, 'id'>) => {
    const newElement: CanvasElement = {
      ...element,
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    };
    
    setElements(prev => [...prev, newElement]);
  }, []);

  const updateElement = useCallback((id: string, updates: Partial<CanvasElement>) => {
    setElements(prev => prev.map(element => 
      element.id === id ? { ...element, ...updates } : element
    ));
  }, []);

  const removeElement = useCallback((id: string) => {
    setElements(prev => prev.filter(element => element.id !== id));
  }, []);

  const clearCanvas = useCallback(() => {
    setElements([]);
  }, []);

  const uploadImage = async (file: File): Promise<string> => {
    try {
      const response = await apiClient.uploadImage(file);
      return response.imageUrl;
    } catch (error) {
      console.error('Failed to upload image:', error);
      throw new Error('Failed to upload image');
    }
  };

  const getCanvasHistory = async () => {
    try {
      const response = await apiClient.getCanvasHistory();
      return response.history;
    } catch (error) {
      console.error('Failed to load canvas history:', error);
      return [];
    }
  };

  return {
    elements,
    setElements,
    isLoading,
    isSaving,
    lastSaved,
    addElement,
    updateElement,
    removeElement,
    clearCanvas,
    saveCanvas,
    loadCanvas,
    uploadImage,
    getCanvasHistory,
  };
}