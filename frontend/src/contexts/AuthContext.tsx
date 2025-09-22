import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { apiService } from '@/services/api';
import toast from 'react-hot-toast';

// Types
interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'team_member';
  teamIds: string[];
  isActive: boolean;
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string, rememberMe?: boolean) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (userData: Partial<User>) => void;
  clearError: () => void;
  checkAuth: () => Promise<void>;
  hasRole: (role: string) => boolean;
  hasPermission: (permission: string) => boolean;
  isTeamMember: (teamId: string) => boolean;
}

interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  teamIds?: string[];
}

// Action types
type AuthAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'CLEAR_ERROR' }
  | { type: 'LOGIN_SUCCESS'; payload: User }
  | { type: 'LOGOUT_SUCCESS' }
  | { type: 'UPDATE_USER'; payload: Partial<User> };

// Initial state
const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
};

// Reducer
function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };

    case 'SET_USER':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: !!action.payload,
        isLoading: false,
        error: null,
      };

    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        isLoading: false,
      };

    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null,
      };

    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };

    case 'LOGOUT_SUCCESS':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      };

    case 'UPDATE_USER':
      return {
        ...state,
        user: state.user ? { ...state.user, ...action.payload } : null,
      };

    default:
      return state;
  }
}

// Role permissions mapping
const ROLE_PERMISSIONS = {
  admin: [
    'dependencies:manage_all',
    'teams:create',
    'teams:update',
    'teams:delete',
    'teams:manage_members',
    'users:create',
    'users:update',
    'users:delete',
    'users:manage_roles',
    'requests:approve',
    'requests:reject',
    'notifications:send',
    'notifications:manage',
    'analytics:advanced',
  ],
  team_member: [
    'dependencies:read',
    'dependencies:create',
    'dependencies:update',
    'teams:read',
    'requests:create',
    'requests:update',
    'notifications:read',
    'analytics:read',
  ],
};

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider component
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Check authentication status on mount
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      const token = localStorage.getItem('accessToken');
      if (!token) {
        dispatch({ type: 'SET_USER', payload: null });
        return;
      }

      const userData = await apiService.getCurrentUser();
      dispatch({ type: 'LOGIN_SUCCESS', payload: userData.user });
      
      // Store user data in localStorage for persistence
      localStorage.setItem('user', JSON.stringify(userData.user));
      
    } catch (error: any) {
      console.error('Auth check failed:', error);
      // Clear invalid tokens
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      dispatch({ type: 'SET_USER', payload: null });
    }
  };

  const login = async (email: string, password: string, rememberMe = false) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'CLEAR_ERROR' });

      const response = await apiService.login({ email, password, rememberMe });
      
      // Store tokens and user data
      localStorage.setItem('accessToken', response.tokens.accessToken);
      localStorage.setItem('refreshToken', response.tokens.refreshToken);
      localStorage.setItem('user', JSON.stringify(response.user));

      dispatch({ type: 'LOGIN_SUCCESS', payload: response.user });
      
      toast.success('Login successful!');
      
    } catch (error: any) {
      const errorMessage = error.response?.data?.error?.message || 'Login failed';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      toast.error(errorMessage);
      throw error;
    }
  };

  const register = async (userData: RegisterData) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'CLEAR_ERROR' });

      const response = await apiService.register(userData);
      
      // Store tokens and user data
      localStorage.setItem('accessToken', response.tokens.accessToken);
      localStorage.setItem('refreshToken', response.tokens.refreshToken);
      localStorage.setItem('user', JSON.stringify(response.user));

      dispatch({ type: 'LOGIN_SUCCESS', payload: response.user });
      
      toast.success('Registration successful!');
      
    } catch (error: any) {
      const errorMessage = error.response?.data?.error?.message || 'Registration failed';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      toast.error(errorMessage);
      throw error;
    }
  };

  const logout = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      await apiService.logout();
      
      // Clear all stored data
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');

      dispatch({ type: 'LOGOUT_SUCCESS' });
      
      toast.success('Logged out successfully');
      
    } catch (error: any) {
      console.error('Logout error:', error);
      // Clear data even if API call fails
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      
      dispatch({ type: 'LOGOUT_SUCCESS' });
      
      toast.success('Logged out successfully');
    }
  };

  const updateUser = (userData: Partial<User>) => {
    dispatch({ type: 'UPDATE_USER', payload: userData });
    
    // Update localStorage
    if (state.user) {
      const updatedUser = { ...state.user, ...userData };
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
  };

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  const hasRole = (role: string): boolean => {
    if (!state.user) return false;
    return state.user.role === role;
  };

  const hasPermission = (permission: string): boolean => {
    if (!state.user) return false;
    
    const userPermissions = ROLE_PERMISSIONS[state.user.role as keyof typeof ROLE_PERMISSIONS] || [];
    return userPermissions.includes(permission);
  };

  const isTeamMember = (teamId: string): boolean => {
    if (!state.user) return false;
    return state.user.teamIds.includes(teamId);
  };

  const contextValue: AuthContextType = {
    ...state,
    login,
    register,
    logout,
    updateUser,
    clearError,
    checkAuth,
    hasRole,
    hasPermission,
    isTeamMember,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook to use auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;


