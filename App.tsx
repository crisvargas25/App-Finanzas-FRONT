import React from 'react';
//import "./global.css"
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import 'react-native-gesture-handler';
import { useCustomFonts } from './src/hooks/useCustomFonts';
import { Text } from 'react-native';
import { AuthProvider } from './src/contexts/AuthContext';

import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  const fontsLoaded = useCustomFonts();

  if (!fontsLoaded) {
    return <Text>Loading fonts...</Text>;
  }

  return (
    <AuthProvider>
      <GluestackUIProvider mode="light">
        <NavigationContainer>
          <AppNavigator />
          <StatusBar style="light" />
        </NavigationContainer>
      </GluestackUIProvider>
    </AuthProvider>
  );
}
