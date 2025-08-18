import React, { useContext } from 'react';
import { View, StyleSheet, TouchableOpacity, Image, Text, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import MainContainer from '../../../components/common/containers/mainContainer';
import StepButton from '../../../components/common/buttons/StepButton';
import { AuthContext } from '../../../shared/contexts/AuthContext';
import { AuthStackParamList } from '../../../app/navigation/types';

type NavigationProp = NativeStackNavigationProp<AuthStackParamList>;
const { width: screenWidth } = Dimensions.get('window');

export default function LoginScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { login } = useContext(AuthContext);

  const handleQuickLogin = async () => {
    try {
      await login('user@dev.com', '123', true); // <-- true activa el modo simulado
    } catch (err) {
      console.error('Error al iniciar sesión rápida', err);
    }
  };


  return (
    <MainContainer>
      <View style={styles.logoContainer}>
        <Image
          source={require('../../../../assets/MainLogos/MainBlack.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      <View style={styles.formContainer}>
        <Text style={styles.infoText}>
          Inicio de sesión deshabilitado para desarrollo. 
          Presiona el botón para entrar con usuario fijo.
        </Text>
      </View>

      <View style={styles.buttonContainer}>
        <StepButton text="Entrar como user:123" onPress={handleQuickLogin} />
      </View>
    </MainContainer>
  );
}

const styles = StyleSheet.create({
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 60,
  },
  logo: {
    width: Math.min(screenWidth * 0.7, 250),
    height: 60,
  },
  formContainer: {
    width: '100%',
    maxWidth: 400,
    marginBottom: 40,
    paddingHorizontal: 20,
  },
  buttonContainer: {
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
  },
  infoText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#555',
  },
});
