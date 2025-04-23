import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import * as AppleAuthentication from 'expo-apple-authentication';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// You'll need to create a project in Google Cloud Console and get your client ID
// https://console.cloud.google.com/apis/credentials
const GOOGLE_CLIENT_ID_IOS = '520735091468-osqhoqbv6ucaaeeh51fp46m9op11fm33.apps.googleusercontent.com';  // Replace with actual ID
const GOOGLE_CLIENT_ID_ANDROID = 'YOUR_ANDROID_CLIENT_ID';  // Replace with actual ID
const GOOGLE_CLIENT_ID_WEB = 'YOUR_WEB_CLIENT_ID';  // Replace with actual ID

// Call this function early in your app to ensure WebBrowser redirects work properly
export const initializeWebBrowserAsync = async () => {
  try {
    await WebBrowser.warmUpAsync();
    return () => {
      WebBrowser.coolDownAsync();
    };
  } catch (error) {
    console.error('Failed to initialize web browser:', error);
    return () => {};
  }
};

// Google Authentication
export const useGoogleAuth = () => {
  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId: GOOGLE_CLIENT_ID_ANDROID,
    iosClientId: GOOGLE_CLIENT_ID_IOS,
    webClientId: GOOGLE_CLIENT_ID_WEB,
    // Do not include the clientId property as it causes issues
  });

  const signInWithGoogle = async () => {
    try {
      // For demo purposes, if no credentials are set yet, use mock data
      if (GOOGLE_CLIENT_ID_WEB === 'YOUR_WEB_CLIENT_ID') {
        console.log('Using mock Google auth because no credentials are set');
        const mockUserInfo = {
          id: 'google-' + Math.random().toString(36).substring(2, 15),
          email: 'user@example.com',
          name: 'Demo User',
          picture: 'https://via.placeholder.com/150',
          provider: 'google',
        };
        
        await AsyncStorage.setItem('@auth/user', JSON.stringify(mockUserInfo));
        return mockUserInfo;
      }

      // Check if Google Auth is properly configured
      if (!request) {
        console.error('Google authentication request not configured properly');
        throw new Error('Google authentication is not configured properly');
      }

      const result = await promptAsync();
      
      if (result.type === 'success') {
        // Get user info with the access token
        const userInfoResponse = await fetch(
          'https://www.googleapis.com/userinfo/v2/me',
          {
            headers: { Authorization: `Bearer ${result.authentication?.accessToken}` },
          }
        );
        
        const userInfo = await userInfoResponse.json();
        
        // Store user info
        await AsyncStorage.setItem('@auth/user', JSON.stringify({
          id: userInfo.id,
          email: userInfo.email,
          name: userInfo.name,
          picture: userInfo.picture,
          provider: 'google',
        }));
        
        return userInfo;
      }
      
      return null;
    } catch (error) {
      console.error('Google sign in error:', error);
      throw error;
    }
  };

  return {
    request,
    response,
    signInWithGoogle,
  };
};

// Apple Authentication
export const signInWithApple = async () => {
  try {
    // For demo purposes and non-iOS platforms, use mock data
    if (Platform.OS !== 'ios' || !AppleAuthentication.isAvailableAsync()) {
      // Check if this is running on iOS
      if (Platform.OS !== 'ios') {
        console.log('Using mock Apple auth because not on iOS');
        const mockCredential = {
          user: 'apple-' + Math.random().toString(36).substring(2, 15),
          email: 'apple.user@example.com',
          fullName: {
            givenName: 'Apple',
            familyName: 'User',
          },
        };
        
        await AsyncStorage.setItem('@auth/user', JSON.stringify({
          id: mockCredential.user,
          email: mockCredential.email,
          name: `${mockCredential.fullName.givenName} ${mockCredential.fullName.familyName}`,
          provider: 'apple',
        }));
        
        return mockCredential;
      }
      
      throw new Error('Apple authentication is not available on this device');
    }

    const credential = await AppleAuthentication.signInAsync({
      requestedScopes: [
        AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
        AppleAuthentication.AppleAuthenticationScope.EMAIL,
      ],
    });
    
    // Store user info
    await AsyncStorage.setItem('@auth/user', JSON.stringify({
      id: credential.user,
      email: credential.email,
      name: `${credential.fullName?.givenName || ''} ${credential.fullName?.familyName || ''}`.trim(),
      provider: 'apple',
    }));
    
    return credential;
  } catch (error: any) {
    console.error('Apple sign in error:', error);
    if (error.code === 'ERR_CANCELED') {
      // User canceled the sign-in
      return null;
    }
    throw error;
  }
}; 