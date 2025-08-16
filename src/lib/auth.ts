import { Preferences } from '@capacitor/preferences';

export interface User {
  id: string;
  email: string;
  name: string;
  height?: number;
  weight?: number;
  goal?: 'cut' | 'bulk' | 'maintain';
  exerciseType?: string;
  onboardingCompleted: boolean;
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
}

interface AuthResponse {
  access_token: string;
  token_type: string;
  user: User;
}

const TOKEN_KEY = 'redcoach_token';
const USER_KEY = 'redcoach_user';
const API_BASE_URL = 'https://caloriecounter-w8ul.onrender.com';

// Helper function to make authenticated requests
const makeAuthenticatedRequest = async (url: string, options: RequestInit = {}) => {
  const tokenResult = await Preferences.get({ key: TOKEN_KEY });
  const token = tokenResult.value;

  const headers = {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
    ...options.headers,
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  // Handle 401 unauthorized - clear stored data and redirect to login
  if (response.status === 401) {
    await Preferences.remove({ key: TOKEN_KEY });
    await Preferences.remove({ key: USER_KEY });
    throw new Error('Session expired');
  }

  return response;
};

export const authService = {
  async login(email: string, password: string): Promise<{ user: User; token: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: email, // FastAPI expects username field
          password: password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Login failed');
      }

      const authResponse: AuthResponse = await response.json();
      
      // Store token and user data
      await Preferences.set({ key: TOKEN_KEY, value: authResponse.access_token });
      await Preferences.set({ key: USER_KEY, value: JSON.stringify(authResponse.user) });

      return { 
        user: authResponse.user, 
        token: authResponse.access_token 
      };
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  async signup(email: string, password: string, name: string): Promise<{ user: User; token: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: email, // FastAPI expects username field
          email: email,
          password: password,
          name: name,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Registration failed');
      }

      const authResponse: AuthResponse = await response.json();
      
      // Store token and user data
      await Preferences.set({ key: TOKEN_KEY, value: authResponse.access_token });
      await Preferences.set({ key: USER_KEY, value: JSON.stringify(authResponse.user) });

      return { 
        user: authResponse.user, 
        token: authResponse.access_token 
      };
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  },

  async getCurrentUser(): Promise<{ user: User; token: string } | null> {
    try {
      const tokenResult = await Preferences.get({ key: TOKEN_KEY });
      
      if (!tokenResult.value) {
        return null;
      }

      // Verify token is still valid by fetching user data from backend
      const response = await makeAuthenticatedRequest(`${API_BASE_URL}/user/me`);
      
      if (!response.ok) {
        // Token is invalid, clear stored data
        await this.logout();
        return null;
      }

      const user: User = await response.json();
      
      // Update stored user data with fresh data from backend
      await Preferences.set({ key: USER_KEY, value: JSON.stringify(user) });

      return { user, token: tokenResult.value };
    } catch (error) {
      console.error('Error getting current user:', error);
      // Clear potentially corrupted data
      await this.logout();
      return null;
    }
  },

  async logout(): Promise<void> {
    await Preferences.remove({ key: TOKEN_KEY });
    await Preferences.remove({ key: USER_KEY });
  },

  async updateUser(user: User): Promise<User> {
    try {
      const response = await makeAuthenticatedRequest(`${API_BASE_URL}/user/me`, {
        method: 'PUT',
        body: JSON.stringify(user),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Update failed');
      }

      const updatedUser: User = await response.json();
      
      // Update stored user data
      await Preferences.set({ key: USER_KEY, value: JSON.stringify(updatedUser) });
      
      return updatedUser;
    } catch (error) {
      console.error('Update user error:', error);
      throw error;
    }
  },

  // Removed mock methods - no longer needed with real backend
};