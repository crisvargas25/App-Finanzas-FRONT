import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';
import { Image, StyleSheet } from 'react-native';
import BottomTabNavigator from './BottomTabNavigator';
import ProfileScreen from '../../features/profile/ProfileScreen';
import SettingsScreen from '../../features/SettingsScreens';
import AboutScreen from '../../features/AboutScreen'; // Add this screen
import { DrawerParamList } from './types';

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