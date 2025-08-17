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
    marginTop: 100,
  },
  logo: {
    width: 120,
    height: 40,
  },
  textContainer: {
  marginTop: 10,
  paddingHorizontal: 20,
  overflow: 'visible', // <-- Añadido
},

mainText: {
  fontWeight: 'bold',
  flexWrap: 'wrap',
  lineHeight: 54,    // más alto para evitar recorte
  paddingTop: 14,    // más espacio arriba
},

  imageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    bottom: 26,
  },
  moneyImage: {
    width: 500,
    height: 350,
  },
  buttonWrapper: {
  width: '100%',        // que ocupe toda la anchura de la pantalla
  paddingHorizontal: 20, // opcional, para que no toque los bordes
  marginBottom: 40,      // opcional, separación del fondo
  zIndex: 3,
},
});
