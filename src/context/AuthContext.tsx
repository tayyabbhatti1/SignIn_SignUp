import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert, Platform } from 'react-native';
import { useGoogleAuth, signInWithApple, initializeWebBrowserAsync } from '../services/SocialAuthService';

interface User {
  email: string;
  name?: string;
  sub?: string;
  id?: string;
  picture?: string;
  provider?: string;
}

interface AuthContextData {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isAuthenticating: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  confirmSignUp: (email: string, code: string) => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  confirmForgotPassword: (email: string, code: string, newPassword: string) => Promise<void>;
  resendConfirmationCode: (email: string) => Promise<void>;
  signOut: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signInWithApple: () => Promise<void>;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

// Demo user data (for testing without AWS Cognito)
const DEMO_USERS = {
  'user@example.com': {
    password: 'Password123',
    name: 'Demo User',
    needsConfirmation: false,
  }
};

// Demo storage keys
const USER_STORAGE_KEY = '@auth/user';
const USERS_STORAGE_KEY = '@auth/users';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Initialize Google Sign In
  const { signInWithGoogle: googleSignIn } = useGoogleAuth();

  // Initialize web browser for OAuth
  useEffect(() => {
    initializeWebBrowserAsync();
  }, []);

  // Initialize demo users in AsyncStorage if they don't exist
  useEffect(() => {
    const initDemoUsers = async () => {
      try {
        const storedUsers = await AsyncStorage.getItem(USERS_STORAGE_KEY);
        if (!storedUsers) {
          await AsyncStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(DEMO_USERS));
        }
      } catch (error) {
        console.error('Error initializing demo users:', error);
      }
    };
    
    initDemoUsers();
  }, []);

  const loadUser = async () => {
    setIsLoading(true);
    try {
      const storedUserJson = await AsyncStorage.getItem(USER_STORAGE_KEY);
      if (storedUserJson) {
        const storedUser = JSON.parse(storedUserJson);
        setUser(storedUser);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Error loading user:', error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Check if user is already signed in
    loadUser();
  }, []);

  // Mock authentication methods
  const handleSignIn = async (email: string, password: string) => {
    setError(null);
    setIsAuthenticating(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Get stored users
      const storedUsersJson = await AsyncStorage.getItem(USERS_STORAGE_KEY);
      const storedUsers = storedUsersJson ? JSON.parse(storedUsersJson) : DEMO_USERS;
      
      // Check if user exists
      const demoUser = storedUsers[email];
      if (!demoUser) {
        throw new Error('User not found');
      }
      
      // Check password
      if (demoUser.password !== password) {
        throw new Error('Incorrect password');
      }
      
      // Check if user needs to confirm email
      if (demoUser.needsConfirmation) {
        throw new Error('Please confirm your email first');
      }
      
      // Set user data in state and storage
      const userData = {
        email,
        name: demoUser.name,
        provider: 'cognito',
      };
      
      await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userData));
      setUser(userData);
    } catch (error: any) {
      console.error('Sign in error:', error);
      setError(error.message || 'Failed to sign in');
      throw error;
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleSignUp = async (email: string, password: string, name: string) => {
    setError(null);
    setIsAuthenticating(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Get stored users
      const storedUsersJson = await AsyncStorage.getItem(USERS_STORAGE_KEY);
      const storedUsers = storedUsersJson ? JSON.parse(storedUsersJson) : DEMO_USERS;
      
      // Check if user exists
      if (storedUsers[email]) {
        throw new Error('Email already registered');
      }
      
      // Add new user
      storedUsers[email] = {
        password,
        name,
        needsConfirmation: true,
      };
      
      // Save updated users
      await AsyncStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(storedUsers));
    } catch (error: any) {
      console.error('Sign up error:', error);
      setError(error.message || 'Failed to sign up');
      throw error;
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleConfirmSignUp = async (email: string, code: string) => {
    setError(null);
    setIsAuthenticating(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In this mock version, any code will work
      if (code.length !== 6) {
        throw new Error('Confirmation code must be 6 digits');
      }
      
      // Get stored users
      const storedUsersJson = await AsyncStorage.getItem(USERS_STORAGE_KEY);
      const storedUsers = storedUsersJson ? JSON.parse(storedUsersJson) : DEMO_USERS;
      
      // Check if user exists
      if (!storedUsers[email]) {
        throw new Error('User not found');
      }
      
      // Update user confirmation status
      storedUsers[email].needsConfirmation = false;
      
      // Save updated users
      await AsyncStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(storedUsers));
    } catch (error: any) {
      console.error('Confirm sign up error:', error);
      setError(error.message || 'Failed to confirm sign up');
      throw error;
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleForgotPassword = async (email: string) => {
    setError(null);
    setIsAuthenticating(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Get stored users
      const storedUsersJson = await AsyncStorage.getItem(USERS_STORAGE_KEY);
      const storedUsers = storedUsersJson ? JSON.parse(storedUsersJson) : DEMO_USERS;
      
      // Check if user exists
      if (!storedUsers[email]) {
        throw new Error('User not found');
      }
      
      // In mock version, we don't actually send an email
      console.log(`[MOCK] Password reset code sent to ${email}`);
    } catch (error: any) {
      console.error('Forgot password error:', error);
      setError(error.message || 'Failed to send reset password code');
      throw error;
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleConfirmForgotPassword = async (email: string, code: string, newPassword: string) => {
    setError(null);
    setIsAuthenticating(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In this mock version, any code will work
      if (code.length !== 6) {
        throw new Error('Confirmation code must be 6 digits');
      }
      
      // Get stored users
      const storedUsersJson = await AsyncStorage.getItem(USERS_STORAGE_KEY);
      const storedUsers = storedUsersJson ? JSON.parse(storedUsersJson) : DEMO_USERS;
      
      // Check if user exists
      if (!storedUsers[email]) {
        throw new Error('User not found');
      }
      
      // Update password
      storedUsers[email].password = newPassword;
      
      // Save updated users
      await AsyncStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(storedUsers));
    } catch (error: any) {
      console.error('Confirm forgot password error:', error);
      setError(error.message || 'Failed to reset password');
      throw error;
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleResendConfirmationCode = async (email: string) => {
    setError(null);
    setIsAuthenticating(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Get stored users
      const storedUsersJson = await AsyncStorage.getItem(USERS_STORAGE_KEY);
      const storedUsers = storedUsersJson ? JSON.parse(storedUsersJson) : DEMO_USERS;
      
      // Check if user exists
      if (!storedUsers[email]) {
        throw new Error('User not found');
      }
      
      // In mock version, we don't actually send an email
      console.log(`[MOCK] Confirmation code resent to ${email}`);
    } catch (error: any) {
      console.error('Resend confirmation code error:', error);
      setError(error.message || 'Failed to resend confirmation code');
      throw error;
    } finally {
      setIsAuthenticating(false);
    }
  };

  // Social sign-in methods
  const handleGoogleSignIn = async () => {
    setError(null);
    setIsAuthenticating(true);
    try {
      const userInfo = await googleSignIn();
      if (userInfo) {
        await loadUser();
      }
    } catch (error: any) {
      console.error('Google sign in error:', error);
      setError(error.message || 'Failed to sign in with Google');
      throw error;
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleAppleSignIn = async () => {
    setError(null);
    setIsAuthenticating(true);
    try {
      // Apple Sign In only works on iOS
      if (Platform.OS !== 'ios') {
        Alert.alert('Not Supported', 'Apple Sign In is only available on iOS devices');
        return;
      }
      
      const credentials = await signInWithApple();
      if (credentials) {
        await loadUser();
      }
    } catch (error: any) {
      console.error('Apple sign in error:', error);
      setError(error.message || 'Failed to sign in with Apple');
      throw error;
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleSignOut = async () => {
    setError(null);
    setIsAuthenticating(true);
    try {
      // Clear local storage
      await AsyncStorage.removeItem(USER_STORAGE_KEY);
      setUser(null);
    } catch (error: any) {
      console.error('Sign out error:', error);
      setError(error.message || 'Failed to sign out');
      throw error;
    } finally {
      setIsAuthenticating(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        isAuthenticating,
        error,
        signIn: handleSignIn,
        signUp: handleSignUp,
        confirmSignUp: handleConfirmSignUp,
        forgotPassword: handleForgotPassword,
        confirmForgotPassword: handleConfirmForgotPassword,
        resendConfirmationCode: handleResendConfirmationCode,
        signOut: handleSignOut,
        signInWithGoogle: handleGoogleSignIn,
        signInWithApple: handleAppleSignIn,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export default AuthContext; 