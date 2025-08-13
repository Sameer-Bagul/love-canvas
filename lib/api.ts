// API configuration for Node.js backend integration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

class ApiClient {
  private baseUrl: string;
  private token: string | null = null;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
    this.token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
  }

  private async request<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API Request failed:', error);
      throw error;
    }
  }

  setToken(token: string) {
    this.token = token;
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', token);
    }
  }

  clearToken() {
    this.token = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
    }
  }

  // Auth endpoints
  async login(email: string, password: string) {
    return this.request<{ user: any; token: string; partner?: any }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async register(name: string, email: string, password: string) {
    return this.request<{ user: any; token: string }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    });
  }

  async logout() {
    return this.request('/auth/logout', {
      method: 'POST',
    });
  }

  // Partner connection endpoints
  async connectPartner(partnerCode: string) {
    return this.request<{ partner: any; canvas: any }>('/partner/connect', {
      method: 'POST',
      body: JSON.stringify({ partnerCode }),
    });
  }

  async getPartnerStatus() {
    return this.request<{ partner: any; isConnected: boolean }>('/partner/status');
  }

  async disconnectPartner() {
    return this.request('/partner/disconnect', {
      method: 'DELETE',
    });
  }

  // Canvas endpoints
  async getCanvas() {
    return this.request<{ 
      elements: any[]; 
      lastUpdated: string;
      partner?: any;
    }>('/canvas');
  }

  async saveCanvas(elements: any[]) {
    return this.request<{ success: boolean }>('/canvas/save', {
      method: 'POST',
      body: JSON.stringify({ elements }),
    });
  }

  async getCanvasHistory() {
    return this.request<{ history: any[] }>('/canvas/history');
  }

  // Real-time canvas updates
  async broadcastCanvasUpdate(elements: any[]) {
    return this.request<{ success: boolean }>('/canvas/broadcast', {
      method: 'POST',
      body: JSON.stringify({ elements }),
    });
  }

  // User profile endpoints
  async getUserProfile() {
    return this.request<{ user: any; partner?: any }>('/user/profile');
  }

  async updateProfile(data: { name?: string; avatar?: string }) {
    return this.request<{ user: any }>('/user/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // Image upload endpoint
  async uploadImage(file: File) {
    const formData = new FormData();
    formData.append('image', file);

    return this.request<{ imageUrl: string }>('/upload/image', {
      method: 'POST',
      body: formData,
      headers: {
        // Remove Content-Type header to let browser set it with boundary
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
      },
    });
  }
}

export const apiClient = new ApiClient(API_BASE_URL);

// WebSocket connection for real-time updates
export class WebSocketManager {
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;

  connect(token: string, onMessage: (data: any) => void) {
    const wsUrl = `${API_BASE_URL.replace('http', 'ws')}/ws?token=${token}`;
    
    this.ws = new WebSocket(wsUrl);

    this.ws.onopen = () => {
      console.log('WebSocket connected');
      this.reconnectAttempts = 0;
    };

    this.ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        onMessage(data);
      } catch (error) {
        console.error('Failed to parse WebSocket message:', error);
      }
    };

    this.ws.onclose = () => {
      console.log('WebSocket disconnected');
      this.attemptReconnect(token, onMessage);
    };

    this.ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
  }

  private attemptReconnect(token: string, onMessage: (data: any) => void) {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      setTimeout(() => {
        console.log(`Attempting to reconnect... (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
        this.connect(token, onMessage);
      }, this.reconnectDelay * this.reconnectAttempts);
    }
  }

  sendMessage(data: any) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(data));
    }
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }
}

export const wsManager = new WebSocketManager();