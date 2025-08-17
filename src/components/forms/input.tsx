import React from "react";
import { TextInput, View, StyleSheet, TextInputProps } from "react-native";
import { fonts, fontSizes, lineHeights } from "../../styles/typography";

type InputTypes = 'blackText' | 'whiteText' | 'grayText' | 'navyBlueText' | 'cbBlueText';
type InputSizes = 'xs' | 'sm' | 'smButton' | 'md' | 'lg' | 'xl' | '2xl';

interface InputProps extends TextInputProps {
  type?: InputTypes;
  size?: InputSizes;
}

const typeColors: Record<InputTypes, string> = {
  blackText: "#373643",
  whiteText: "#FFF",
  grayText: "#BABABA",
  navyBlueText: "#122c6f",
  cbBlueText: "#3533cd",
};

const sizeStyles: Record<InputSizes, { fontSize: number; lineHeight: number; fontFamily: string }> = {
  xs: { fontSize: fontSizes.xs, lineHeight: lineHeights.xs, fontFamily: fonts.medium },
  sm: { fontSize: fontSizes.sm, lineHeight: lineHeights.sm, fontFamily: fonts.medium },
  smButton: { fontSize: fontSizes.sm, lineHeight: lineHeights.sm, fontFamily: fonts.bold },
  md: { fontSize: fontSizes.md, lineHeight: lineHeights.md, fontFamily: fonts.semiBold },
  lg: { fontSize: fontSizes.lg, lineHeight: lineHeights.lg, fontFamily: fonts.bold },
  xl: { fontSize: fontSizes.xl, lineHeight: lineHeights.xl, fontFamily: fonts.extraBold },
  "2xl": { fontSize: fontSizes["2xl"], lineHeight: lineHeights["2xl"], fontFamily: fonts.extraBold },
};

function Input({
  type = "blackText",
  size = "smButton",
  style,
  ...rest
}: InputProps) {
  return (
    <View style={styles.inputContainer}>
      <TextInput
        style={[
          styles.input,
          { 
            color: typeColors[type],
            fontSize: sizeStyles[size].fontSize,
            lineHeight: sizeStyles[size].lineHeight,
            fontFamily: sizeStyles[size].fontFamily,
          },
          style
        ]}
        placeholderTextColor="#BABABA"
        {...rest}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: "#BABABA",
    paddingVertical: 12,
    fontFamily: fonts.medium,
  },
});

export default Input;
