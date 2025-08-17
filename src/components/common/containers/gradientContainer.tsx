import Container from "../../ui/container";
import React from "react";
import GradientBackground from "../../ui/gradientBackground";
import { StyleSheet } from "react-native";

interface GradientContainerProps {
  children?: React.ReactNode;
  style?: object;
}

function GradientContainer({ children, style 

}: GradientContainerProps) {

  return (
        <Container
        maxWidth="screen"
        padding="md"
        background="transparent"
        gradient={<GradientBackground />}
        fullHeight
      scrollable
      style={style}
    >
      {children}
    </Container>
      
  );
}

export default GradientContainer;