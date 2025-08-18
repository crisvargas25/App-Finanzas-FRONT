import React, { useContext } from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';
import { Image, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import BottomTabNavigator from './BottomTabNavigator';
import ProfileScreen from '../../features/profile/ProfileScreen';
import SettingsScreen from '../../features/SettingsScreens';
import AboutScreen from '../../features/AboutScreen';
import { DrawerParamList } from './types';
import { AuthContext } from '../../shared/contexts/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from './AppNavigator'; // Asegúrate de importar RootStackParamList

const Drawer = createDrawerNavigator<DrawerParamList>();

// Componente para el logotipo en el header
const LogoTitle = () => {
  return (
    <Image
      style={styles.logo}
      source={require('../../../assets/logoWhite.png')}
      resizeMode="contain"
    />
  );
};

export default function DrawerNavigator() {
  const { logout } = useContext(AuthContext);
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const handleLogout = () => {
    Alert.alert('Cerrar Sesión', '¿Estás seguro?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Confirmar',
        onPress: async () => {
          await logout();
          navigation.reset({
            index: 0,
            routes: [{ name: 'Auth' }],
          });
        },
      },
    ]);
  };

  return (
    <Drawer.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#373643',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        drawerActiveTintColor: '#3533cd',
        drawerInactiveTintColor: '#666',
        drawerStyle: {
          backgroundColor: '#f8f9fa',
        },
        drawerLabelStyle: {
          fontWeight: '600',
          fontSize: 12,
        },
        headerRight: () => (
          <TouchableOpacity onPress={handleLogout} style={{ marginRight: 15 }}>
            <Ionicons name="log-out-outline" size={24} color="#fff" />
          </TouchableOpacity>
        ),
      }}
    >
      <Drawer.Screen
        name="Tabs"
        component={BottomTabNavigator}
        options={{
          headerTitle: () => <LogoTitle />,
          title: '',
          drawerLabel: 'Inicio',
          drawerIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: 'Perfil',
          drawerLabel: 'Mi Perfil',
          drawerIcon: ({ color, size }) => (
            <Ionicons name="person-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          title: 'Configuración',
          drawerLabel: 'Configuración',
          drawerIcon: ({ color, size }) => (
            <Ionicons name="settings-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="About"
        component={AboutScreen}
        options={{
          title: 'Acerca de',
          drawerLabel: 'Acerca de',
          drawerIcon: ({ color, size }) => (
            <Ionicons name="information-circle-outline" size={size} color={color} />
          ),
        }}
      />
    </Drawer.Navigator>
  );
}

const styles = StyleSheet.create({
  logo: {
    width: 140,
    height: 40,
    right: 10,
  },
});