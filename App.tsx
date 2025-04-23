import 'react-native-get-random-values';
import React, { useEffect, useState } from 'react';
import { StyleSheet, LogBox } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { AuthProvider } from './src/context/AuthContext';
import Navigation from './src/navigation';
import { configureAmplify } from './src/amplifyconfiguration';

// Ignore specific warnings
LogBox.ignoreLogs([
  'AsyncStorage has been extracted from react-native core',
  'Setting a timer for a long period of time',
  'Amplify has not been configured',
  'Error fetching'
]);

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync().catch(() => {
  // Ignore errors
});

export default function App() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        // Initialize mock services
        configureAmplify();
        
        // Add a delay to simulate loading
        await new Promise(resolve => setTimeout(resolve, 800));
      } catch (e) {
        // Ignore errors
      } finally {
        // Hide splash screen and mark as ready
        setIsReady(true);
        try {
          await SplashScreen.hideAsync();
        } catch {
          // Ignore errors
        }
      }
    }

    prepare();
  }, []);

  if (!isReady) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <AuthProvider>
        <Navigation />
      </AuthProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
