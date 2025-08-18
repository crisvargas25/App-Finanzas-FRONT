import React from 'react';
import { View, StyleSheet, Image, Dimensions } from 'react-native';
import { Text } from '../../../shared/ui/text';
import StepButton from '../../../components/common/buttons/StepButton';
import { useNavigation } from '@react-navigation/native';
import GradientContainer from '../../../components/common/containers/gradientContainer';
import MainContainer from '../../../components/common/containers/mainContainer';


const { width, height } = Dimensions.get('window');

export default function FirstScreen() {
  const navigation = useNavigation();

  const handleGetStarted = () => {
    navigation.navigate('Login' as never);
  };

  return (
    <GradientContainer>
      {/* Logo and main content */}
      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <Image
            source={require('../../../../assets/icons/iconWhite.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        <View style={styles.textContainer}>
  <Text
    size="2xl"
    type="blackText"
    align="left"
    style={styles.mainText}
  >
    Your money's{'\n'}best friend.
  </Text>
</View>

        {/* Money illustration */}
        <View style={styles.imageContainer}>
          <Image
            source={require('../../../../assets/imgs/dollar1stScreen.png')}
            style={styles.moneyImage}
            resizeMode="contain"
          />
        </View>
      </View>

      {/* Botón que ocupa toda la anchura y es totalmente clickeable */}
      <View style={styles.buttonWrapper}>
        <StepButton
          text="Get started"
          action="tertiary"
          type="cbBlueText"
          onPress={handleGetStarted}
        />
      </View>
    </GradientContainer>

  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    justifyContent: 'space-between',
    zIndex: 2,
  },
  logoContainer: {
    alignItems: 'flex-start',
    marginTop: 70,
    left: 14,
  },
  logo: {
    width: 120,
    height: 40,
  },
  textContainer: {
  marginTop: 8,
  paddingHorizontal: 20,
  overflow: 'visible', // esto es para permitir que el texto se desborde
},

mainText: {
  flexWrap: 'wrap', // esto es para permitir que el texto se ajuste en varias líneas
},

  imageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    bottom: 20,
  },
  moneyImage: {
    width: 500,
    height: 350,
  },
  buttonWrapper: {
  width: '100%',        // que ocupe toda la anchura de la pantalla
  paddingHorizontal: 20, // opcional, para que no toque los bordes
  zIndex: 3,
  bottom: 20,
},
});
