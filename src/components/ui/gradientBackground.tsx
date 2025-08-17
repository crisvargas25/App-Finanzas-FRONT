import { Image, StyleSheet, View } from "react-native";

export function GradientBackground() {
  return (
      <Image
        source={require("../../../assets/imgs/BlurEffect.png")} 
        style={styles.backgroundImage}
        resizeMode="cover"
      />
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    position: "absolute",
    top: 480,
    width: "100%",
    height: 580,
    zIndex: -1,
  },
});

export default GradientBackground;

