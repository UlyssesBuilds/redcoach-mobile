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

const TOKEN_KEY = 'redcoach_token';
const USER_KEY = 'redcoach_user';

// Simulate JWT token generation
const generateToken = (userId: string): string => {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = btoa(JSON.stringify({ userId, exp: Date.now() + 7 * 24 * 60 * 60 * 1000 }));
  const signature = btoa(`${header}.${payload}.signature`);
  return `${header}.${payload}.${signature}`;
};

export const authService = {
  async login(email: string, password: string): Promise<{ user: User; token: string }> {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Check if user exists in storage
    const existingUser = await this.getUserByEmail(email);
    
    if (!existingUser) {
      throw new Error('User not found');
    }

    const token = generateToken(existingUser.id);
    await Preferences.set({ key: TOKEN_KEY, value: token });
    await Preferences.set({ key: USER_KEY, value: JSON.stringify(existingUser) });

    return { user: existingUser, token };
  },

  async signup(email: string, password: string, name: string): Promise<{ user: User; token: string }> {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Check if user already exists
    const existingUser = await this.getUserByEmail(email);
    if (existingUser) {
      throw new Error('User already exists');
    }

    const newUser: User = {
      id: `user_${Date.now()}`,
      email,
      name,
      onboardingCompleted: false,
      createdAt: new Date().toISOString()
    };

    const token = generateToken(newUser.id);
    
    // Store user data
    await this.saveUser(newUser);
    await Preferences.set({ key: TOKEN_KEY, value: token });
    await Preferences.set({ key: USER_KEY, value: JSON.stringify(newUser) });

    return { user: newUser, token };
  },

  async getCurrentUser(): Promise<{ user: User; token: string } | null> {
    try {
      const tokenResult = await Preferences.get({ key: TOKEN_KEY });
      const userResult = await Preferences.get({ key: USER_KEY });

      if (!tokenResult.value || !userResult.value) {
        return null;
      }

      const user = JSON.parse(userResult.value) as User;
      return { user, token: tokenResult.value };
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  },

  async logout(): Promise<void> {
    await Preferences.remove({ key: TOKEN_KEY });
    await Preferences.remove({ key: USER_KEY });
  },

  async updateUser(user: User): Promise<User> {
    await this.saveUser(user);
    await Preferences.set({ key: USER_KEY, value: JSON.stringify(user) });
    return user;
  },

  async getUserByEmail(email: string): Promise<User | null> {
    try {
      const usersResult = await Preferences.get({ key: 'redcoach_users' });
      if (!usersResult.value) return null;

      const users = JSON.parse(usersResult.value) as User[];
      return users.find(u => u.email === email) || null;
    } catch {
      return null;
    }
  },

  async saveUser(user: User): Promise<void> {
    try {
      const usersResult = await Preferences.get({ key: 'redcoach_users' });
      const users = usersResult.value ? JSON.parse(usersResult.value) as User[] : [];
      
      const existingIndex = users.findIndex(u => u.id === user.id);
      if (existingIndex >= 0) {
        users[existingIndex] = user;
      } else {
        users.push(user);
      }
      
      await Preferences.set({ key: 'redcoach_users', value: JSON.stringify(users) });
    } catch (error) {
      console.error('Error saving user:', error);
    }
  }
};