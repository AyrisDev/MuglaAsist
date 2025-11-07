import React from 'react';
import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { QueryClientProvider } from '@tanstack/react-query';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import RootNavigator from './src/navigation/RootNavigator';
import { queryClient } from './src/lib/queryClient';
import { Colors } from './src/constants/Colors';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

// Custom dark theme for navigation
const customDarkTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: Colors.primary,
    background: Colors.background,
    card: Colors.surface,
    text: Colors.text,
    border: Colors.border,
    notification: Colors.primary,
  },
};

export default function App() {
  const [appIsReady, setAppIsReady] = React.useState(false);

  React.useEffect(() => {
    async function prepare() {
      try {
        // Pre-load fonts, make API calls, etc.
        await new Promise((resolve) => setTimeout(resolve, 100));
      } catch (e) {
        console.warn(e);
      } finally {
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  const onLayoutRootView = React.useCallback(async () => {
    if (appIsReady) {
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <NavigationContainer theme={customDarkTheme} onReady={onLayoutRootView}>
        <StatusBar style="light" />
        <RootNavigator />
      </NavigationContainer>
    </QueryClientProvider>
  );
}
