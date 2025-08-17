import React from 'react';
import { TouchableOpacity } from 'react-native';
import { Button } from "../../ui/button";
import { Text } from "../../ui/text";
import { StyleSheet } from 'react-native';

interface StepButtonProps {
    children?: React.ReactNode;
    text?: string;
    onPress?: () => void;
    action?: 'primary' | 'secondary' | 'tertiary' | 'positive' | 'negative';
    type?: 'blackText' | 'whiteText' | 'grayText' | 'navyBlueText' | 'cbBlueText';
}

function StepButton({ 
  text, 
  onPress,
  children,
  action = 'primary',
  type = 'whiteText',
}: StepButtonProps) {
  const buttonStyles = [
    styles.buttonContainer,
  ];
  const getActionStyles = () => {
    if (action === 'tertiary') {
      return { backgroundColor: actionColors.tertiary, type: 'cbBlueText' };
    }
    else if (action === 'primary') {
      return { backgroundColor: actionColors.primary, type: 'whiteText' };
    }
  };

  return (
    <TouchableOpacity onPress={onPress} style={styles.buttonContainer}>
      <Button size='lg' action={action} variant="solid">
        <Text size="smButton" type={type} align='center'>{text}</Text>
      </Button>
    </TouchableOpacity>
  );
}

const actionColors = {
      primary: '#122c6f',
      secondary: '#a6a6a6',
      tertiary: '#ffffffff',
      positive: '#4ecd7fff',
      negative: '#d7515fff'
    };

const styles = StyleSheet.create({
  buttonContainer: {
    width: '100%',
    marginTop: 'auto', // pushes the button to the bottom
    paddingBottom: 60,
    top: 50,
  },

});

export default StepButton;