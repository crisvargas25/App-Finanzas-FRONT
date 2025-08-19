import React, { useState, useContext } from 'react';
import { View, StyleSheet, TouchableOpacity, Image, Alert, Text, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import MainContainer from '../../../components/common/containers/mainContainer';
import StepButton from '../../../components/common/buttons/StepButton';
import Input from '../../../components/forms/input';
import CurrencySelector from '../../../components/forms/currencySelector';
import TabSwitcher from '../hooks/tabSwitcher';
import { AuthContext } from '../../../shared/contexts/AuthContext';
import { AuthStackParamList } from '../../../app/navigation/types';

type NavigationProp = NativeStackNavigationProp<AuthStackParamList>;

const { width: screenWidth } = Dimensions.get('window');

export default function LoginScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { login, signup } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [confirmEmail, setConfirmEmail] = useState('');
  const [currency, setCurrency] = useState('');
  const [errorVisible, setErrorVisible] = useState(false);

  const handleTabChange = (tab: 'login' | 'signup') => {
    setActiveTab(tab);
    setEmail('');
    setPassword('');
    setName('');
    setConfirmEmail('');
    setCurrency('');
    setErrorVisible(false);
  };

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Error', 'Por favor completa ambos campos');
      setErrorVisible(true);
      return;
    }
    try {
      setErrorVisible(false);
      console.log('Attempting login with:', { email, password });
      await login(email.trim(), password.trim());
      Alert.alert('Éxito', 'Inicio de sesión exitoso'); // Opcional: feedback
    } catch (err: any) {
      console.error('Login error:', err.message);
      Alert.alert('Error', err.message || 'Correo electrónico o contraseña incorrectos. Inténtalo de nuevo.');
      setErrorVisible(true);
    }
  };

  const handleSignUp = async () => {
    if (!name || !email || !confirmEmail || !password || !currency) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      setErrorVisible(true);
      return;
    }
    if (email !== confirmEmail) {
      Alert.alert('Error', 'Los correos electrónicos no coinciden');
      setErrorVisible(true);
      return;
    }
    try {
      setErrorVisible(false);
      await signup({ name, email, password, currency });
      Alert.alert('Éxito', 'Cuenta creada correctamente');
      // No cambiamos a la pestaña de login ni seteamos isAuthenticated
      setName(''); // Opcional: limpia los campos
      setEmail('');
      setConfirmEmail('');
      setPassword('');
      setCurrency('');
    } catch (err: any) {
      console.error('Signup error:', err.message);
      Alert.alert('Error', err.message || 'No se pudo crear la cuenta. Inténtalo de nuevo.');
      setErrorVisible(true);
    }
  };

  const handleForgotPassword = () => {
    navigation.navigate('ForgetPass');
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

      <TabSwitcher onTabChange={handleTabChange} activeTab={activeTab} />

      {errorVisible && (
        <View style={styles.errorMessage}>
          <Text style={styles.errorText}>
            {activeTab === 'login'
              ? 'Correo electrónico o contraseña incorrectos.'
              : activeTab === 'signup' && email !== confirmEmail
              ? 'Los correos electrónicos no coinciden.'
              : 'Por favor completa todos los campos.'}
          </Text>
        </View>
      )}

      <View style={styles.formContainer}>
        {activeTab === 'signup' && (
          <Input placeholder="Nombre" value={name} onChangeText={setName} />
        )}

        <Input
          placeholder="email@gmail.com"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        {activeTab === 'signup' && (
          <Input
            placeholder="Confirmar email"
            value={confirmEmail}
            onChangeText={setConfirmEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        )}

        <Input
          placeholder="Contraseña"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        {activeTab === 'signup' && (
          <CurrencySelector
            value={currency}
            onValueChange={setCurrency}
            placeholder="Selecciona tu moneda"
          />
        )}

        {activeTab === 'login' && (
          <TouchableOpacity onPress={handleForgotPassword}>
            <Text style={styles.forgotPassword}>¿Olvidaste tu contraseña?</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.buttonContainer}>
        <StepButton
          text={activeTab === 'login' ? 'Iniciar Sesión' : 'Registrarse'}
          onPress={activeTab === 'login' ? handleLogin : handleSignUp}
        />
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
  },
  buttonContainer: {
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
  },
  forgotPassword: {
    textAlign: 'left',
    fontSize: 14,
    color: '#3533cd',
    marginTop: 10,
  },
  errorMessage: {
    backgroundColor: '#ff4d4f1A',
    borderLeftWidth: 3,
    borderLeftColor: '#ff4d4f',
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
    width: '100%',
    maxWidth: 400,
  },
  errorText: {
    color: '#ff4d4f',
    fontSize: 14,
  },
});