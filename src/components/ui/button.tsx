import React from 'react';
import { View, ViewStyle, StyleSheet } from 'react-native';

interface ButtonProps {
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'solid' | 'outlined' | 'link';
  action?: 'primary' | 'secondary' | 'tertiary' | 'positive' | 'negative';
  className?: string;
  style?: ViewStyle;
  color?: string;
}

export function Button({ 
  children, 
  size = 'md', 
  variant = 'solid',
  action = 'primary',
  className,
  style,
  color
}: ButtonProps) {
  const getActionStyles = () => {
    if (color) {
      if (variant === 'link') {
        return {};
      }
      return variant === 'outlined' 
        ? { borderColor: color, color: color }
        : { backgroundColor: color };
    }
    
    const actionColors = {
      primary: '#122c6f',
      secondary: '#a6a6a6', 
      tertiary: '#ffffffff',
      positive: '#4ecd7fff',
      negative: '#d7515fff'
    };
    
    const selectedColor = actionColors[action];
    
    if (variant === 'link') {
      return {};
    }
    
    return variant === 'outlined'
      ? { borderColor: selectedColor }
      : { backgroundColor: selectedColor };
  };

  const buttonStyles = [
    styles.base,
    styles[size],
    styles[variant],
    getActionStyles(),
    style,
  ];

    return (
        <View style={buttonStyles}>
        {children}
        </View>
    );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: 25,
  },
  // Size variants
  sm: {
    paddingVertical: 1,
    paddingHorizontal: 9,
  },
  md: {
    paddingVertical: 3,
    paddingHorizontal: 9,
  },
  lg: {
    paddingVertical: 20,
    paddingHorizontal: 9,
  },
  
  // Style variants
  solid: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  outlined: {
    borderWidth: 1.5,
    backgroundColor: 'transparent',
  },
  link: {
    backgroundColor: 'transparent',
    padding: 0,
  },
});


