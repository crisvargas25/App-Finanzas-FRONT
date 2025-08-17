import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Image, TextInput, Alert } from 'react-native';
import { Text } from '../../components/ui/text';
import StepButton from '../../components/common/buttons/StepButton';
import { useNavigation } from '@react-navigation/native';
import MainContainer from '../../components/common/containers/mainContainer';
import Header from '../../components/common/headings/header';
import Header2 from '../../components/common/headings/header2';

export default function ForgetPassScreen() {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');

  const handleResetPassword = () => {
    if (!email) {
      Alert.alert('Error', 'Por favor ingresa tu email');
      return;
    }

    // Validación básica de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Error', 'Por favor ingresa un email válido');
      return;
    }

    Alert.alert(
      'Email enviado', 
      'Se ha enviado un enlace de recuperación a tu email',
      [{ text: 'OK', onPress: () => navigation.navigate('Login' as never) }]
    );
  };

  const handleBackToLogin = () => {
    navigation.navigate('Login' as never);
  };

  return (
    <MainContainer>
      {/* Logo */}
      <View style={styles.logoContainer}>
        <Image 
          source={require('../../../assets/MainLogos/MainBlack.png')} 
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      {/* Title */}
      <View style={styles.titleContainer}>
        <Text size="xl" type="blackText" >Recover Password</Text>
        <Text size="md" type="grayText" align="center">
          Enter your email address and we'll send you a link to reset your password.
        </Text>
      </View>

      {/* Form */}
      <View style={styles.formContainer}>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="email@gmail.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>
      </View>

      {/* Reset button */}
      <View style={styles.buttonContainer}>
        <StepButton text="Send Reset Link" onPress={handleResetPassword} />
        <TouchableOpacity onPress={handleBackToLogin} style={styles.backContainer}>
          <Text size="smButton" type="navyBlueText" align="center"> Back to Login </Text>
        </TouchableOpacity>
      </View>
    </MainContainer>
  );
}

const styles = StyleSheet.create({
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    margin: 100,
  },
  logo: {
    width: 250,
    height: 60,
  },
  titleContainer: {
    marginBottom: 40,
    alignItems: 'center',
  },
  formContainer: {
    marginBottom: 40,
  },
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    paddingVertical: 12,
    fontSize: 16,
    color: '#373643',
  },
  buttonContainer: {
    marginBottom: 38,
    top: 130,
  },
  backContainer: {
    marginTop: 60,
  },
});