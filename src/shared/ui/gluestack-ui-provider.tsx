import React from 'react';
import { View, StyleSheet } from 'react-native';

interface GluestackUIProviderProps {
  mode?: 'light' | 'dark';
  children: React.ReactNode;
}

export function GluestackUIProvider({ 
  children, 
  mode = 'light' 
}: GluestackUIProviderProps) {
  const themeStyles = mode === 'dark' ? styles.darkTheme : styles.lightTheme;
  
  return (
    <View style={[styles.container, themeStyles]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  lightTheme: {
    backgroundColor: '#ffffff',
  },
  darkTheme: {
    backgroundColor: '#000000',
  },
});

export default GluestackUIProvider;