import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { authService, User, AuthState } from '@/lib/auth';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (user: User) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    token: null,
    isLoading: true
  });
  const { toast } = useToast();

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const result = await authService.getCurrentUser();
      if (result) {
        setAuthState({
          user: result.user,
          token: result.token,
          isLoading: false
        });
      } else {
        setAuthState({ user: null, token: null, isLoading: false });
      }
    } catch (error) {
      setAuthState({ user: null, token: null, isLoading: false });
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true }));
      const result = await authService.login(email, password);
      setAuthState({
        user: result.user,
        token: result.token,
        isLoading: false
      });
      toast({
        title: "Welcome back!",
        description: `Good to see you again, ${result.user.name}`,
      });
    } catch (error) {
      setAuthState(prev => ({ ...prev, isLoading: false }));
      toast({
        variant: "destructive",
        title: "Login failed",
        description: error instanceof Error ? error.message : "Invalid credentials",
      });
      throw error;
    }
  };

  const signup = async (email: string, password: string, name: string) => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true }));
      const result = await authService.signup(email, password, name);
      setAuthState({
        user: result.user,
        token: result.token,
        isLoading: false
      });
      toast({
        title: "Account created!",
        description: `Welcome to RedCoach, ${result.user.name}!`,
      });
    } catch (error) {
      setAuthState(prev => ({ ...prev, isLoading: false }));
      toast({
        variant: "destructive",
        title: "Signup failed",
        description: error instanceof Error ? error.message : "Failed to create account",
      });
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      setAuthState({ user: null, token: null, isLoading: false });
      toast({
        title: "Logged out",
        description: "See you next time!",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Logout failed",
        description: "Failed to logout properly",
      });
    }
  };

  const updateUser = async (user: User) => {
    try {
      const updatedUser = await authService.updateUser(user);
      setAuthState(prev => ({ ...prev, user: updatedUser }));
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Update failed",
        description: "Failed to update user information",
      });
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        ...authState,
        login,
        signup,
        logout,
        updateUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};