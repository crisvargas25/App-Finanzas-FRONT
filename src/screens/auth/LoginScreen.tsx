import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Image, TextInput, Alert } from 'react-native';
import { Text } from '../../components/ui/text';
import StepButton from '../../components/common/buttons/StepButton';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../contexts/AuthContext';
import MainContainer from '../../components/common/containers/mainContainer';
import TabSwitcher from '../../components/common/tabSwitcher';
import Input from '../../components/forms/input';


export default function LoginScreen() {
  const navigation = useNavigation();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');

  const handleTabChange = (tab: 'login' | 'signup') => {
    setActiveTab(tab);
    if (tab === 'signup') {
      navigation.navigate('SignUp' as never);
    }
  };

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Por favor ingresa email y contraseña');
      return;
    }

    try {
      const success = await login(email, password);
      if (success) {
        Alert.alert('Éxito', 'Login exitoso');
      } else {
        Alert.alert('Error', 'Credenciales incorrectas. Verifica tu email y contraseña.');
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo conectar al servidor. Verifica tu conexión a internet.');
    }
  };

  const handleSignUpTab = () => {
    navigation.navigate('SignUp' as never);
  };

  const handleForgotPassword = () => {
    navigation.navigate('ForgetPass' as never);
  };

  return (
    <MainContainer>
      <View style={styles.content}>
      <View style={styles.logoContainer}>
        <Image 
          source={require('../../../assets/MainLogos/MainBlack.png')} 
          style={styles.logo}
          resizeMode="contain"  //esto asegura que la imagen se ajuste al contenedor sin distorsionarse
        />
      </View>

      {/* Tab switcher */}
      <TabSwitcher onTabChange={handleTabChange} activeTab={activeTab} />

      {/* Form */}
      <View style={styles.formContainer}>
        <Input
          placeholder="email@gmail.com"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <Input
          placeholder="• • • • • • • •"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TouchableOpacity onPress={handleForgotPassword}>
          <Text size="smButton" type="navyBlueText" style={styles.forgotPassword}>
            forget password?
          </Text>
        </TouchableOpacity>
      </View>

      {/* Login button */}
      <View style={styles.buttonContainer}>
        <StepButton text="Login" onPress={handleLogin} />
      </View>
    </View>
    </MainContainer>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    justifyContent: 'space-between',
    zIndex: 2,
  },
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
    top: 150,
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
  forgotPassword: {
    textAlign: 'left',
  },
});