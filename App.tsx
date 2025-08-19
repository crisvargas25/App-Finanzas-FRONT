import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { enableScreens } from 'react-native-screens';
import { StatusBar } from 'expo-status-bar';
import { GluestackUIProvider } from './src/shared/ui/gluestack-ui-provider';
import { AuthProvider } from './src/shared/contexts/AuthContext';
import { useCustomFonts } from './src/shared/hooks/useCustomFonts';
import { Text } from 'react-native';
import AppNavigator from './src/app/navigation/AppNavigator';
import { initDB } from './src/db/db';

enableScreens();

export default function App() {
  const fontsLoaded = useCustomFonts();
  const [dbReady, setDbReady] = useState(false);

  useEffect(() => {
    (async () => { await initDB(); setDbReady(true); })();
  }, []);

  if (!fontsLoaded || !dbReady)  {
    return <Text>Loading fonts...</Text>;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <AuthProvider>
          <GluestackUIProvider mode="light">
            <NavigationContainer>
              <AppNavigator />
              <StatusBar style="light" />
            </NavigationContainer>
          </GluestackUIProvider>
        </AuthProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}