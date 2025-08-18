import React, { useState, useContext } from 'react';
import { View, StyleSheet, TouchableOpacity, Image, Alert, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import MainContainer from '../../../components/common/containers/mainContainer';
import StepButton from '../../../components/common/buttons/StepButton';
import Input from '../../../components/forms/input';
import CurrencySelector from '../../../components/forms/currencySelector';
import TabSwitcher from '../hooks/tabSwitcher';
import { AuthContext } from '../../../shared/contexts/AuthContext';
import { AuthStackParamList } from '../../../app/navigation/types';
import Text from '../../../shared/ui/text';

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
      Alert.alert('Error', 'Please complete all fields.');
      setErrorVisible(true);
      return;
    }
    try {
      setErrorVisible(false);
      console.log('Attempting login with:', { email, password });
      await login(email.trim(), password.trim());
      Alert.alert('Éxito', 'Login success'); // Opcional: feedback
    } catch (err: any) {
      console.error('Login error:', err.message);
      Alert.alert('Error', err.message || 'Email or password is incorrect. Please try again.');
      setErrorVisible(true);
    }
  };

  const handleSignUp = async () => {
    if (!name || !email || !confirmEmail || !password || !currency) {
      Alert.alert('Error', 'Please complete all fields');
      setErrorVisible(true);
      return;
    }
    if (email !== confirmEmail) {
      Alert.alert('Error', 'Emails do not match');
      setErrorVisible(true);
      return;
    }
    try {
      setErrorVisible(false);
      await signup({ name, email, password, currency });
      Alert.alert('Éxito', 'Account created successfully');
      // No cambiamos a la pestaña de login ni seteamos isAuthenticated
      setName(''); // Opcional: limpia los campos
      setEmail('');
      setConfirmEmail('');
      setPassword('');
      setCurrency('');
    } catch (err: any) {
      console.error('Signup error:', err.message);
      Alert.alert('Error', err.message || 'The account could not be created. Please try again.');
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
              ? 'Email or password is incorrect.'
              : activeTab === 'signup' && email !== confirmEmail
              ? 'Emails do not match.'
              : 'Please fill in all fields.'}
          </Text>
        </View>
      )}

      <View style={styles.formContainer}>
        {activeTab === 'signup' && (
          <Input placeholder="Name" value={name} onChangeText={setName} />
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
            placeholder="Confirm email"
            value={confirmEmail}
            onChangeText={setConfirmEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        )}

        <Input
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        {activeTab === 'signup' && (
          <CurrencySelector
            value={currency}
            onValueChange={setCurrency}
            placeholder="Select currency"
          />
        )}

        {activeTab === 'login' && (
          <TouchableOpacity onPress={handleForgotPassword}>
            <Text type="navyBlueText" size="smButton">¿Did you forget your password?</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.buttonContainer}>
        <StepButton
          text={activeTab === 'login' ? 'Login' : 'Sign-up'}
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
    marginBottom: 30,
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 20,
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