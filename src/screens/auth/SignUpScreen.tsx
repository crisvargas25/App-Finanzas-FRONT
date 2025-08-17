import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Image, TextInput, Alert } from 'react-native';
import { Text } from '../../components/ui/text';
import StepButton from '../../components/common/buttons/StepButton';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../contexts/AuthContext';
import TabSwitcher from '../../components/common/tabSwitcher';
import MainContainer from '../../components/common/containers/mainContainer';

export default function SignUpScreen() {
  const navigation = useNavigation();
  const { signup } = useAuth();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [confirmEmail, setConfirmEmail] = useState('');
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('signup');

  const handleTabChange = (tab: 'login' | 'signup') => {
    setActiveTab(tab);
    if (tab === 'login') {
      navigation.navigate('Login' as never);
    }
  };

  const handleSignUp = async () => {
    if (!fullName || !email || !confirmEmail || !password) {
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

    const success = await signup({ fullName, email, password });
    if (success) {
      Alert.alert('Éxito', 'Cuenta creada exitosamente');
    } else {
      Alert.alert('Error', 'Hubo un problema al crear la cuenta');
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
          resizeMode="contain"  //esto asegura que la imagen se ajuste al contenedor sin distorsionarse
        />
      </View>

      {/* Tab switcher */}
      <TabSwitcher onTabChange={handleTabChange} activeTab={activeTab} />

      {/* Form */}
      <View style={styles.formContainer}>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Fullname"
            value={fullName}
            onChangeText={setFullName}
          />
        </View>

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

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="email@gmail.com"
            value={confirmEmail}
            onChangeText={setConfirmEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Password (min 6 characters)"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>

        {/* Currency selector placeholder */}
        <View style={styles.currencyContainer}>
          <Text size="sm" type="grayText">
            MXN
          </Text>
          <Text size="sm" type="grayText">
            ▼
          </Text>
        </View>
      </View>

      {/* Sign up button */}
      <View>
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
  tabContainer: {
    flexDirection: 'row',
    marginBottom: 40,
  },
  tab: {
    flex: 1,
    paddingBottom: 12,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#122c6f',
  },
  tabText: {
    fontWeight: '500',
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