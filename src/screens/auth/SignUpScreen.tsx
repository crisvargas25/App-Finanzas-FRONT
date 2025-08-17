import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Image, TextInput, Alert } from 'react-native';
import StepButton from '../../components/common/buttons/StepButton';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../contexts/AuthContext';
import TabSwitcher from '../../components/common/tabSwitcher';
import MainContainer from '../../components/common/containers/mainContainer';
import Input from '../../components/forms/input';
import CurrencySelector from '../../components/forms/currencySelector';

export default function SignUpScreen() {
  const navigation = useNavigation();
  const { signup } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [confirmEmail, setConfirmEmail] = useState('');
  const [password, setPassword] = useState('');
  const [currency, setCurrency] = useState('MXN'); // Default currency
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('signup');

  const handleTabChange = (tab: 'login' | 'signup') => {
    setActiveTab(tab);
    if (tab === 'login') {
      navigation.navigate('Login' as never);
    }
  };

  const handleSignUp = async () => {
    if (!name || !email || !confirmEmail || !password || !currency) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }

    if (email !== confirmEmail) {
      Alert.alert('Error', 'Los emails no coinciden');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'La contraseña debe tener al menos 6 caracteres');
      return;
    }

    try {
      const success = await signup({ fullName: name, email, password, currency });
      if (success) {
        Alert.alert('Éxito', 'Cuenta creada exitosamente');
      } else {
        Alert.alert('Error', 'Hubo un problema al crear la cuenta. Verifica tus datos.');
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo conectar al servidor. Verifica tu conexión a internet.');
    }
  };

  const handleLoginTab = () => {
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

      {/* Tab switcher */}
      <TabSwitcher onTabChange={handleTabChange} activeTab={activeTab} />

      {/* Form */}
      <View style={styles.formContainer}>
        <Input
          placeholder="Name"
          value={name}
          onChangeText={setName}
        />
        <Input
          placeholder="email@gmail.com"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <Input
          placeholder="Confirm email"
          value={confirmEmail}
          onChangeText={setConfirmEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <Input
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        
        <CurrencySelector
          value={currency}
          onValueChange={setCurrency}
          placeholder="Selecciona tu moneda"
        />
      </View>
      
      {/* Sign up button */}
      <View style={styles.buttonContainer}>
        <StepButton text="Sign up" onPress={handleSignUp} />
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
  buttonContainer: {
    bottom: 25,
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
  currencyContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    paddingVertical: 12,
  },
});