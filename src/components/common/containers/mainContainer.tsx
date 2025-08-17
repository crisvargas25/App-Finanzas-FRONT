import Container from "../../ui/container";
import React from "react";

interface MainContainerProps {
  children?: React.ReactNode;
  style?: object;
}

function MainContainer({ children, style }: MainContainerProps) {
  return (
    <Container 
      maxWidth="screen" 
      padding="md" 
      background= "white"
      fullHeight 
      scrollable
      style={style}
    >
      {children}
    </Container>
  );
}

export default MainContainer;