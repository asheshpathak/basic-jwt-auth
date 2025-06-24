import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';
import type { AuthState, AuthContextType, LoginCredentials, RegisterCredentials, User } from '../types/auth';
import { apiClient } from '../utils/api';

type AuthAction =
  | { type: 'LOADING_START' }
  | { type: 'LOGIN_SUCCESS'; payload: { token: string; user: User } }
  | { type: 'LOGOUT' }
  | { type: 'ERROR'; payload: string }
  | { type: 'CLEAR_ERROR' };

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
  error: null
};

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'LOADING_START':
      return { ...state, isLoading: true, error: null };
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        isLoading: false,
        error: null
      };
    case 'LOGOUT':
      return { ...initialState, isLoading: false };
    case 'ERROR':
      return { ...state, error: action.payload, isLoading: false };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    default:
      return state;
  }
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem('authToken');
      
      if (storedToken) {
        try {
          const response = await apiClient.get('/auth/verify', {
            headers: { Authorization: `Bearer ${storedToken}` }
          });
          
          dispatch({ 
            type: 'LOGIN_SUCCESS', 
            payload: { token: storedToken, user: response.data.user } 
          });
        } catch (error) {
          localStorage.removeItem('authToken');
          dispatch({ type: 'LOGOUT' });
        }
      } else {
        dispatch({ type: 'LOGOUT' });
      }
    };

    initializeAuth();
  }, []);

  const login = async (credentials: LoginCredentials): Promise<void> => {
    dispatch({ type: 'LOADING_START' });
    
    try {
      const response = await apiClient.post('/auth/login', credentials);
      const { token, user } = response.data;
      
      localStorage.setItem('authToken', token);
      dispatch({ type: 'LOGIN_SUCCESS', payload: { token, user } });
    } catch (error: any) {
      const message = error.response?.data?.message || 'Login failed';
      dispatch({ type: 'ERROR', payload: message });
      throw error;
    }
  };

  const register = async (credentials: RegisterCredentials): Promise<void> => {
    dispatch({ type: 'LOADING_START' });
    
    try {
      const response = await apiClient.post('/auth/register', credentials);
      const { token, user } = response.data;
      
      localStorage.setItem('authToken', token);
      dispatch({ type: 'LOGIN_SUCCESS', payload: { token, user } });
    } catch (error: any) {
      const message = error.response?.data?.message || 'Registration failed';
      dispatch({ type: 'ERROR', payload: message });
      throw error;
    }
  };

  const logout = (): void => {
    localStorage.removeItem('authToken');
    dispatch({ type: 'LOGOUT' });
  };

const clearError = useCallback((): void => {
  dispatch({ type: 'CLEAR_ERROR' });
}, []);

  const getAuthToken = (): string | null => {
    return state.token || localStorage.getItem('authToken');
  };

  const value: AuthContextType = {
    user: state.user,
    isAuthenticated: state.isAuthenticated,
    isLoading: state.isLoading,
    error: state.error,
    login,
    register,
    logout,
    getAuthToken,
    clearError
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};