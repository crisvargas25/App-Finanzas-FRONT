import React from 'react';
import { View, ViewStyle, StyleSheet } from 'react-native';

interface CardProps {
  children: React.ReactNode;
  variant?: 'elevated' | 'outlined' | 'filled';
  className?: string;
  style?: ViewStyle;
  color?: string;
}

export function Card({ 
  children, 
  variant = 'elevated',
  className,
  style,
  color
}: CardProps) {
  const cardStyles = [
    styles.base,
    styles[variant],
    style,
    color ? { backgroundColor: color } : undefined,
  ];

  return (
    <View style={cardStyles}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: 12,
    marginTop: 18,
    padding: 10,
  },
  // Style variants
  elevated: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  outlined: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    shadowOpacity: 0,
    elevation: 0,
  },
  filled: {
    backgroundColor: '#f3f4f6',
    shadowOpacity: 0,
    elevation: 0,
  },
});

export default Card;