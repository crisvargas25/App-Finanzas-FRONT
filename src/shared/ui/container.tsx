import React from 'react';
import { View, ScrollView, StyleSheet, Dimensions } from 'react-native';
import GradientBackground from './gradientBackground';

interface ContainerProps {
  children: React.ReactNode;
  style?: object;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full' | 'screen';
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  margin?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  centered?: boolean;
  background?: 'transparent' | 'white' | 'gray' | 'dark' | 'navy' | 'cbBlue' | 'primary';
  shadow?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
  gradient?: React.ReactNode;
  border?: boolean;
  fullHeight?: boolean;
  scrollable?: boolean;
}

const { height: screenHeight } = Dimensions.get('window');

const Container: React.FC<ContainerProps> = ({
  children,
  style,
  maxWidth = 'full',
  padding = 'md',
  margin = 'none',
  centered = false,
  background = 'transparent',
  shadow = 'none',
  gradient = null,
  rounded = 'none',
  border = false,
  fullHeight = false,
  scrollable = false,
}) => {
  const paddingValues = { none: 0, sm: 8, md: 16, lg: 24, xl: 32 };
  const marginValues = { none: 0, sm: 8, md: 16, lg: 24, xl: 32 };
  const backgroundColors = {
    transparent: 'transparent',
    white: '#ffffff',
    gray: '#BABABA',
    dark: '#373643',
    navy: '#122c6f',
    cbBlue: '#3533cd',
    primary: '#e0f2fe',
  };
  const borderRadiusValues = { none: 0, sm: 4, md: 8, lg: 12, xl: 16, full: 999 };

  const shadowStyles = {
    none: {},
    sm: { elevation: 1, shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2 },
    md: { elevation: 3, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 },
    lg: { elevation: 8, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 8 },
    xl: { elevation: 12, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.2, shadowRadius: 16 },
  };

  const baseStyle = [
    {
      width: '100%',
      padding: paddingValues[padding],
      margin: marginValues[margin],
      zIndex: 1,
      backgroundColor: backgroundColors[background],
      borderRadius: borderRadiusValues[rounded],
      ...(fullHeight && { minHeight: screenHeight }),
      ...(border && { borderWidth: 1, borderColor: '#e5e7eb' }),
      ...(centered && { alignSelf: 'center' }),
    },
    shadowStyles[shadow],
    style,
  ];

  const ContainerComponent = scrollable ? ScrollView : View;

  const content = (
    <ContainerComponent style={baseStyle}>
      {children}
    </ContainerComponent>
  );

  return (
    <>
      {gradient}
      {content}
      
    </>
  );
};

export default Container;
