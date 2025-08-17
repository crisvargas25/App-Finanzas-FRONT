import React from 'react';
import { Text as RNText, TextStyle, StyleSheet } from 'react-native';
import { fonts, fontSizes, fontWeights, lineHeights } from '../../styles/typography';

interface TextProps {
  children: React.ReactNode;
  size?: 'xs' | 'sm' | 'smButton' | 'md' | 'lg' | 'xl' | '2xl';
  type?: 'blackText' | 'whiteText' |'grayText' | 'navyBlueText' | 'cbBlueText';
  align?: 'left' | 'center' | 'right';
  className?: string;
  style?: TextStyle;
  color?: string;
}

export function Text({ 
  children, 
  size = 'sm',
  type = 'blackText',
  align = 'left',
  className,
  style,
  color
}: TextProps) {
  const textStyles = [
    styles.base,
    styles[type],
    styles[size],
    styles[align],
    color ? { color } : undefined,  
    style
  ];

  return (
    <RNText style={textStyles}>
      {children}
    </RNText>
  );
}

const styles = StyleSheet.create({
  base: {
    fontFamily: fonts.regular,
  },

  // Text colors
  blackText: {
    color: '#373643',
  },
  whiteText: {
    color: '#ffffff',
  },
  grayText: {
    color: '#BABABA',
  },
  navyBlueText: {
    color: '#122c6f',
  },
  cbBlueText: {
    color: '#3533cd',
  },

  // Font sizes with associated weights
  xs: {
    fontSize: fontSizes.xs,
    lineHeight: lineHeights.xs,
    fontFamily: fonts.medium,
  },
  sm: {
    fontSize: fontSizes.sm,
    lineHeight: lineHeights.sm,
    fontFamily: fonts.medium,
  },
  smButton: {
    fontSize: fontSizes.sm,
    lineHeight: lineHeights.sm,
    fontFamily: fonts.bold,
  },
  md: {
    fontSize: fontSizes.md,
    lineHeight: lineHeights.md,
    fontFamily: fonts.semiBold,
  },
  lg: {
    fontSize: fontSizes.lg,
    lineHeight: lineHeights.lg,
    fontFamily: fonts.bold,
  },
  xl: {
    fontSize: fontSizes.xl,
    lineHeight: lineHeights.xl,
    fontFamily: fonts.extraBold,
  },
  '2xl': {
    fontSize: fontSizes['2xl'],
    lineHeight: lineHeights['2xl'],
    fontFamily: fonts.extraBold,
  },

  // Text alignment
  center: {
    textAlign: 'center',
  },
  left: {
    textAlign: 'left',
  },
  right: {
    textAlign: 'right',
  },
});

export default Text;